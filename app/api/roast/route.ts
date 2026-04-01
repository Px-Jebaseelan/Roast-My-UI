import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Redis } from '@upstash/redis';

// 1. Initialize Upstash ONLY if credentials exist to prevent hard dev crashes
const redisDb = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// 2. In-Memory Fallback Limiter (Immune to Webpack Dev-Mode HMR Flushes)
const globalForLimiter = globalThis as unknown as { rateLimitMap: Map<string, { count: number; expiresAt: number }> };
const rateLimitMap = globalForLimiter.rateLimitMap || new Map<string, { count: number; expiresAt: number }>();
if (process.env.NODE_ENV !== 'production') globalForLimiter.rateLimitMap = rateLimitMap;

const MAX_REQUESTS = 3; 
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const BASE_RULES = `
<rules>
1. Output ONLY valid JSON. No markdown (\`\`\`json), no txt.
2. Escape quotes/newlines. Use SINGLE quotes (') for HTML attributes.
3. Use ONLY Tailwind v4 utility classes. NO arbitrary values (e.g. w-[30px]).
4. Mobile-first (sm:, md:), include hover/focus interactivity.
5. Assets: Use Unsplash. Icons: Inline SVG.
6. Fallback: If image lacks UI, output {"error": "INVALID_INPUT"}.
</rules>
<metrics>1.WCAG Contrast 2.Hierarchy 3.Proximity</metrics>
`;

const ROAST_SCHEMA = `
<schema>
{"roast":"A 2-sentence critique. If the UI is average, broken, or mediocre: be witty, ruthless, and heavily critical (Tone: Gordon Ramsay of Tech). IMPORTANT: ONLY if the design is absolute top-tier, Apple/Stripe-level perfection, are you allowed to break character, show shock, and praise it. Otherwise, roast it relentlessly.","flaws":["Specific UI violation 1","Specific alignment/spacing error"],"code_html":"<div class='flex'>...</div>"}
</schema>
`;

const PRAISE_SCHEMA = `
<schema>
{"roast":"A warm, deeply encouraging 2-sentence compliment. Even if the UI is bad, find something nice to say before gently offering enhancements. If it's great, shower it with absolute admiration.","flaws":["A brilliant structural choice","A beautiful aesthetic line"],"code_html":"<div class='flex'>...</div>"}
</schema>
`;

const REACT_SCHEMA = `
<output_schema>
{
"architecture": {
"layout.tsx": "export default function Layout({ children }: { children: React.ReactNode }) { return <div className='flex'>{children}</div>; }",
"Dashboard.tsx": "import Sidebar from './Sidebar';\\nimport { motion } from 'framer-motion';\\n\\nexport default function Dashboard() {\\n  return (\\n    <motion.div initial={{opacity:0}} animate={{opacity:1}}>\\n      <Sidebar />\\n    </motion.div>\\n  );\\n}",
"Sidebar.tsx": "import { motion } from 'framer-motion';\\nexport default function Sidebar() { return <aside>Navigation</aside>; }"
}
}
</output_schema>
`;

