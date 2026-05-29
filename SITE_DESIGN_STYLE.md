# Site Design Style

This document captures the design language of the current `mailPilot` website in this project. It is meant to guide future edits without changing the page into a different product style.

## Style Positioning

The site is an Apple-inspired SaaS product landing page: calm, polished, product-led, and highly controlled. It should feel like a premium productivity tool rather than a playful startup page or a dense enterprise dashboard.

The core impression should be:

- cinematic but quiet
- product-first, with interface previews as the main visual asset
- minimal, confident copy
- strong contrast between dark hero/security areas and clean white workflow areas
- focused blue actions, not a colorful marketing palette

## Visual Keywords

- Apple-like
- premium SaaS
- calm productivity
- inbox cockpit
- dark glass navigation
- poster-like hero
- realistic UI mockups
- focused blue accent
- spacious product storytelling

## Page Rhythm

The page should read as a sequence of large product posters:

1. A dark full-viewport hero with centered copy and a large product preview.
2. A short white intro section that states the product promise.
3. Alternating workflow bands with text on one side and UI mockups on the other.
4. A dark trust/security section.
5. A soft-gray pricing section.
6. A final dark CTA/footer.

Avoid making the page feel like a list of cards. Each major section should feel like its own scene.

## Layout Principles

- Use full-width sections with constrained inner content.
- Keep hero and section copy centered when the section is poster-like.
- Use two-column layouts for workflow and trust sections on desktop.
- Collapse to single-column layouts on tablet/mobile.
- Use generous section padding and clear vertical separation.
- Let gutters and background changes separate content, not heavy borders.
- UI mockups can be framed, but page sections should not become nested cards.

Recommended structure:

- Global nav: fixed, 44px tall, dark translucent glass.
- Hero: dark background, centered copy, large product mockup below.
- Workflow bands: white background, 12px soft-gray section dividers.
- Security: black/dark background, privacy UI preview.
- Pricing: soft gray background, simple white pricing panel.

## Color System

The palette is intentionally narrow.

| Role | Color | Usage |
| --- | --- | --- |
| Page white | `#ffffff` | Main page background and workflow sections |
| Soft gray | `#f5f5f7` | Section dividers, pricing background, subtle UI fills |
| Primary text | `#1d1d1f` | Main text on light surfaces |
| Muted text | `rgba(0, 0, 0, 0.58)` | Supporting copy |
| Black canvas | `#000000` | Hero, security, final CTA |
| Dark surface | `#161617` | Dark UI panels and nav family |
| Light text | `#f5f5f7` | Headlines on dark sections |
| Light muted text | `rgba(255, 255, 255, 0.68)` | Supporting copy on dark sections |
| Primary blue | `#0071e3` | Primary CTAs and active UI state |
| Bright blue | `#2997ff` | Links or active states on dark backgrounds |
| Success green | `#32d74b` | Small status indicators only |

Do not introduce a broad rainbow palette. Product UI details may use blue/green status accents, but the page chrome should stay neutral.

## Typography

The site uses Apple-like system typography:

```css
"SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif
"SF Pro Display", "SF Pro Icons", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif
```

Type should feel clean and controlled:

- Display headlines: large, 600 weight, tight line height.
- Body copy: medium size, muted color, readable line height.
- Nav text: very small and quiet.
- Buttons: regular weight, never heavy or shouty.
- Letter spacing should stay `0`; avoid decorative tracking.

Approximate scale:

- Hero headline: `64px` desktop, `48px` tablet, `40px` mobile.
- Section headline: `56px` desktop, `48px` tablet, `40px` mobile.
- Workflow heading: `40px` desktop, smaller on mobile.
- Body/subhead: `21px` to `26px` for marketing copy.
- UI mockup text: `11px` to `15px`, compact and functional.

## Components

### Global Navigation

