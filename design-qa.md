# Atlas Services Redesign — Design QA

## Comparison target

- Source visual truth: /workspace/scratch/d314c8835c23/generated_images/exec-3617815c-7750-4555-92d2-a3240dbe0fca.png
- User-selected detail reference: /workspace/scratch/d314c8835c23/upload/IMG_3263.png
- Implementation: http://terminal.local:4173/services
- Browser-rendered implementation screenshot evidence:
  - localDesktopShot2 — desktop hero, 1363 × 936 browser viewport
  - fullServicesShot1 — full-page desktop capture
  - mobileServicesShot1, mobileServicesShot2, mobileServicesShot3 — 390 × 844 same-origin iframe viewport
  - compareShot3 — side-by-side source/implementation comparison captured in the cloud browser
- State: dark theme, motion enabled, workflow paused at the Human approval state for direct comparison

## Viewport and normalization

- Source image pixels: 945 × 1679. The generated mock represents a 1440px desktop marketing-page target.
- Implementation CSS comparison viewport: 1440 × 1900 inside a same-origin browser iframe.
- Comparison display: both source and implementation were normalized to approximately 651px displayed width in compareShot3; the implementation iframe used a 0.451 scale.
- Direct desktop browser viewport: 1363 × 936.
- Mobile browser viewport: 390 × 844 inside the cloud browser.
- Browser density: default cloud-browser device scale.

## Full-view comparison evidence

compareShot3 places the selected mock and browser-rendered implementation in one visual input. The comparison shows the same major composition: Atlas navigation; two-column editorial hero; detailed property-service approval console; three-part control strip; dark service-system section; large gold-framed “Built around your workflow” panel; six-item indexed service rail; and a contrasting warm-ivory implementation section.

fullServicesShot1 verifies the rest of the page as one continuous render: control/guardrails, products, capability strip, engagement choices, FAQ, final contact CTA, and footer. No section remained hidden by scroll-reveal behavior.

## Focused region comparison evidence

- Hero: compared directly in compareShot3. Headline wrapping, column balance, approval-console density, gold/blue state use, navigation CTA, and control strip were checked at the same normalized width.
- Signature service panel: compared directly in compareShot3 and against /workspace/scratch/d314c8835c23/upload/IMG_3263.png. The final implementation preserves the requested left-side workflow illustration, right-side editorial copy, three check rows, gold outline, index marker, and separate three-dot control.
- Mobile: mobileServicesShot1 checks hero typography/CTAs; mobileServicesShot2 checks the vertical workflow state and approval summary; mobileServicesShot3 checks the stacked animated illustration and feature copy.

## Required fidelity surfaces

### Fonts and typography

- Display type uses the existing Cormorant Garamond family and matches the selected mock’s editorial tone.
- Interface and body copy use the existing DM Sans family; status labels use a system monospace stack.
- Final desktop headline is two lines at the normalized 1440px comparison width, matching the selected target.
- Mobile headline, body text, and interface labels remain readable without truncation.

### Spacing and layout rhythm

- Desktop hero uses the target asymmetrical text/console split and a 1320px content container.
- Section rhythm alternates dense operational surfaces with generous editorial space.
- The signature service module and indexed rail maintain the selected proportions without overlapping the dot controls.
- Tablet and mobile layouts stack intentionally; 390px captures show no horizontal overflow.

### Colors and visual tokens

- Warm near-black, antique gold, ivory display text, warm light section, and quiet borders match the selected direction.
- Electric blue is restricted to live/system state.
- Contrast is improved over the source where body copy was especially dim; the change is intentional for accessibility.

### Image quality and asset fidelity

- /public/services/hud-field.webp is a generated 1600 × 900 atmospheric HUD field used at natural cover scale.
- /public/services/workflow-hud.webp is a generated 600 × 440 workflow illustration placed in the exact requested feature slot.
- Both raster assets were inspected at original resolution. They match the reference palette and avoid placeholder art, stretched sprite sheets, or code-drawn substitutes.
- Interface icons use Phosphor Icons consistently; no emoji, handcrafted SVG, or text-glyph icon stand-ins were added.

### Copy and content

- The hero and control language follows the selected mock.
- The property example remains explicitly labeled “Example workflow” and “Example only.”
- No invented client metrics, testimonials, prices, ROI, geographic client claims, or performance figures were added.
- Six real services, full service-detail payloads, products, capabilities, engagement choices, six FAQs, and /contact conversion links remain available.
- Hard timing, SLA, commercial, and ownership absolutes from the older page were softened into scope-dependent language.

## Primary interactions tested

- Motion toggle changes between Motion on and Motion off.
- Workflow stages auto-progress when motion is enabled and can be selected manually.
- Feature deck auto-advances and exposes three manual dot controls.
- A service row opens the correct portal drawer.
- Escape closes the drawer; the dialog leaves the DOM after its exit transition.
- Drawer content includes the full service overview, fit, problems, build items, deliverables, and /contact CTA.
- FAQ disclosure opens and exposes its answer.
- “Plan my automation” and “Start the conversation” resolve to /contact.
- Responsive hero, workflow console, and feature module were rendered at 390 × 844.
- Browser logs were checked. No implementation errors were present; the only logged errors came from the cloud-browser metadata extension URL and are unrelated to the page.

## Comparison history

### Pass 1

- [P2] Navigation CTA differed from the selected target (Try Atlas instead of Plan my automation).
- [P2] Desktop hero headline wrapped to three lines rather than the target’s two-line composition.
- [P2] The featured workflow image was smaller and dimmer than the user-selected crop.

Fixes:

- Added optional CTA label/href props to the shared navigation and set the Services page CTA to /contact.
- Reduced the desktop display-size ceiling and adjusted the responsive scale so the headline matches the target wrapping.
- Increased the workflow asset’s scale and opacity while preserving its mobile fit.

Post-fix evidence:

- compareShot3 shows the corrected navigation CTA, two-line headline, and larger feature illustration side by side with the selected visual.

### Pass 2

- No actionable P0, P1, or P2 visual differences remain.
- The real six-service navigator intentionally replaces the mock’s principle-only rail so all preserved service drawers remain discoverable.
- Increased body-copy contrast is an intentional accessibility improvement.

## Follow-up polish

- [P3] A future iteration could tune animation timing after observing the page on a wider range of physical devices.
- [P3] The lower product and engagement sections could receive additional micro-interactions if user testing shows they improve comprehension.

## Final result

final result: passed
