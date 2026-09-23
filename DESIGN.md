---
name: Resume Studio
description: Local bilingual resume editing and PDF proof workbench
colors:
  ink: "#182a36"
  muted: "#566875"
  accent: "#245e89"
  accent-soft: "#e8f0f7"
  rail: "#172f40"
  line: "#dbe2e7"
  paper: "#fff"
  canvas: "#e8edf1"
  focus: "#2c79b3"
typography:
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "18px"
    fontWeight: 650
    letterSpacing: "-0.02em"
  title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "17px"
    fontWeight: 600
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "13px"
    lineHeight: 1.7
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "12px"
    fontWeight: 550
  source:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "12px"
    lineHeight: 1.7
rounded:
  control: "6px"
  inset: "4px"
spacing:
  tight: "4px"
  control-gap: "8px"
  compact: "12px"
  region-gap: "16px"
  section: "24px"
  editor-inline: "26px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 11px"
  section-choice:
    backgroundColor: "{colors.accent-soft}"
    textColor: "#164f79"
    rounded: "{rounded.control}"
    padding: "6px 10px"
  version-choice:
    backgroundColor: "#305168"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 10px"
  mode-choice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    rounded: "{rounded.inset}"
    padding: "5px 12px"
---

# Design System: Resume Studio

## Overview

**Creative North Star: "Proof workbench"**

A proof workbench puts quiet editing surfaces beside a real generated document. Marine navigation, white sheets and a cool canvas separate regions without ornamental framing. Compact bilingual interface typography keeps the emphasis on writing and checking.

This system applies only to `tools/resume-studio`, the local Resume Studio. It does not prescribe the incumbent public portfolio, its typography, or generated PDF page design.

**Key Characteristics:**
- Cool tonal separation with restrained blue selection.
- Compact bilingual controls and readable field leading.
- A document sheet receives depth; editing regions remain flat.

## Colors

Cool whites and blue-grays establish the workstation; marine anchors navigation and subdued blue marks action.

### Primary
- **Workbench blue** (`accent`): primary generation action, selected mode and source caret.
- **Selected blue wash** (`accent-soft`): selected sections and control hover.
- **Focus blue** (`focus`): visible keyboard outlines.

### Neutral
- **Marine** (`rail`): version navigation region.
- **Ink** (`ink`): primary interface text.
- **Muted slate** (`muted`): supporting labels and status text.
- **Paper** (`paper`): editing surface, controls and document sheet.
- **Proof canvas** (`canvas`): surrounding document workspace.
- **Rule gray** (`line`): region boundaries and control strokes.

**The State Has Words Rule.** Selection and freshness use explicit labels or semantic state attributes alongside color.

Dirty status uses amber text; errors use a pale warm surface and dark red text. These functional exceptions do not introduce decorative accent families.

## Typography

**Body and heading font:** the system sans stack in the tokens, with Chinese fallbacks. **Source font:** the monospace stack. There is no separate display face or promotional display role.

### Hierarchy
- **Headline:** document identity in the top bar; contracts to (16px) on mobile.
- **Title:** editable section heading.
- **Body:** field values with generous leading for Chinese and English.
- **Label:** field labels and compact navigation controls.
- **Source:** YAML editing with preserved monospace spacing.

Region headings use (14px, 650); proof headings use (13px). Small counters and auxiliary footer text use (10–11px), not primary editing text. Page counts use tabular numerals. The ramp is role-based rather than a geometric scale.

## Layout

Desktop uses a (218px) version rail, an editor column sized between (340px) and (430px), and a fluid proof area. The top bar is (82px). The editor and proof canvas scroll independently within the viewport. The proof sheet has a maximum width of (790px).

At widths up to (1180px), the rail becomes (190px), the editor uses `minmax(310px, 43%)`, and region padding contracts. At (1600px) and above, the editor is (470px), editor horizontal padding becomes (32px), and the proof canvas gains space.

At widths up to (800px), versions form a horizontal strip, actions stack below the title, and the editor/preview switch shows one region at a time. The document returns to page scrolling. Mobile actions have a minimum height of (40px), with view selectors at (45px). Do not infer a universal spacing grid: the implementation uses the compact steps in the frontmatter plus region-specific padding.

## Elevation & Depth

White and cool tonal regions carry most hierarchy. Thin rules divide editing regions. Soft shadows lift the actual proof sheet, the active segmented choice and a temporary rendering notice; they are not a general card treatment. Exact shadow values live in the sidecar.

**The Sheet Has Depth Rule.** Reserve ambient shadows for the proof sheet, active segmented choice and transient rendering notice; keep structural regions flat.

## Shapes

Controls have gently rounded corners from the control token; selected segmented options use the smaller inset radius. Major regions and the PDF sheet are square. Borders are generally (1px). Icons use inline outline SVG with rounded line caps and joins, not text glyph substitutes.

## Components

### Buttons

Compact and direct. Primary generation uses the accent fill; secondary save uses white with a rule; quiet reload removes the visible border. Standard controls have a minimum height of (36px). Hover changes fill, primary hover darkens, and disabled controls reduce opacity to (0.48). Keyboard focus uses a (3px) outline offset by (3px). Background and color transitions last (0.16s), ease-out.

### Inputs / Fields

White, full-width controls use the body role, a quiet blue-gray border and the control radius. Labels sit (8px) above. Focus strengthens the border and subtly brightens the surface; changed fields use a blue-tinted border and surface. Textareas resize vertically. YAML source uses its own cool surface and monospace role.

### Navigation

Version rows pair title and supporting text on the marine rail. Current rows use a lighter marine fill; hover remains in the marine family. Section choices are compact wrapped buttons with selected blue wash. Current state is reflected in `aria-current`. Mobile replaces the vertical rail with horizontally scrolling version choices.

### Segmented Controls

Form/source choices sit inside a pale framed track; the active white inset has a small shadow. View switches on mobile use an accent underline. Both use `aria-pressed` to identify the active choice.

### Proof Sheet and Rendering Notice

The proof sheet preserves the generated page aspect ratio on the cool canvas. A compact toolbar presents page controls and download; supporting captions use tabular numerals. The rendering notice is a temporary white rounded surface with a progress line. Progress moves over (1.4s), ease-in-out; reduced motion removes animation and transitions and displays a full static line.

## Do's and Don'ts

### Do:
- **Do** use blue for actions, selection and focus, with text or semantic state attributes to explain state.
- **Do** preserve distinct editing and document surfaces across responsive layouts.
- **Do** show unsaved and preview freshness states independently.
- **Do** use the system sans for compact bilingual interface text and monospace for source.

### Don't:
- **Don't** apply this local workbench system to the public portfolio or PDF page typography.
- **Don't** use color alone to communicate save or generation state.
- **Don't** turn the proof canvas into a collection of decorative cards.
