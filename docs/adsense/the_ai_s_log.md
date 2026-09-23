# The AI's Log: Website Development Guidelines & Training Manual

## 1. Core Philosophy & Overview
This document serves as the master training log and instruction manual for building our web applications. The primary goal is to **destroy "AI Slop"**—the generic, formulaic, and instantly recognizable output that AI models default to. 

Everything we build must look, feel, and read as though a high-end human design agency spent tens of thousands of dollars creating it. We prioritize high conversion, unique brand identity, and authentic user experiences over quick, generic outputs.

---

## 2. The "Slop" Ban List (WHAT NOT TO DO)
*Never use or generate the following elements unless explicitly instructed otherwise.*

### Visual & Design Slop to Avoid
- **Banned Colors:** No purple/indigo/violet gradients. No glowing neon on near-black backgrounds ("midnight palette").
- **Banned Elements:** No abstract 3D blobs, floating 3D toruses, or glowing artifacts standing in for actual products. 
- **Banned Layouts:** No generic, straight-down-the-center alignments. Avoid "Triplet Syndrome" (three identical feature/testimonial cards in a perfect row).
- **Banned Backgrounds:** No graph-paper lattice (faint grid dot or line patterns) behind the hero section. 
- **Banned Fonts:** Kill the default AI fonts. Never default to **Inter** or standard system sans-serifs.

### Copywriting & Text Slop to Avoid
- **Banned Words/Phrases:** "Delve", "ever-evolving", "game-changing", "in the realm of", "it is important to note", "not only... but also".
- **Punctuation Quirk:** Do not use unspaced em-dashes (e.g., word—word). If using an em-dash, format it like a human.
- **Formatting:** No verbosity or fluff. Do not write three sentences when one will do. Do not hallucinate or make up unverified facts.

---

## 3. Best Practices (WHAT TO DO)
*Follow these rules to ensure high-quality, premium outputs.*

### Context & Inspiration First
- **Never Guess:** Always start by collecting deep context (specs, decisions, user avatars) before writing code.
- **Steal Before You Prompt:** Use real design references (e.g., Awwwards, Dribbble, Site Inspire, Lapa Ninja, Motion.ai). Reference specific URLs and explain *what* we like about them (e.g., "I like how the image overlaps the text," not just "make it look like this").
- **Clone & Restyle:** Instead of letting AI hallucinate a layout, clone proven UI architectures (like Shadcn UI defaults or established high-converting sites) and restyle them with our unique data, typography, and colors. Don't reinvent the wheel.

### Prompting Strategy
- **One Target Per Prompt:** Do not try to fix 4 things at once. Focus on one specific section or component per prompt.
- **Be Specific:** Never ask for a "vibe." Provide exact HEX codes instead of asking for "a cream color."
- **Generate Variations (Worktrees):** When designing a section, cast a wide net. Generate 3-5 different aesthetic variations side-by-side (e.g., small, medium, and large changes), pick the best one, and iterate from there.

---

## 4. Specific Design Rules

### Typography
- Choose unique, expressive fonts (use resources like Fontshare) that fit the specific brand.
- Limit to **one display font** to keep the design clean.
- Set body text to **16-18px** for maximum readability.

### Color
- **Give Every Color a Job:** Keep the majority of the page neutral (clean base colors for readable text).
- Use bold colors sparingly. Every pop of color must earn its place—use it strictly to guide the user's eye to important calls-to-action (CTAs) or links.

### Spacing & Layout
- Use an **8-point spacing system** (margins and paddings must be multiples of 8: 8, 16, 24, 32, etc.) to ensure a structured, intentional alignment.
- **Break the Center:** Use asymmetric layouts (e.g., 60/40 splits in the hero section) rather than centering everything.

### Media & Animations
- **Real Imagery:** Use high-quality, realistic images and videos (via Higgsfield MCP or custom assets). Do not use generic stock or AI-slop graphics.
- **Scroll Animations:** Embed cinematic scrolling animations (e.g., Apple-style scroll effects) into landing and about pages to make the website feel alive and premium.

---

## 5. Copywriting Rules
- **Copy Dictates Design:** Nail the messaging *before* putting everything into the design template.
- **Don't Make Me Think:** The website should require zero cognitive load to understand. Use "System 1" thinking. 
- **Name the Pain First:** Address the user's problem immediately. 
- **One Ask Per Screen:** Every viewport height should focus on one single thought or Call to Action (CTA).
- **Humanize:** Run copy checks to de-slop text. Ensure the tone is punchy, specific, and visual (e.g., "5 minutes on the train counts" instead of "Learn anywhere").

---

## 6. Approved Tools & Integrations
When applicable, utilize the following skills and tools to enhance the build:
- **Impeccable / Taste Skills:** For refining UI components, fixing AI tells, improving typography, and adjusting spacing.
- **Higgsfield MCP:** For generating high-quality hero imagery, custom video assets, and scroll animations.
- **Shadcn UI (or similar foundational systems):** Use default component stylings strictly without letting AI invent its own messy UI blocks.
- **De-slop / Audit Check:** Before finalizing, audit the site against universal slop (bad copy, em-dashes) and company-specific slop (brand identity, tone). 

*End of Log.*