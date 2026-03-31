# ApexArc Global Website

Marketing site for ApexArc Global, built as a static Astro project and deployed on Netlify.

## What This Project Is

This site positions ApexArc Global as an automation partner for startups and growing businesses.
The offer is centered around:

- Agentic workflows and AI agents
- Custom SaaS products and internal business tools
- Chatbots, CRM automation, and voice agents

The design direction is premium, dark, futuristic, and conversion-focused, with a Spline-based hero scene on the homepage.
The homepage also includes a lead-gen AI chatbot that is designed to qualify visitors and capture project details.

## Stack

- Astro
- Custom HTML/CSS/JavaScript
- Spline Viewer web component for the homepage 3D scene
- Netlify Function for the chatbot backend
- Netlify for hosting and deployment

There is no React, no Three.js, and no React Three Fiber in the current implementation.

## Important Files

- `src/data/site.ts`: central content model for navigation, services, process, FAQs, and contact info
- `src/layouts/MainLayout.astro`: shared layout, metadata, fonts, and Spline viewer script
- `src/pages/index.astro`: homepage and Spline hero integration
- `src/components/ChatbotDock.astro`: homepage chatbot UI and Netlify lead form markup
- `src/styles/global.css`: full visual system, layout, and hero styling
- `public/scripts/site.js`: lightweight interactions for navigation, reveal effects, and utility behavior
- `netlify/functions/chat.mjs`: OpenAI-powered chatbot endpoint
- `netlify/lib/chatbot-config.mjs`: chatbot system prompt, response schema, and qualification rules
- `src/lib/chatbot-content.mjs`: client-facing chatbot prompts and public knowledge content
- `netlify.toml`: Netlify build config

## Current Site Structure

- Home
- Services
- Products
- Process
- About
- Contact

## Hero / 3D Notes

The homepage hero uses this Spline scene:

- `https://prod.spline.design/zWe6iJkNdAhpdlGn/scene.splinecode`

The hero currently uses the official Spline web component and a branded visual mask near the bottom-right corner. If the Spline logo should be removed completely, the best fix is to disable the logo in Spline publish/export settings at the source.

## Chatbot Notes

The homepage chatbot is:

- Homepage-only in v1
- Focused on qualification and lead capture
- Powered by an OpenAI call through a Netlify Function
- Backed by a hidden Netlify Form for storing captured project details

Required environment variable:

- `OPENAI_API_KEY`

If `OPENAI_API_KEY` is missing, the chatbot UI still renders but falls back to a friendly "assistant is being configured" message and pushes the visitor to email.

## Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Astro telemetry is disabled in npm scripts so the project runs cleanly in this environment.

## Deployment

The site is deployed to:

- `https://apexarcglobal.com`

Netlify builds from this Astro project. `netlify.toml` is configured to publish `dist/`.

## Good Next Features

- Replace direct email CTA with a Netlify form or smart lead form
- Add a site chatbot or AI assistant
- Add CMS-backed editing for services, FAQs, and future case studies
- Add real product pages if ApexArc launches packaged SaaS offerings
- Add case studies, proof, and testimonials once available
- Add motion refinement or a more customized Spline hero scene

## Notes For Future Updates

- Keep the site lightweight and static-first unless a feature truly needs a backend
- Prefer editing `src/data/site.ts` for copy and structured content before changing component markup
- Preserve the premium visual language: bold typography, dark surfaces, restrained glow, and minimal clutter
- If more 3D is added, prefer Spline or lightweight embeds before moving to a heavier 3D runtime
