# 🔥 Roast My UI | Trinity Engine

![Roast My UI Cover Banner](./public/og-image.png)

**Roast My UI** is an elite, multi-agent AI engineering platform built to relentlessly dissect, critique, and instantly rewrite user interface screenshots into atomic React and Tailwind CSS functional components. 

Engineered for the modern Web3/Cyberpunk aesthetic, the application seamlessly bridges the gap between raw UI wireframes and hyper-optimized production HTML using the *Google Gemini 2.5 Flash Vision* model.

## 🚀 Key Features

### 1. The Multi-Persona Analyst
Switch between two distinct artificial intelligence identities to suit your development style:
- **Gordon Ramsay (Roast Mode)**: A fiercely honest Principal UI Engineer. If your UI is terrible, it will ruthlessly diagnose heuristic violations. If your UI is phenomenal, it breaks character to shower you with genuine praise.
- **Bob Ross (Praise Mode)**: An empathetic hype-man engineered to find the beauty in any layout block, offering gentle, ethereal improvements.

### 2. The Magic Eraser (Client-Side Bounding Box)
Don't want to scan the entire screen? Utilize our native bounding box to dynamically crop specific DOM components on the fly! Works flawlessly across Desktop (Mouse events) and Mobile Safari/Android WebKit (Native Touch Events).

### 3. Voice Synthesis Engine
Equipped with a robust client-side `SpeechSynthesis` array. Hear the AI physically read out the UI analysis in a tailored, deliberately paced Gordon Ramsay / Cyberpunk auditory profile. Voice streams are garbage-collected instantly replacing overlapping glitches.

### 4. CodeLive: The Sandbox IFrame
Why just read code when you can see it? Any generated monolithic HTML or decomposed `.tsx` atomic component architecture is actively streamed and interpreted securely via an isolated `<iframe srcdoc="...">` renderer. Features inline hot-reloading with the official `Monaco Editor`.

---

## 🏗️ Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript throughout the core and Edge functions
- **Styling**: Tailwind CSS V4 + Framer Motion (Glassmorphism aesthetics)
- **AI Brain**: `@google/generative-ai` (Gemini 2.5 Flash native multimodality)
- **Editor Integration**: `@monaco-editor/react`
- **Database / Rate Limiting**: Upstash Redis (Enterprise Serverless Edge Caching)
- **Analytics**: Vercel Web Analytics 

---

## ⚙️ Architecture & Data Pipelines

### Hybrid Rate Limiting
To protect against automated AI model scraping, traffic is protected natively:
- **Vercel Deployments**: Handled by Upstash Redis `incr()` edge databases to strictly limit anonymous IPs to **3** generations per 24-hours.
- **Localhost Development**: Features an intelligent Node `globalThis` persistent fallback `Map` array, rendering the engine completely immune to Turbopack Hot Module Reload wipes without throwing 500 errors!

### Compression Pipeline
Client-side image inputs (up to extremely large payload sizes) are forcefully downscaled by `browser-image-compression` strictly bounding resolutions relative to dynamic **Quick** or **Pro** scan settings, radically optimizing Vercel edge function payloads while preserving optical clarity for Gemini.

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/Px-Jebaseelan/roast-my-ui.git
cd roast-my-ui
npm install
```

### 2. Environment Variables (`.env.local`)
You must configure your API engine layers:
```env
# Required: The LLM Engine
GEMINI_API_KEY=your_gemini_key_here

# Optional: Serverless Production Rate Tracking
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 3. Fire Up NextJS
```bash
npm run dev
```
By default, this server allows your local mobile devices to bypass NextJS 15 dev HMR blocks so you can physically scan QR codes or share IPs locally on your Wi-Fi dynamically!

---

## 🌍 Production Launch (Vercel)

This application is strictly configured and mapped for single-click deployment to Vercel. SEO OpenGraph properties and Metadata endpoints physically match `.png` targets native to the App Router automatically. 

```bash
npx vercel build
npx vercel --prod
```

## 📜 Roadmap (Phase 2)
The next progression of the Phoenix Trinity project is **Steal My UI** — converting this engine into an isolated Google Chrome browser extension capable of traversing DOM blobs natively inside the user's browser, transmitting layout hierarchies statically to the AI.

---
*Built by [Phoenix Trinity](https://phoenixtrinity.com)*
