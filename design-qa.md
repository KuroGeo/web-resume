# Reference alignment QA — 2026-09-22

Reference: https://xyhan.com/index.html
Implementation: http://localhost:4173/index.html#home

## Scope and evidence

Recreate the reference homepage structure and interactions with George's actual content, not the reference author's identity or résumé. Evidence consists of the inline browser screenshots in this task; the browser capture interface did not persist filesystem screenshot paths. No screenshot filenames or automated pixel-diff scores are asserted.

- Desktop: 1280 × 900, settled hero, work chapters, fullscreen navigation, topic/journey archive, project entrance/detail, résumé printer, AI panel and footer.
- Mobile: 390 × 844, all three source chapters and footer captured by incremental scrolling. Source and implementation hero screenshots were emitted together at this exact size for comparison.
- Focused hero comparison: source and implementation mobile badge frame starts at x=22/y≈140, width=345; desktop badge width=375. Slot, inset sheet, portrait rectangle, type hierarchy, dividers, barcode and scroll pill align.
- Pointer: computed card transform changes to matrix3d and glare to 0.151 after pointer movement. Reduced-motion mode removes the scene canvas and retains semantic content.
- English and Chinese UI were both exercised. No horizontal overflow or broken loaded images in checked 390 and 1280 views.

## Iterations

1. Replaced the earlier generic alternating project layout with the source's actual spatial chapter composition, navigation, archive, printer, agent and footer.
2. Restored source spring tilt/glare/scale rather than a permanent rotated card.
3. Fixed Chinese school-name wrapping, portrait project-image distortion/cropping, oversized archive thumbnails and excessive archive description density.
4. Guarded the translation observer against document teardown; removed the empty reduced-motion archive heading.
5. Removed the nonexistent PDF target. Printer now opens the actual printable résumé in the same tab after its tear animation; browser printing provides PDF saving. Verified arrival at /resume.html.

## Fidelity surfaces

| Surface | Result |
| --- | --- |
| Fonts | Local Inter 400/500/600 and Newsreader 400/500/italic; reference type rules retained. Chinese uses system CJK fallback. |
| Spacing/layout | Reference badge dimensions, chapter composition parameters, directory/modal geometry and footer columns retained. |
| Colors | Reference paper #fafaf8, ink, translucent holder, borders and shadows retained. |
| Images/icons | Actual George photo and project captures retained; TikTok/provider marks and dog artwork from reference. Portrait-format project images contained, not stretched. |
| Copy | George's existing bilingual facts only; no reference author credentials, contact details or project claims. |
| Behavior | Scroll chapters, menu, topic/journey switching, project flip/return, AI panel/copy, printer, language switch and reduced motion checked. |

## Deliberate differences and remaining polish

- Eight work examples versus the source's eighteen archive entries / eleven featured cards; the AI gift assistant and voice interaction are two facets of one POC. The first chapter has fewer cards. This is a content adaptation, not a claim of identical visual density.
- One real portrait, not the source's nine directional photos.
- Actual résumé document plus browser PDF saving, not a fabricated prebuilt PDF.
- Added bilingual switch; public GitHub replaces the source author's email and UTC+8 replaces their location.
- P3: some ancillary accessibility/status strings remain English in Chinese mode. Chinese font metrics naturally differ.

## Verification

- node tests/validate-site.mjs: passed (both languages, eight project records, scene-slot bounds, all static local asset/link targets, no source personal content, JavaScript syntax).
- git diff --check: passed.
- Fresh desktop console check: no errors.
- AI copy interaction returned its copied status. External AI conversations were not submitted.
- Project detail and return restoration verified. Printer preview and navigation to real print view verified; no PDF file-save claim.

final result: passed

This is the adapted-content visual/functional review result, not a binary pixel-equality claim or a publication/license clearance. No deployment or Git commit performed.
