# AI Search Reflection Tracker Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add an ApexArc site feature that audits a URL or draft content for AI-search visibility, E-E-A-T signals, answer-first structure, schema readiness, and improvement opportunities.

**Architecture:** Build this in two layers. Layer one is a public-facing product page plus an interactive audit interface inside the Astro site. Layer two is a Netlify function that fetches a target URL or accepts pasted content, computes deterministic SEO/AEO checks, then calls an LLM for AI-search-specific recommendations and rewrite guidance. The response should return structured scores, reasons, and prioritized fixes.

**Tech Stack:** Astro 5, Netlify Functions, vanilla client-side JavaScript inside Astro islands or inline script, OpenRouter via server-side fetch, existing ApexArc design system, lightweight heuristics in local utilities.

---

## Product framing

Call the feature **AI Search Reflection Tracker**.

It should answer four questions for a visitor:
1. How visible is my page for AI-search style answers?
2. How strong are my E-E-A-T signals?
3. What exactly is missing from my page structure?
4. What should I rewrite first to improve ranking and citation likelihood?

The output should feel like an operator tool, not a generic SEO score toy.

## Core scoring dimensions

Return a 0-100 score for each dimension plus a weighted overall score:
- **Answer-First Clarity** — does the page answer the likely query early?
- **Intent Match** — informational / commercial / transactional fit.
- **E-E-A-T Signals** — author proof, experience proof, trust assets, specificity.
- **Information Gain** — originality, examples, screenshots, data, case proof.
- **AI Overview Readiness** — quotable blocks, headings, FAQs, concise explanations.
- **Technical SEO Hygiene** — title, meta description, headings, schema hints, internal linking.
- **Content Depth** — breadth vs fluff, topic coverage, evidence density.
- **Actionability** — whether the page gives next steps or practical guidance.

## Required output shape from the API

```json
{
  "url": "https://example.com/page",
  "overallScore": 74,
  "queryIntent": "commercial",
  "aiReflectionSummary": "The page is credible but not quotable enough for AI overviews.",
  "scores": [
    {
      "id": "eeat",
      "label": "E-E-A-T Signals",
      "score": 61,
      "reason": "The page has service claims but limited proof and no visible author context."
    }
  ],
  "strengths": [
    "The opening makes the offer clear.",
    "Subheadings are readable and scannable."
  ],
  "gaps": [
    "No proof block with client outcomes or screenshots.",
    "No FAQ or schema-backed answer blocks."
  ],
  "priorityFixes": [
    {
      "title": "Add answer-first summary block",
      "impact": "high",
      "why": "Improves AI citation readiness and user clarity.",
      "example": "In the first 100 words, define the exact problem, solution, and who it is for."
    }
  ],
  "rewriteSuggestions": {
    "intro": "Suggested rewritten opening paragraph...",
    "faq": [
      "What problem does this page solve?",
      "Who is this service for?"
    ]
  }
}
```

---

### Task 1: Confirm existing site integration points

**Objective:** Identify the exact page, navigation, and component insertion points before adding the tracker.

**Files:**
- Read: `src/data/site.ts`
- Read: `src/pages/index.astro`
- Read: `src/pages/services.astro`
- Read: `src/pages/products.astro`
- Read: `netlify/functions/chat.mjs`

**Step 1: Inspect current marketing structure**

Confirm where a new product/tool page should live and whether it should appear in the top nav or only through CTA sections.

**Step 2: Inspect existing Netlify function style**

Reuse the same response helpers, no-store caching, and OpenRouter server-side pattern already used by `netlify/functions/chat.mjs`.

**Step 3: Record constraints**

Keep the site static-first, preserve current dark premium style, and avoid adding a heavyweight framework.

**Step 4: Commit**

```bash
git add docs/plans/2026-05-01-ai-search-reflection-tracker.md
git commit -m "docs: add ai search reflection tracker plan"
```

---

### Task 2: Add structured tracker data to site config

**Objective:** Centralize copy and positioning for the new feature.

**Files:**
- Modify: `src/data/site.ts`

**Step 1: Add a new exported config object**

Add something like:

