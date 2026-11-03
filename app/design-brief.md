# Adversix Tech | refined website direction

- **Design read:** A confident creative technology studio for ambitious founders and teams who need strategy, design and engineering brought into one useful digital product.
- **Concept spine:** The Adversix Tech identity. The supplied official emblem and wordmark are revealed with a restrained, continuous motion on a warm ivory canvas; the page then opens into a tactile editorial system.
- **Delivery tier:** Cinema. The scroll-controlled film remains the signature interaction and the first viewport is composed as one full-bleed visual plane.
- **Locked palette:** warm ivory `#F5F0E8`, soft white `#FFFDF8`, deep walnut `#2C211D`, cocoa `#795B4A`, muted taupe `#8F8178`. The user's brown and white direction remains the source of truth, balanced by warm light surfaces and a dark cinematic stage.
- **Locked type:** Space Grotesk for expressive display and Manrope for clear body copy, with DM Mono for restrained technical annotations.
Animation mode: animated-website
- **Journey shape:** single-shot. One continuous, restrained reveal of the approved Adversix Tech logo lockup gives the opening a clear brand identity without artificial scene changes.
- **Journey:** (1) The official Adversix Tech emblem and wordmark enter on warm ivory. (2) A clean left-to-right reveal completes the approved lockup. (3) The mark settles into its final scale while the supporting line introduces the studio. (4) The film holds the complete identity as the visitor reaches the work.
- **World grammar:** The actual Adversix Tech logo artwork, with its approved emblem, typography and terracotta accent, on a warm ivory field. No substitute 3D object, no invented lettering, no extraneous props. The animation uses a restrained scale and reveal, with stable exposure and a clean center-safe composition.
- **Mobile framing:** Keep the official lockup centered in the upper portion, use the mobile encode and its exact-frame poster, move copy to the lower safe area and preserve clear separation between the logo and supporting text.
- **Delivery budget:** Existing desktop and mobile encodes remain below the 32 MiB and 16 MiB limits respectively.
- **Section plan:** 1. Full-bleed scroll-scrub brand hero. 2. Capabilities as an editorial list with rules and generous space. 3. Selected work as a gallery-led image canvas with simple filters. 4. Approach as a dark process rail with selectable stages. 5. Studio as an interactive browser mockup of the four independent website concepts, with a selector and concise supporting copy. 6. Contact as a dark closing statement with an accessible inquiry form.
- **Composition rules:** The hero contains only the brand name, one supporting sentence and one CTA group over the full-bleed film. No floating labels, badges, metrics, cards or secondary promos. Later sections each carry one purpose and one headline.
- **Interaction contract:** Scroll controls the generated film. Navigation links move to named sections. Capability rows reveal detail on hover and keyboard focus. Work categories filter the gallery. Process waypoints are selectable. Contact form validates and stores inquiries in D1 with clear success and error states.
- **Motion:** Scroll-scrub film, restrained image scale on hover, capability-row directional response and a short process-state transition. Every effect respects reduced-motion preferences.
- **Accessibility:** Semantic landmarks, visible focus rings, labeled fields, keyboard-operable filters and process steps, sufficient contrast, reduced-motion fallback, responsive layouts and no content hidden behind viewport observers.
- **Responsive rules:** Desktop uses a wide cinematic hero and asymmetric editorial sections. Tablet collapses multi-column content to two columns. Mobile uses a single column, compact navigation, center-safe film crop, horizontal filter strip and full-width form controls.
- **Content voice:** Direct, capable, specific and calm. Avoid exaggerated performance claims, invented client names, testimonials and metrics.

## Portfolio expansion — November 2026

The portfolio now includes four independent demonstration concepts, each clearly labelled as a concept project rather than a commissioned client case study:

- **House of Mane** — hair salon, braiding and barbering; warm cocoa, sand and bronze editorial direction.
- **PureSpace** — residential and commercial cleaning; fresh sage, airy layouts and quote-estimator direction.
- **Atelier N°8** — luxury nail studio; muted blush, oxblood and fashion-editorial direction.
- **Forme Beauty House** — multi-service beauty and grooming studio; warm stone, olive and contemporary studio direction.

Each project has a dedicated project-story route (`/work/:slug`) and an interactive website concept route (`/concepts/:slug`). The concept sites include service selection, pricing/estimate details, team presentation, a visual work section, responsive booking or quote-request demonstrations and location/contact placeholders. Demo forms are explicitly labelled as demonstrations and do not claim to create real appointments or quotes. No fabricated testimonials or business-performance claims are used.

The portfolio is backed by D1 (`portfolio_projects`) and uploaded images use R2. The owner-only admin route is `/admin`; authorization checks the signed-in Higgsfield account server-side. Admin features include project creation/editing, category, descriptions, services, features, technologies, cover and gallery images, desktop/mobile screenshots, configured live preview URL, featured ordering, draft/published/archived status and confirmed deletion. The branding tab manages logo variations, emblem, favicon and social-sharing image independently; replacements require an explicit confirmation.

The original Adversix Tech logo supplied by the owner remains the parent brand mark. Light and dark lockups and the emblem are used across the site; the logo receives a restrained animated reveal in the homepage film and respects reduced-motion preferences. The four concept brands use separate visual systems and do not inherit the parent palette.

## Visual correction pass — November 2026

The portfolio concepts must not share one template with a different palette. Their page architectures and typography are now intentionally distinct:

- **House of Mane:** warm salon editorial, Georgia display serif, cocoa/terracotta palette, cinematic human-led hero, editorial service index, image-led story and appointment panel.
- **PureSpace:** bright service-business layout, geometric sans typography, sage/ivory palette, split photography hero, proof strip, service grid and interactive estimate calculator.
- **Atelier N°8:** fashion-editorial nail atelier, high-contrast italic serif typography, oxblood/blush palette, asymmetric image composition, treatment index and minimal appointment form.
- **Forme House:** immersive olive studio identity, Manrope and serif contrast, full-bleed team campaign hero, centered brand introduction, modular service index and booking panel.

All four concepts now use commissioned-for-this-project, human-centred campaign imagery generated for their respective business categories. The imagery is served locally in optimized WebP format. The projects remain clearly labelled as independent demonstration concepts; their forms do not claim to create real appointments or quotes.

The homepage studio section now contains a live, interactive browser mockup of the four concept sites, with a selector to switch the embedded preview. It replaces the former abstract still-life image. The hero film and first-frame posters have been replaced with a subtle reveal animation of the owner's approved Adversix Tech logo lockup. The navigation now uses dark ink over the warm-cream opening scene rather than a high-contrast floating overlay.

The favicon family (SVG, ICO, 16/32/192/512 PNG, maskable and Apple touch icon) now uses the actual supplied Adversix emblem. The `/api/favicon` fallback and brand-assets database record resolve to the official emblem, not a generic geometric mark.

## Navigation and appearance controls — November 2026

The main studio site now has a persistent, high-contrast navigation bar with direct Home, Services, Work, Approach, Studio and Start a project links. The previous text-only wordmark treatment has been removed from the header and footer; both use the supplied Adversix emblem instead. A visible theme switch toggles between the original warm-cream/terracotta light palette and a coordinated dark walnut palette. The selection is saved locally in the visitor's browser and the control remains available in the responsive mobile navigation.