function extractJson(text: string) {
  // If the model ignores the prompt and wraps in markdown ```json ... ```
  const markdownRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
  const match = text.trim().match(markdownRegex);
  if (match && match[1]) {
    return JSON.parse(match[1]);
  }
  
  // Fallback: Attempt forced parsing (sometimes there is pre-text and post-text)
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonString = text.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
  }

  // If all fails, parse it normally and pray
  return JSON.parse(text);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Enterprise Rate Limiting Architecture (Redis -> Memory Fallback)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous_ip';
    let isRateLimited = false;

    if (redisDb) {
      // UPSTASH REDIS CLOUD DATABASE EXECUTION
      const redisKey = `roaster_limit_${ip}`;
      // Atomic increment sets data to 1 if it doesn't exist
      const requests = await redisDb.incr(redisKey);
      
      if (requests === 1) {
        // First request: Expiration binds to 24-hour block constraint natively (86400 seconds)
        await redisDb.expire(redisKey, 86400);
      } else if (requests > MAX_REQUESTS) {
        isRateLimited = true;
      }
    } else {
      // IN-MEMORY DEV-MODE FALLBACK
      const now = Date.now();
      const userLimit = rateLimitMap.get(ip);

      if (userLimit) {
        if (now > userLimit.expiresAt) {
          rateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
        } else if (userLimit.count >= MAX_REQUESTS) {
          isRateLimited = true;
        } else {
          rateLimitMap.set(ip, { count: userLimit.count + 1, expiresAt: userLimit.expiresAt });
        }
      } else {
        rateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
      }
    }

    if (isRateLimited) {
       return NextResponse.json(
         { 
            error: 'RATE_LIMIT_EXCEEDED', 
            message: 'Daily processing limit reached. To protect AI integrity, anonymous traffic is strictly clamped.'
         }, 
         { status: 429 }
       );
    }

    const body = await req.json();
    const { imageBase64, chatMessage, previousHtml, persona = 'roast', designSystem, mode = 'html' } = body;

    if (!imageBase64 && mode === 'html') {
      return NextResponse.json({ error: 'Missing image payload. Please provide imageBase64.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ error: 'Server configuration error: Gemini API key is missing' }, { status: 500 });
    }

    // Strip the data:image prefix to get raw base64 if it exists
    const base64Data = imageBase64 ? imageBase64.replace(/^data:image\/(.*);base64,/, '') : '';

    const SYSTEM_ROLE = persona === 'praise' 
      ? '<role>You are an elite, highly empathetic Principal UI Engineer. Your job is to find the beauty in any design, compliment the user excessively, and provide a stunning, gently modernized Tailwind component upgrade.</role>'
      : '<role>You are an elite, fiercely honest Principal UI Engineer. You analyze UI objectively. If the UI is average or bad, you MUST roast it ruthlessly. ONLY if the design is an absolute 10/10 masterpiece, you admit defeat and heavily praise the user.</role>';
    
    let DESIGN_INJECTION = '';
    if (designSystem) {
       let spatialInstruction = 'p-4';
       if (designSystem.spatialDensity === 'compact') spatialInstruction = 'p-2 max margins';
       else if (designSystem.spatialDensity === 'spacious') spatialInstruction = 'p-12 max spacing';

       let physicsInstruction = 'transition-all hover:opacity-80';
       if (designSystem.animationPhysics === 'static') physicsInstruction = 'STATIC NO MOTION';
       else if (designSystem.animationPhysics === 'bouncy') physicsInstruction = 'hover:scale-105 duration-500';

       let toneInstruction = 'DARK_MODE(Zinc/Black)';
       if (designSystem.colorTheme === 'light') toneInstruction = 'LIGHT_MODE(White)';
       else if (designSystem.colorTheme === 'neon') toneInstruction = 'NEON_CYBERPUNK(Black_Glow)';

       DESIGN_INJECTION = `
<config>
REQUIREMENTS:
- colors: ${designSystem.primaryColor}
- font: ${designSystem.fontFamily}
- border: ${designSystem.borderRadius}
- shadow: ${designSystem.shadowDepth}
- density: ${spatialInstruction}
- motion: ${physicsInstruction}
- theme: ${toneInstruction}
</config>`;
    }

    let ACTIVE_PROMPT = '';
    let activePrompt = '';
    
    if (mode === 'react') {
      ACTIVE_PROMPT = `<role>You are an elite Principal React Architect. You must read the provided HTML and rip it entirely into isolated, atomic React functional components using Framer Motion and Lucide React.</role>\n\n` + REACT_SCHEMA;
      activePrompt = `Decompose this monolithic HTML into atomic, highly professional React components (.tsx) mapped strictly to the output JSON keys. \n\nThe HTML to decompose:\n${previousHtml}`;
    } else {
      ACTIVE_PROMPT = SYSTEM_ROLE + '\n\n' + DESIGN_INJECTION + '\n\n' + BASE_RULES + '\n\n' + (persona === 'praise' ? PRAISE_SCHEMA : ROAST_SCHEMA);
      activePrompt = "Analyze this UI.";
      if (chatMessage && previousHtml) {
         activePrompt = `
[REVISION_MODE]
Instruction: "${chatMessage}"
Prev HTML: ${previousHtml}
-> Output new JSON implementing instruction.
         `;
      }
    }

    const model = genAI.getGenerativeModel({
       model: 'gemini-2.5-flash',
       systemInstruction: ACTIVE_PROMPT,
       generationConfig: {
         responseMimeType: "application/json",
         // Remove temperature restrictions for React mode to encourage accurate TSX transpilation
         temperature: mode === 'react' ? 0.2 : undefined,
       }
    });

    const payloadParts: any[] = [];
    if (imageBase64) {
       payloadParts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/png'
          }
       });
    }
    payloadParts.push(activePrompt);

    const result = await model.generateContent(payloadParts);

    const responseText = result.response.text();
    
    // Robust parsing layer
    let jsonPayload;
    try {
      jsonPayload = extractJson(responseText);
    } catch (parseError) {
      console.error('JSON Extraction Failed. Raw Output:', responseText);
      return NextResponse.json({ 
        error: 'Critical Error: The AI engine hallucinated an invalid response schema.',
        details: 'The AI returned text that could not be parsed as pure JSON. Please try uploading the image again.'
      }, { status: 500 });
    }

    // Validate structure
    if (jsonPayload.error) {
       return NextResponse.json({ error: jsonPayload.error }, { status: 400 });
    }

    return NextResponse.json(jsonPayload, { status: 200 });
  } catch (error: any) {
    console.error('API /roast error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request. The server encountered an unexpected error.', details: error.message },
      { status: 500 }
    );
  }
}
