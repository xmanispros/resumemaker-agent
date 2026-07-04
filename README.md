# ResumeMaker Agent

Online resume maker free PDF — no payment, no forced login. Built with **Astro** + **Tailwind CSS**.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:4321

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
  layouts/BaseLayout.astro     Shared shell: nav, footer, dark mode, fonts, SEO meta
  pages/
    index.astro                Home (includes a live dark-mode demo switch)
    templates.astro            90+ template gallery with sample-data thumbnails, filterable
    builder.astro               Agent-guided multi-step form + live split preview
    download.astro              Final preview, single ad gate, free PDF export
    faq.astro                   FAQ with exact copy + FAQPage schema.org markup
    privacy-policy.astro        Privacy policy
    terms-and-conditions.astro  Terms & conditions
    disclaimer.astro            Disclaimer
    contact.astro                Contact form (opens a pre-filled email)
    sitemap.xml.ts               Generated sitemap, referenced from robots.txt
  lib/
    templates.ts                 ~90 templates generated from a palette x layout matrix,
                                  each with sample demo data for realistic thumbnails
    resumeEngine.js               Renders resume data -> HTML for any template
    resumeState.js                 localStorage persistence for in-progress resume
  styles/global.css               Tailwind layers, iOS-style switch ("dongle"), .ios-card,
                                   and the .rsm-* resume-document design system
```

## Design system notes

- **Color**: white/gray surfaces with soft iOS-style shadows (`.ios-card`, `shadow-ios`),
  large rounded corners (`rounded-2xl`), and a single accent color (`teal` token,
  set to iOS blue `#0A84FF`) used consistently for buttons, links, and the active switch.
- **Dark mode switch**: a functional iOS-style toggle ("dongle") appears in the nav on
  every page and again as a live demo widget on the homepage hero — both stay in sync
  via `data-theme-switch` and shared `localStorage` state.
- **Footer FAQ widget**: every page footer includes an auto-scrolling ticker of FAQ
  questions (paused on hover, respects `prefers-reduced-motion`) plus a 4-question
  accordion — both aid SEO crawlability and link through to the full `/faq` page.
- **Template thumbnails**: each of the 90 templates renders its sample data (name, role,
  skills) directly in the thumbnail using its real accent color and layout, so what you
  see in `/templates` is what you'll get in the builder.

## Before you launch

1. **AdSense**: replace `ca-pub-XXXXXXXXXXXXXXXX` in `BaseLayout.astro` and
   `download.astro` with your real publisher ID, and the `data-ad-slot` with
   your real ad unit slot.
2. **Domain**: update `site` in `astro.config.mjs`, the `siteUrl` constant in
   `BaseLayout.astro`, and `siteUrl` in `sitemap.xml.ts` — `robots.txt` already
   points to `/sitemap.xml` on whichever domain you deploy to.
3. **Templates**: add more entries to `src/lib/templates.ts` — the generator
   function (`buildVariants`) makes it cheap to add new palette/layout combos.
4. **Contact form**: currently opens the user's email client with a pre-filled
   message (no backend required). Swap in a real form endpoint if you'd
   rather receive submissions directly.

## How the agent workflow works

1. **Required step**: full name, profile photo, and one contact method
   (email *or* mobile) — nothing else is asked up front.
2. **Optional prompt**: "Would you like to add more details?" — Yes reveals
   accordion sections (summary, skills, education, experience, projects,
   links); No skips straight to the template + download step.
3. **Live preview**: every keystroke re-renders the resume using the
   selected template; switching templates never clears entered data because
   all form state lives in one object persisted to `localStorage`.
4. **Download**: one ad slot shown once per session before the PDF is
   generated client-side with `html2canvas` + `jsPDF` — no server, no
   watermark, no login.