```ts
export const aiSearchTracker = {
  eyebrow: "AI Search Visibility",
  title: "See how well your page reflects in AI search before traffic stalls.",
  intro:
    "ApexArc audits your page for AI overview readiness, E-E-A-T strength, answer-first structure, and practical SEO improvements.",
  primaryCta: {
    label: "Run a page audit",
    href: "/ai-search-reflection-tracker"
  },
  proofPoints: [
    "Scores E-E-A-T, content structure, schema readiness, and information gain",
    "Explains why a page is weak in AI search, not just what the score is",
    "Returns prioritized rewrite suggestions for better ranking and citation odds"
  ]
};
```

**Step 2: Keep language productized**

Position it as a custom ApexArc capability, not a generic toy widget.

**Step 3: Verify TypeScript structure**

Run:

```bash
npm run build
```

Expected: build may still fail if later tasks are incomplete, but there should be no `site.ts` syntax errors.

---

### Task 3: Create the tracker landing page

**Objective:** Add a dedicated route for the feature.

**Files:**
- Create: `src/pages/ai-search-reflection-tracker.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/services.astro` or `src/pages/products.astro`

**Step 1: Create the new page**

The page should include:
- hero explaining the problem
- short explanation of the score dimensions
- interactive audit form shell
- sample scorecard preview
- CTA to contact ApexArc for deeper implementation

**Step 2: Link it from the site**

Add a homepage teaser section or CTA card linking to `/ai-search-reflection-tracker`.

**Step 3: Add one service/product mention**

Mention that ApexArc can build custom AI-search visibility systems, not only run one-off audits.

**Step 4: Verify route generation**

Run:

```bash
npm run build
```

Expected: route `/ai-search-reflection-tracker/` appears in Astro output.

---

### Task 4: Build reusable presentation components

**Objective:** Keep the tracker UI modular and easy to style.

**Files:**
- Create: `src/components/AiSearchAuditForm.astro`
- Create: `src/components/AiSearchScoreGrid.astro`
- Create: `src/components/AiSearchPriorityFixes.astro`
- Optionally create: `src/components/ScoreMeter.astro`

**Step 1: Build the form component**

Inputs:
- target URL
- optional target query
- optional pasted draft content
- optional page type select (`blog`, `service`, `product`, `landing`)

Buttons:
- `Run audit`
- `Load sample result`

**Step 2: Build score display components**

Each score card should render:
- label
- numeric score
- one-line reason
- visual meter

**Step 3: Build fixes component**

Priority fixes should show:
- title
- impact level
- explanation
- example rewrite or structure suggestion

**Step 4: Keep design aligned**

Use existing glass-card styling and spacing conventions from the site.

---

### Task 5: Add deterministic audit utilities

**Objective:** Compute fast, explainable checks before asking the LLM anything.

**Files:**
- Create: `src/lib/ai-search-audit.mjs`
- Create: `src/lib/ai-search-scoring.mjs`

**Step 1: Add content extraction helpers**

Functions should derive:
- title length
- meta description presence
- H1 count
- heading density
- FAQ-like sections
- paragraph length
- author/byline presence
- date presence
- list/table presence
- internal link count
- outbound link count
- schema markers in HTML

**Step 2: Add heuristic scoring**

Score categories with explicit rules, for example:
- answer-first score drops if the first 100 words are vague
- E-E-A-T score drops if there is no byline, no proof, and no real examples
- AI overview readiness rises with direct definitions, FAQs, bullets, and concise sections

**Step 3: Keep results serializable**

Return plain objects only.

**Step 4: Unit-like verification through node import**

Run:

```bash
node --input-type=module -e "import('./src/lib/ai-search-scoring.mjs').then(m => console.log(Object.keys(m)))"
```

Expected: exported functions print successfully.

---

### Task 6: Create the Netlify audit function

**Objective:** Expose a server-side endpoint that runs the audit and returns structured results.

**Files:**
- Create: `netlify/functions/ai-search-audit.mjs`

**Step 1: Reuse JSON response helpers**

Mirror the response shape and error handling style from `netlify/functions/chat.mjs`.

**Step 2: Accept structured POST payload**

```json
{
  "url": "https://example.com/page",
  "query": "how to rank product page in ai search",
  "pageType": "service",
  "content": "optional pasted markdown or plain text"
}
```

**Step 3: Fetch and parse source content**

