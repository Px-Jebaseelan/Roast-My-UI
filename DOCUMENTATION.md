# 📖 Roast My UI | Technical Documentation

This document serves as the deep systematic architecture reference manual for the **Roast My UI** (Trinity Engine) application. It spans the integration logic of the frontend components, the backend serverless infrastructure, the Gemini AI configuration, and mobile-responsive event coordination APIs.

---

## 🏗️ 1. Directory Structure

The application strictly adheres to the Next.js 15 App Router standard:

```text
roast-my-ui/
├── app/
│   ├── api/
│   │   └── roast/
│   │       └── route.ts         # The Primary Gemini AI Engine & Upstash Redis Rate Limiter
│   ├── components/
│   │   ├── layout/              # Navbars, Footers, Config Drawers
│   │   ├── output/              # CodeLive sandbox IFrame, Terminal renderer
│   │   ├── ui/                  # Atomic sub-components (CopyBadges, Buttons)
│   │   └── workspace/           # The core scanning mechanics (DropZone, ImageCropper, SplitScreen)
│   ├── hooks/
│   │   └── useVoiceSynthesis.ts # The Gordon Ramsay auditory cyber-voice engine
│   ├── utils/
│   │   └── [utility_scripts]    # Compression, encoding algorithms
│   ├── globals.css              # Core Tailwind v4 baseline and animations
│   ├── layout.tsx               # Root Metadata, SEO OpenGraph, and Vercel Analytics wrapper
│   └── page.tsx                 # Core Stateful Controller (The brain of the interface)
├── public/                      # Static assets, OG image cards, icons
└── next.config.ts               # Webpack compiler directives, Local Network Whitelists
```

---

## 🧠 2. The AI Architecture (`app/api/roast/route.ts`)

The backend engine is a Next.js Serverless Route that acts as the prompt arbitration layer between the user and Google's `Gemini 2.5 Flash` multimodal LLM.

### 2.1 Context Injection & Personas
The system utilizes **Prompt Matrices** injected instantly on-the-fly depending on the user's selected configuration:
- **`ROAST_SCHEMA`**: Configures the AI to act as an elite, hyper-critical UI Engineer. If it detects terrible UI, it roasts relentlessly. If it detects highly optimized professional aesthetics, the prompt specifically commands the AI to "admit defeat," break character, and provide elite-level praise.
- **`PRAISE_SCHEMA`**: Recontextualizes the exact same model to hunt for beautiful intent, framing flaws as "brilliant structural intents requiring gentle modernization."
- **`REACT_SCHEMA`**: An alternate schema executed when the user toggles "React Output". It strips the HTML constraints entirely and commands the extraction of atomic, Framer Motion-compliant `.tsx` React components isolated by routing paths.

### 2.2 Enterprise Rate Limiting
To preserve the financial integrity of the API key, the `route.ts` function implements a dual-layer architectural queue:
1. **Primary Interface:** The `@upstash/redis` serverless driver executing an atomic `.incr()` calculation bound to the user's IP. A strict `86400` seconds (24 hours) TTL binds the user to max **3 executions** globally.
2. **Local Fallback:** A `globalThis` persistent Map instance ensures localhost test development remains robust across volatile Webpack HMR recompilations if the `.env` keys are empty.

---

## 🖱️ 3. The Workspace Mechanics (`app/components/workspace`)

The Workspace handles all image acquisition and rendering before transmission to the Gemini engine.

### 3.1 DropZone (`DropZone.tsx`)
A physics-driven file boundary.
- Overlays natively executed `<input type="file" className="opacity-0 z-50">` directly over the entire container. This is a deliberate defense mechanism against iOS Safari / Android Chrome attempting to sandbox synthetic React `onClick` events.
- Validates the binary payload using the `browser-image-compression` protocol, actively dynamically clamping image dimensions depending on whether **Quick Scan** (1024px) or **Pro Scan** (1920px) is configured via the Engine slider.

### 3.2 ImageCropper (`ImageCropper.tsx` - The Magic Eraser)
A highly sophisticated `<canvas>` boundary manipulation engine.
- Translates natively generated `MouseEvent` coordinate parameters interchangeably alongside raw target `TouchEvent` arrays. This guarantees that Apple and Google Mobile devices can seamlessly draw and execute cropping rectangles physically.
- Calculates dynamic scale ratios comparing visually constrained DOM pixel boundaries instantly against the intrinsic pixel array resolution of the hidden image object.

### 3.3 SplitScreen (`SplitScreen.tsx`)
A Framer Motion layout grid displaying comparative Before and After interfaces concurrently over three independent column layouts tracking source images, raw DOM representation, and contextual chat interactions simultaneously.

---

## 🎙️ 4. Voice Auditory APIs (`useVoiceSynthesis.ts`)

A bespoke React Hook tapping into your browser's native Window-level `SpeechSynthesis` node.

**Technical Highlights:**
- **Garbage Collection:** Enforces a `.cancel()` protocol universally immediately before initiating a `.speak()` function. This prevents "audio-stacking," guaranteeing the voice never speaks over itself if the machine aggressively parses multiple AI messages simultaneously.
- **Pitch and Speed Velocity:** It forcibly intercepts the `en-GB` language voice algorithms (or falls back linearly to `en-US`), heavily downpitching the frequency block (`pitch: 0.6`) to approximate a colder, more professional cyber-announcer aesthetic.

---

## 🎨 5. The Vercel Configuration & SEO (`layout.tsx`)

The overall container is bound for massive multi-node deployments securely:
- **Vercel Web Analytics** securely bound inside the base `RootLayout` via `@vercel/analytics/react`.
- **OpenGraph Headers (OG)** manually targeted to an absolute path parsing `/og-image.png` ensuring that Discord, X (Twitter), Slack, and LinkedIn ingest the high-definition cyberpunk neon terminal representation of the program when developers share URIs.
- **Cross-Origin Dev Access.** The Next.js 15 Webpack `allowedDevOrigins` matrix enables mobile endpoints (e.g. `10.217.147.188`) to attach seamlessly to local area network hot module reload hooks natively through `next.config.ts`.

---
*End of documentation. Roast My UI | version: 1.0.0*