- Fixed at the top.
- Height: `44px`.
- Dark translucent background with blur.
- Brand on the left, nav links centered, CTA on the right.
- Mobile collapses into a full-screen dark menu.
- Hover states should be subtle color changes.

### Hero

- Dark canvas.
- Centered headline, subhead, and two CTA buttons.
- Large product mockup below the copy.
- The mockup should feel like a polished app window, not a generic screenshot.
- Use subtle glass and border effects only inside the mockup.

### Product Mockups

Mockups are central to the identity of the page.

They should:

- look like real productivity software
- use dense but organized UI
- include sidebars, lists, message panes, panels, tabs, and status indicators
- use small text and restrained controls
- avoid cartoon or decorative illustration

The mockups should not:

- look like random cards
- use excessive gradients
- use fake marketing icons as the primary visual
- overuse shadows or bright colors

### Buttons

Primary CTA:

- blue fill
- white text
- fully rounded pill
- regular font weight

Secondary CTA:

- transparent background
- blue text and border
- fully rounded pill

Small in-app buttons inside mockups can use 8px-10px radii, because they represent software UI rather than page CTAs.

### Workflow Bands

- Alternating text and interface preview.
- White background.
- Soft-gray divider between bands.
- Copy should be short and outcome-oriented.
- UI previews should prove the feature instead of merely decorating it.

### Security Section

- Dark background.
- Trust message with a privacy/permission UI preview.
- Use lock/person/shield-style glyphs.
- Keep the section serious and calm.

### Pricing Section

- Soft gray background.
- One simple pricing panel.
- Use a minimal checklist.
- Avoid complicated pricing grids unless the product actually needs them.

## Interaction Style

Interactions should be subtle:

- smooth scroll
- slight button translate on hover
- small color changes on nav hover
- tab changes inside the AI panel
- mobile menu open/close

Avoid flashy animation, parallax gimmicks, large bouncy effects, or decorative motion.

## Copywriting Voice

Copy should be short, confident, and concrete.

Good:

- "Email, cleared for landing."
- "Sort the runway"
- "Draft in your voice"
- "Your inbox copilot."

Avoid:

- long feature explanations
- buzzword-heavy AI claims
- vague productivity promises
- excessive exclamation marks

The voice should feel premium and composed: practical enough for SaaS, but with a small amount of aviation metaphor to support the `mailPilot` name.

## Responsive Behavior

Desktop:

- full nav links visible
- hero mockup can show multiple app columns
- workflow bands use two columns

Tablet:

- hide some mockup panels if needed
- workflow bands collapse earlier than text becomes cramped
- keep section padding generous

Mobile:

- nav becomes menu button
- hero headline around `40px`
- mockups may crop horizontally but must not create page overflow
- workflow mockups become single-column
- pricing and footer stack cleanly

Every breakpoint should preserve the same premium feel. Do not simply shrink everything until it becomes unreadable.

## What To Preserve In Future Edits

- Fixed dark glass nav.
- Dark cinematic hero.
- Blue as the only primary action color.
- Large centered product promise.
- Interface mockups as the main visual material.
- Alternating story sections.
- Minimal, confident copy.
- High spacing and restrained decoration.

## What To Avoid

- Marketing-card overload.
- Purple/blue gradient SaaS cliches.
- Decorative blobs or bokeh backgrounds.
- Emoji-driven UI.
- Heavy shadows around every section.
- Overly rounded cards nested inside other cards.
- Long paragraphs of explanatory copy.
- Landing-page hero split into text column plus image card.
- A one-note blue theme that removes the black/white contrast.

## Practical Checklist Before Shipping Changes

- Does the page still feel Apple-like and product-led?
- Is the main visual a real product/interface state?
- Are CTAs simple blue pills or restrained outlines?
- Is copy shorter than it feels comfortable to write?
- Are section backgrounds doing the separation instead of decorative cards?
- Does the mobile layout avoid horizontal overflow?
- Are colors still mostly black, white, soft gray, and blue?
- Did any new animation make the page feel less calm?