If `url` is provided:
- fetch HTML
- strip scripts/styles
- extract text, title, headings, meta description, and links

If `content` is provided:
- analyze it directly without network fetch

**Step 4: Run deterministic audit first**

Call the utilities from `src/lib/ai-search-audit.mjs` and `src/lib/ai-search-scoring.mjs`.

**Step 5: Run LLM enhancement second**

If `OPENROUTER_API_KEY` exists, send the condensed audit facts plus content excerpt to OpenRouter and ask for:
- intent classification
- summary judgment
- top strengths
- top gaps
- priority fixes
- rewritten intro suggestion
- FAQ suggestions

The model must return strict JSON.

**Step 6: Fallback gracefully**

If the LLM call fails, still return deterministic scores with basic recommendations.

**Step 7: Verify locally**

Run:

```bash
npm run build
```

Expected: Netlify function bundle still builds.

---

### Task 7: Wire the page form to the function

**Objective:** Make the tracker actually usable on the website.

**Files:**
- Modify: `src/components/AiSearchAuditForm.astro`
- Modify: `src/pages/ai-search-reflection-tracker.astro`

**Step 1: Add client-side submit logic**

Use a small inline module script that POSTs to `/.netlify/functions/ai-search-audit`.

**Step 2: Add UI states**

Render:
- idle
- loading
- success
- failure

**Step 3: Display structured results**

On success, populate score grid, strengths, gaps, and priority fixes components.

**Step 4: Add sample data mode**

Include a local sample audit payload so the page still feels alive even before live API use.

---

### Task 8: Add schema and conversion support

**Objective:** Make the page itself rank well and convert interested leads.

**Files:**
- Modify: `src/pages/ai-search-reflection-tracker.astro`
- Modify: `src/layouts/MainLayout.astro` if needed for schema injection hooks

**Step 1: Add FAQ-style content**

Include concise sections such as:
- What is AI search reflection?
- How is this different from normal SEO?
- What does the tracker score?
- Who is this for?

**Step 2: Add structured data**

Prefer `FAQPage` and `SoftwareApplication` or `Service` schema depending on the final positioning.

**Step 3: Add strong CTA copy**

Offer a custom implementation/audit service for businesses that want this installed as an internal system.

---

### Task 9: Add internal linking from relevant pages and blog posts

**Objective:** Use the current site structure to strengthen discoverability.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/services.astro`
- Modify: `src/pages/products.astro`
- Optionally modify: relevant files in `src/content/blog/*.md`

**Step 1: Add contextual links**

Link phrases such as:
- `AI search visibility`
- `E-E-A-T audit`
- `AI overview readiness`
- `content reflection tracker`

**Step 2: Keep anchors descriptive**

Do not use `click here`.

**Step 3: Verify no awkward copy regression**

Review wording in-browser after build.

---

### Task 10: Build, test, and document verification

**Objective:** Confirm the feature works and is ready for deployment.

**Files:**
- Modify if needed: journal note under `~/.hermes/vault/Conversations/...`

**Step 1: Run production build**

```bash
npm install
npm run build
```

Expected: Astro build succeeds, blog routes render, tracker route renders.

**Step 2: Verify critical routes**

At minimum verify:
- `/`
- `/blog/`
- `/blog/[existing-post-slug]/`
- `/ai-search-reflection-tracker/`

**Step 3: Smoke test tracker UX**

Use a local preview or browser session to confirm:
- form submits
- sample mode works
- success state renders correctly
- error state is readable

**Step 4: Push and deploy**

```bash
git status
git add .
git commit -m "feat: add ai search reflection tracker"
git push origin main
```

**Step 5: Verify live deployment**

Confirm the tracker page loads on the production domain and that the function responds without exposing secrets.

---

## Recommended implementation order right now

1. Finish the existing blog/build/deploy work already in flight.
2. Add the tracker as a dedicated route and UI shell.
3. Add the deterministic audit utilities.
4. Add the Netlify function with OpenRouter enhancement.
5. Add schema/internal linking and validate in-browser.

## Sharp recommendation

Do **not** build this as a generic full SEO platform first. Start with a narrow, high-signal tool for service pages and blog posts. That is enough to make ApexArc look serious, generate leads, and produce better internal content decisions without drifting into dashboard bloat.
