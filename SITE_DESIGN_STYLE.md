# Site Design Style

## Current homepage direction — September 2026

The homepage recreates the full visual structure of https://xyhan.com/index.html: warm off-white paper (`#fafaf8`), Inter/Newsreader typography, a centered identity badge, three spatial work chapters, fullscreen archive, résumé printer, AI panel and quiet three-column footer. The badge is upright at rest and uses the reference pointer tilt, glare, spring and 1.022 hover scale. `public/style/badge-*.css` and `public/js/badge-*.js` own these surfaces; `profile.css` and `js/profile-*.js` adapt real George content and bilingual UI. Fonts are local. The old portfolio.css and identity-card.css are no longer loaded.

Use George's existing portrait, bilingual resume copy, and actual project screenshots. Eight work examples are grouped into AI commerce, cross-platform engineering and commerce experiences; related facets are not represented as separate employers. Project pages use the reference's flip transition and return-position restoration. Mobile and reduced-motion views use semantic stacked chapters. The printer displays George's real résumé and opens a print view for browser PDF saving, never the reference person's document. Do not restore the removed ByteDance page implicitly.

The older dark-layout guidance below describes the previous design and does not override this homepage direction.

This document captures the design language of the current `web-resume` site. It should guide future edits so the resume keeps a focused portfolio identity instead of drifting into a generic landing page.

## Style Positioning

The site is a bilingual portfolio resume for George Y., a frontend engineer with ByteDance and Douyin E-commerce experience. It should feel:

- precise and engineering-led
- calm, dark, and editorial
- credible for interviewers and recruiters
- compact enough for scanning
- immersive only where it helps explain work

The page is not a SaaS product page. Do not add product mockups, pricing sections, marketing CTAs, broad feature grids, or startup-style decorative sections.

## Core Surfaces

### Home Resume

The home page is a two-pane resume:

- fixed intro pane on desktop
- content pane with About, Experience, and Projects
- sticky section labels on smaller screens
- concise cards for experience and projects
- language switch and public links in the intro chrome

The home page should stay fast to scan. Prefer editing existing sections over adding new narrative blocks.

### ByteDance Work Detail

The work detail page is an immersive work story:

- fixed top bar with brand, detail navigation, language switch, and public links
- large first viewport centered on ByteDance and the high-traffic commerce story
- summary facts for company, business, focus, and period
- timeline, themes, and deep dives as the primary story taxonomy

The detail page can be more cinematic than the home page, but it should remain resume-like: no confidential specifics, no fictional product screenshots, and no decorative filler.

## Color System

The palette is intentionally narrow and dark.

| Role | Color | Usage |
| --- | --- | --- |
| Page | `#0f172a` | Main dark canvas |
| Page soft | `#111c33` | Subtle depth |
| Ink | `#e2e8f0` | Primary headings |
| Text | `#cbd5e1` | Strong supporting text |
| Muted | `#94a3b8` | Body copy |
| Dim | `#64748b` | Secondary UI |
| Accent | `#5eead4` | Active state, tags, progress |
| Line | `rgba(148, 163, 184, 0.16)` | Quiet borders |
| Card | `rgba(30, 41, 59, 0.48)` | Hover and framed resume items |

Do not introduce a broad palette. Blue and teal can coexist, but teal remains the explicit accent. Avoid turning the page into a purple/blue gradient theme.

## Typography

Use system UI typography:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif
```

Typography should stay practical:

- large type only for page identity and the ByteDance hero
- compact headings inside resume cards
- readable body text with generous line height
- uppercase labels only for navigation, section labels, kickers, and facts
- `letter-spacing: 0` for normal copy

## Layout Principles

- Use the existing two-pane home layout as the default resume shell.
- Use the existing immersive detail layout only for substantial work stories.
- Keep cards at `8px` radius through `--radius`.
- Avoid cards inside cards.
- Let spacing and section rhythm carry the layout before adding new borders or shadows.
- On mobile, content must stack cleanly and avoid horizontal overflow.

## Interaction Style

Interactions should be quiet and functional:

- smooth in-page navigation
- section-aware nav state
- 2px scroll progress
- subtle hover lift on cards and public links
- language switch with `aria-pressed`
- reduced-motion support

Avoid flashy animation, parallax gimmicks, large pointer effects, or interactions that make the resume harder to read.

## Content Voice

Copy should be concrete, restrained, and public-safe.

Good:

- "Built frontend features for Douyin E-commerce."
- "Balanced business messaging, user experience, performance cost, and gradual rollout."
- "The details here are intentionally abstracted so they stay suitable for public discussion."

Avoid:

- inflated impact claims without context
- confidential product details
- long paragraphs where a timeline item would scan better
- generic AI or productivity buzzwords

## What To Preserve

- bilingual Chinese/English content
- dark resume canvas and teal accent
- fixed intro pane on desktop home
- fixed top bar on desktop detail page
- timeline, themes, and deep dives as the ByteDance story taxonomy
- public links and language switch in page chrome
- pure static hosting on GitHub Pages

## What To Avoid

- reverting to a SaaS landing page shape
- adding build tooling for small content changes
- decorative product mockups or fake screenshots
- broad color palettes
- nested cards
- stale selectors or style rules without live markup
- copy that reveals company or product-sensitive details
