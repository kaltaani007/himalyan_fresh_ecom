# 🏔️ Himalayan Fresh — Full Redesign Blueprint
### Professional 3D E-Commerce Platform with End-to-End Functionality

> **Purpose**: Complete UI/UX analysis, 3D design strategy, feature roadmap, and implementation breakdown for upgrading Himalayan Fresh from its current prototype state into a world-class, production-ready, interactive 3D apple e-commerce experience.

---

## 1. Current State Audit Summary

### 1.1 What's Working Well
| ✅ Strength | Details |
|---|---|
| Design token foundation | `src/theme/index.ts` has solid color and typography tokens |
| Routing & shell architecture | Clean SPA structure with React Router v6 |
| State management | Zustand stores are properly isolated with localStorage persistence |
| Framer Motion | Scroll-triggered `whileInView` animations are already in place |
| Backend readiness | DRF endpoints cover 100% of needed e-commerce operations |
| Three.js dependencies | `three`, `@react-three/fiber`, `@react-three/drei` already installed |

### 1.2 Critical Problems Identified
| ❌ Problem | Affected Files | Impact |
|---|---|---|
| **Dual color systems** — `pine-*`, `charcoal-*`, `cream-*` vs. `primary-*`, `text-primary-*` | All `.tsx` pages | Inconsistent brand colors everywhere |
| **Flat hero with stock photo** | `HomePage.tsx L33–L108` | Zero premium feel; no differentiation |
| **Mock data, not live API** | `ProductListPage`, `DistrictPage`, `BlogListPage` | Catalogue doesn't update from Django backend |
| **No 3D components** despite `@react-three/fiber` being installed | Entire frontend | Missed premium differentiator |
| **Checkout is a single flat form** | `CheckoutPage.tsx` | No multi-step UX, no Stripe Elements |
| **No user/session tracking** | Entire frontend | No analytics, abandoned cart, or personalization |
| **No loading/skeleton states** | All pages | Jarring blank flashes |
| **Cart has no coupon implementation** | `CartPage.tsx` | UI shows input but no validation API call |
| **Login is demo-only** | `LoginPage.tsx L17–L22` | `setTimeout` mock, no real API hit |
| **No page transitions** | `App.tsx` | Hard page jumps between routes |
| **No SEO/meta tags** | `index.html` | No Open Graph, no structured data |
| **Missing hooks directory** | `src/hooks/` exists but is empty | Duplicate data-fetching logic scattered |

---

## 2. Visual Design Direction — The New Vision

### 2.1 Inspiration References & Aesthetic
The redesign targets a **"Mountain Luxury Organic"** aesthetic — think high-end wine estates + modern DTC food tech + Himalayan terroir storytelling.

**Key Reference Sites**:
- `ambertalefarms.com` — editorial orchard photography
- `cowgirlcreamery.com` — clean grid + handcrafted typography
- `bruichladdich.com` — dark luxury + product hero with 3D feel
- `notpla.com` — WebGL canvas + fluid scroll design
- `zara.com` — full-screen immersive product reveals

### 2.2 New Color System (Refined Palette)

| Token | Current | Upgraded | Rationale |
|---|---|---|---|
| `--color-primary` | `#2d5a3d` | `#1e4631` | Deeper, richer orchard green |
| `--color-primary-light` | `#3d7a52` | `#2d6b46` | Leaves in morning light |
| `--color-gold` | `#d4a84b` | `#c8962c` | Warmer harvest gold |
| `--color-cream` | `#fdfcfa` | `#f9f4ec` | Warm parchment, premium feel |
| `--color-mist` | (new) | `#e8ede9` | Mountain mist soft grey-green |
| `--color-bark` | (new) | `#4a2e1a` | Deep earth bark for richness |
| `--color-snow` | (new) | `#fafaf8` | Himalayan snow white |
| `--color-dusk` | (new) | `#0f1a12` | Deep forest for dark sections |

### 2.3 Typography System Upgrade

```
Display (Hero H1):        Playfair Display Italic Bold — 80px / 56px mobile
Section Headers (H2):     Playfair Display Bold — 52px / 36px mobile  
Card Headers (H3):        Cormorant Garamond SemiBold — 28px / 22px mobile
Body Text:                Inter Regular — 17px / 15px mobile (↑ from 16px)
Captions & Labels:        Inter Medium — 13px
Monospace / Altitude:     DM Mono — 12px (for elevation tags like "2,750m ASL")
```

**Upgrade Note**: Add `Cormorant Garamond` for a secondary editorial serif; use `DM Mono` for altitude, SKU codes, and farm coordinates.

### 2.4 New Layout Grid

```
Desktop:    1440px max container, 24-column grid, 24px gutters
Tablet:     1024px, 12-column, 16px gutters  
Mobile:     390px (iPhone 15 target), 4-column, 16px gutters
Sections:   py-24 (96px) min — was py-20 (80px)
Hero:       100vh full bleed — was 85vh
```

---

## 3. 3D Design Strategy — The Core Differentiator

### 3.1 3D Scene Architecture Overview

```
src/
└── components/
    └── three/
        ├── AppleOrchardHero.tsx       ← Hero 3D canvas (homepage main scene)
        ├── AppleModel3D.tsx           ← Reusable single apple GLTF model
        ├── FloatingApples.tsx         ← Animated orbiting apples for product cards
        ├── MountainTerrain.tsx        ← Low-poly Himalayan hills background
        ├── OrchardEnvironment.tsx     ← Lighting + fog + sky composition
        ├── AppleVarietiesShowcase.tsx ← 3D turntable for product detail page
        ├── ParticleField.tsx          ← Snow/petal particle system for hero
        └── WebGLFallback.tsx          ← Static hero fallback if WebGL unavailable
```

### 3.2 Apple 3D Model Varieties

Each apple variety gets a distinct procedurally styled 3D model using Three.js geometry + custom GLSL shaders or textured GLTF assets:

| Apple Variety | 3D Model Notes | Color Profile |
|---|---|---|
| **Royal Red Delicious** | Deep red with subtle specular highlights, slightly ribbed form | `#c0392b` to `#8e1e1e` gradient |
| **Golden Delicious** | Smooth golden-yellow, warm subsurface scattering | `#f5c842` to `#d4a017` |
| **Shimla Apple** | Pale green-yellow with red blush patches | `#9bc17a` with `#c94b4b` blush |
| **Kinnaur Black Walnut** | Dark matte brown, rough texture, slightly cracked | `#4a2e1a` textured |
| **Alpine Cherry** | Deep ruby red, small, shiny, pairs cluster | `#8b0000` high gloss |
| **Fuji Apple** | Pink-striped, modern shape, high spec | `#f47b7b` with green `#6fa46f` |

### 3.3 Hero 3D Scene (`AppleOrchardHero.tsx`)

**Scene composition using `@react-three/fiber` + `@react-three/drei`:**

```
Stage Setup:
  - Environment preset: "forest" or custom HDRI (mountain valley)
  - Directional sun light: warm golden hour (5am Himalayan morning)
  - Ambient light: soft diffused blue-green (mountain sky bounce)
  - Fog: exponential, light grey-green (#cdd8c5), density 0.02

Foreground Layer:
  - 3x Large apple models (Red Delicious, Golden, Fuji) in triangular composition
  - Apples slowly rotate on Y-axis (0.001 rad/frame)
  - On hover: apple smoothly rotates to face user, scale 1→1.08 spring
  - Floating leaf particles: 200 leaves orbiting scene

Midground Layer:
  - Abstract orchard trees (low-poly cylinder trunks + sphere canopies)
  - Trees gently sway using sin(time) wind shader

Background Layer:
  - Low-poly Himalayan mountain range silhouette
  - Procedural cloud system drifting slowly left

Camera:
  - useRef camera with mouse parallax: { x: *0.02, y: *0.01 }
  - On scroll: camera slowly pulls back (z: 5 → 8), orchard reveals more
  - Initial camera: { position: [0, 2, 6], fov: 50 }
```

### 3.4 Product Detail 3D Turntable (`AppleVarietiesShowcase.tsx`)

```
On /products/:slug page:
  - Instead of flat product image gallery → interactive 3D apple model
  - User can:
    * Drag to orbit (OrbitControls with limits: polar 20°–80°, azimuth unlimited)
    * Scroll to zoom (min 3, max 8 distance)
    * Click on red blush patch → tooltip "Kinnaur sun exposure"
    * Click on stem → tooltip "Handpicked, Oct 2024"
  - Toggle: "3D View" vs "Photos" tab switch
  - 360° auto-rotate badge in corner (pauses on hover)
```

### 3.5 Floating Apples on Product Cards (`FloatingApples.tsx`)

```
On /products listing cards:
  - Replace flat product image with mini embedded canvas (200x200)
  - Single apple model floating with gentle bob (Y: sin(time)*0.1)
  - Card hover → apple spins faster + warm glow halo
  - Performance: use InstancedMesh for all cards sharing same geometry
  - Fallback: standard <img> for mobile / reduced-motion preference
```

### 3.6 Mountain Terrain Section Background (`MountainTerrain.tsx`)

```
Used in: Districts section, About page, Newsletter section background

Setup:
  - PlaneGeometry(100, 50, 64, 32) with custom vertex shader
  - Vertex displacement using Perlin noise (mountain silhouette profile)
  - Two-tone material: snow peaks (#f0ece6) + forest green slopes (#2d5a3d)
  - Point lights behind mountains create glowing-ridgeline effect
  - Render as CSS backdrop behind HTML content (position: absolute, z-index: 0)
```

---

## 4. Page-by-Page Redesign Specifications

### 4.1 Homepage — Full Redesign Blueprint

```
SECTION 1: HERO (100vh, full-bleed)
─────────────────────────────────────
Layout:        Dark (--color-dusk #0f1a12) with 3D canvas filling right 60%
Left panel:    
  - Eyebrow label: "Est. 2020 · Himachal Pradesh, India" (DM Mono, spaced)
  - H1 Italic Display: "From the World's\nHighest Orchards"  
  - Body: 1-line USP in warm cream
  - Two CTAs: Primary "Shop the Harvest" + Ghost "Explore Districts"
  - Trust bar: 3 inline stats (50K+ customers | 4.9★ | Free ship >₹999)
Right panel:   
  - <AppleOrchardHero /> 3D canvas (floating apple varieties)
  - Rotating variety label carousel beneath: "Royal Red · Golden · Fuji · Shimla"
Scroll indicator:  Animated downward chevron with "scroll to discover" text
Transition:    WebGL dissolves into white as user scrolls to next section

SECTION 2: MARQUEE TRUST BAR
─────────────────────────────────────
  Infinite horizontal scroll: 
  "✦ Farm to Doorstep 2-3 Days" / "✦ FSSAI Certified" / "✦ 100% Wax Free" / 
  "✦ Direct from 847 Farmers" / "✦ Cold Chain Delivery"
  Style: Dark green background, cream text, gold "✦" separators

SECTION 3: FEATURED VARIETIES (Horizontal Scroll / Apple Showcase)
─────────────────────────────────────
  Title: "This Season's Harvest"
  Layout: Horizontal scroll rail, 5 large cards (480px wide)
  Each card:
    - 3D apple model canvas (top half, dark bg)
    - Variety name + district badge + altitude tag
    - Price + "Add to Cart" appearing on hover
    - Hover: card lifts (translateY -16px), 3D apple spins faster

SECTION 4: THE ORCHARD STORY (Split screen, editorial)
─────────────────────────────────────  
  Left: Full-height photography of Kinnaur valley farmer (natural, raw)
  Right: Typography-first content
    - "847 Farmers. 12 Districts. One Promise."
    - Paragraph copy (storytelling brand voice)
    - Three metric counters animated on scroll:
      * 2,750m Average Altitude
      * 60 Days Harvest Window  
      * 0 Chemical Pesticides

SECTION 5: CATEGORIES GRID (Bento Grid layout)
─────────────────────────────────────
  6 categories in asymmetric bento layout:
    - Large 2×2 card: Apples (hero category)
    - Medium 2×1: Organic Fruits
    - Medium 1×1: Dry Fruits
    - Small 1×1: Honey
    - Medium 1×2: Vegetables
    - Small 1×1: Herbal
  Each card: full-bleed image + gradient overlay + category name + product count

SECTION 6: DISTRICTS (Dark full-width map section)
─────────────────────────────────────
  Background: Stylized SVG map of Himachal Pradesh (custom illustrated)
  Interactive: Hover over district name → map region highlights
  12 district cards sliding in from left as section enters viewport
  Each: District name + altitude + 2-3 specialty tags + "Explore →"

SECTION 7: HOW IT WORKS (Timeline / Process)
─────────────────────────────────────
  3-step horizontal timeline with icons:
    1. "Farmers Harvest" → 2. "Cold Chain Transport" → 3. "Fresh to You"
  Light cream background section

SECTION 8: REVIEWS (Staggered masonry grid)
─────────────────────────────────────
  Masonry 3-column, 6 reviews total (not just 3)
  Each review card: verified badge + photo + stars + quote + product tag
  "12,847 Five-Star Reviews" counter hero stat above grid

SECTION 9: BLOG / EDITORIAL PREVIEW
─────────────────────────────────────
  3-card grid with featured large card (2×1) + 2 standard cards
  Category tags on each
  "Stories from the Orchard" masthead

SECTION 10: NEWSLETTER (Full-width dark green)
─────────────────────────────────────
  Background: Animated 3D mountain terrain (MountainTerrain.tsx)
  "Get the Harvest Report" — seasonal newsletter pitch
  Simple email input, golden submit button
  Social proof: "Join 12,000+ subscribers"
```

### 4.2 Product Catalog — Redesign

```
Layout upgrade: 
  - Persistent left sidebar with facets (not collapsible on desktop)
  - Facets: Category, Price range (Rs slider), District Origin, Altitude Band, 
            Certifications (Organic/Natural), Season (Autumn/Spring/Year-round)
  - Right main: 3-column grid default (not 4-column)
  
Product Card redesign:
  - Square card (1:1 ratio, no stretching)
  - Top half: 3D apple canvas OR high-quality photo (toggle on listing)
  - Bottom half: white panel with all meta
    * Origin district tag (green pill)
    * Altitude tag (DM Mono, e.g. "2,750m ASL")
    * Star rating + count (inline)
    * Name (Playfair, 2 lines max)
    * Price (large) with original crossed out
    * Two action buttons: [♡ Wishlist] [+ Add to Cart]
  
Interaction:
  - Hover: card raises 12px, 3D apple model animates, quick-view panel slides up
  - Quick-View panel: shows all variants + add-to-cart without navigating
  - "Compare" checkbox (up to 3 products side-by-side comparison view)

Sort bar upgrade:
  - "12 results" counter, View toggle, Sort by dropdown
  - Active filter chips with × dismissals (e.g. "× Kinnaur" "× < ₹1000")
```

### 4.3 Product Detail Page — Redesign

```
Layout: 2-column sticky scroll
  Left column (sticky):
    - 3D Turntable: <AppleVarietiesShowcase /> (500×500 canvas)
    - Toggle: [3D View ↔ Photos]
    - Thumbnail strip of real photos below canvas
    
  Right column (scrolls independently):
    - Breadcrumb trail
    - Origin story badge: "Kinnaur Valley · 2,750m · Autumn Harvest"
    - H1 Variety Name (Playfair Display)
    - Ratings + Review count
    - Price (prominent, 32px) + original price + % savings badge
    - Variant selector: weight options as button pills (500g / 1kg / 2kg / 5kg)
    - Quantity stepper (- 1 +)
    - [Add to Cart] primary button (full width, animated checkmark on success)
    - [Add to Wishlist] secondary ghost button
    - In-stock badge with live count ("Only 23 left")
    - Delivery estimate: "Shipped in 2-3 days · Free above ₹999"

Below fold (tabbed):
  TAB 1 - Description:   Full product story, farming method, harvest season
  TAB 2 - Nutrition:     Illustrated nutrition panel (Apple emoji icons + values)
  TAB 3 - Farm Profile:  Farmer name, photo, altitude, coordinates, farming method
  TAB 4 - Reviews:       Paginated with filter by star rating, verified badge

Related Products: Horizontal scroll rail (4 cards, same apple variety category)
```

### 4.4 Checkout — Multi-Step Redesign

```
Step 1: Delivery
  - Saved addresses grid (if logged in) with "Edit" and "Use This" action
  - "+ Add New Address" expansion form
  - Delivery preference: Standard (2-3 days) vs Express Cold Chain (+₹99)

Step 2: Review & Coupon
  - Line items list with thumbnails, quantities, and subtotals
  - Coupon code input with real-time validation against /api/v1/cart/apply-coupon/
  - Price breakdown: Subtotal / Coupon discount / Shipping / GST / Total
  - Live stock reservation timer: "Items reserved for 14:52"

Step 3: Payment
  - Stripe Elements integration (embedded card form, NOT redirect)
  - Razorpay button (UPI, Net Banking, Wallets)
  - COD option with surcharge note
  - Security seals: Secure checkout badge + card brand logos

Order Confirmation (full page celebration):
  - Order number large
  - Animated confetti (canvas-confetti library)
  - Estimated delivery date
  - [Track Your Order] [Continue Shopping] [Download Invoice PDF]
```

---

## 5. User Tracking & Analytics Architecture

### 5.1 Event Tracking System

```typescript
// src/lib/analytics.ts — unified event dispatcher

type TrackingEvent = 
  | { event: 'page_view'; path: string; referrer: string }
  | { event: 'product_viewed'; product_id: number; slug: string; source: string }
  | { event: 'add_to_cart'; product_id: number; quantity: number; price: number }
  | { event: 'remove_from_cart'; product_id: number }
  | { event: 'wishlist_add'; product_id: number }
  | { event: 'checkout_started'; cart_value: number; item_count: number }
  | { event: 'checkout_step'; step: 1 | 2 | 3; step_name: string }
  | { event: 'payment_method_selected'; method: 'stripe' | 'razorpay' | 'cod' }
  | { event: 'order_placed'; order_id: string; total: number; payment_method: string }
  | { event: 'search_performed'; query: string; results_count: number }
  | { event: 'filter_applied'; filter_type: string; filter_value: string }
  | { event: 'review_submitted'; product_id: number; rating: number }
  | { event: 'newsletter_subscribed'; source_section: string }
  | { event: 'ai_chat_opened' }
  | { event: 'ai_chat_message_sent'; message_type: 'user_input' | 'quick_prompt' };

export function track(event: TrackingEvent) {
  // 1. Send to Django analytics endpoint (custom backend event log)
  // 2. Send to Google Analytics 4 (GA4 Measurement Protocol)
  // 3. Store in localStorage for session replay
}
```

### 5.2 Session Tracking
- **Page Views**: React Router `useLocation()` effect fires `track({ event: 'page_view' })` on every route change.
- **Scroll Depth**: `IntersectionObserver` on each section fires 25% / 50% / 75% / 100% depth events.
- **Heatmap Data**: Track mouse X/Y coordinates sampled at 10Hz, batched and sent on page exit.
- **Session Replay**: Store user interaction sequence in `sessionStorage` for abandoned cart recovery.
- **Device Fingerprint**: Screen size, device type, WebGL support, timezone.

### 5.3 Abandoned Cart Recovery
```
Cart abandoned condition: User adds items, then:
  - Navigates away from /checkout without completing
  - Is inactive for 30+ minutes
  - Closes the browser tab (beforeunload event)

Recovery flow:
  1. Frontend: Track cart state + timestamp in localStorage
  2. On next session: Detect non-empty cart + elapsed time > 30min
  3. Show recovery toast: "Your Kinnaur apples are waiting! 🍎 Complete your order"
  4. If authenticated: Trigger backend Celery task to send abandoned cart email
     (via /api/v1/cart/ — CartAbandonment model)
```

---

## 6. Performance Architecture

### 6.1 Code Splitting & Lazy Loading

```typescript
// App.tsx — Route-level lazy loading
const HomePage = lazy(() => import('./pages/home/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/products/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
// 3D components: extra heavy, always lazy
const AppleOrchardHero = lazy(() => import('./components/three/AppleOrchardHero'));
```

### 6.2 3D Performance Optimizations
- **LOD (Level of Detail)**: High-poly apple model on hover, low-poly default.
- **InstancedMesh**: All product cards sharing same apple geometry — single draw call.
- **Frustum Culling**: Three.js built-in — invisible 3D models don't render.
- **DPR Clamping**: `dpr={[1, 2]}` in `<Canvas>` — prevents 4K pixel overdraw on Retina.
- **Suspend + Fallback**: `<Suspense fallback={<AppleImageFallback />}>` — 3D loads async.
- **Preload Strategy**: GLTF model preloaded with `useGLTF.preload('/models/apple-red.glb')` on route change.
- **WebGL Capability Detection**: Detect `WebGL2RenderingContext` availability; serve static image hero on failure.

### 6.3 Image & Asset Pipeline
- **WebP with AVIF fallback**: All Unsplash images replaced with self-hosted, compressed WebP.
- **Responsive images**: `srcset` with breakpoints `390w, 768w, 1200w, 1920w`.
- **Blur-up loading**: Tiny base64 placeholder (blurDataURL) while image loads.
- **Priority hints**: Hero product images marked `fetchPriority="high"`.
- **Vite config**: Enable `vite-imagetools` for build-time image optimization.

### 6.4 Core Web Vitals Targets
| Metric | Current (Estimated) | Target |
|---|---|---|
| LCP (Largest Contentful Paint) | ~3.5s | **< 1.8s** |
| FID / INP | ~200ms | **< 100ms** |
| CLS (Cumulative Layout Shift) | ~0.15 | **< 0.05** |
| TBT (Total Blocking Time) | ~400ms | **< 150ms** |
| Lighthouse Performance Score | ~65 | **> 90** |

---

## 7. New Features to Build (Priority Order)

### Priority 1 — Core 3D & Design (Do First)
- [ ] **3D Apple Hero Scene** (`AppleOrchardHero.tsx`) — GLTF apple models with orbit, lighting, particles
- [ ] **Design Token Normalization** — Remove all `pine-*`, `charcoal-*`, `cream-*` classes
- [ ] **Google Fonts upgrade** — Add Cormorant Garamond + DM Mono
- [ ] **New Color Palette** — Update `theme/index.ts` and `tailwind.config.js`
- [ ] **Navbar 2.0** — Glassmorphism effect, mega-menu with product previews, search with autocomplete
- [ ] **Route Transitions** — Framer Motion `AnimatePresence` on route changes
- [ ] **Skeleton Loading States** — For products grid, blog list, cart

### Priority 2 — Backend Connection & Live Data
- [ ] **React Query hooks** — `useProducts()`, `useCategories()`, `useBlogs()`, `useCart()` in `src/hooks/`
- [ ] **Live Login/Register** — Wire auth forms to `authApi.login()` and `authApi.register()`
- [ ] **Cart API sync** — `useCartStore` actions call `cartApi.add()` and `cartApi.update()`
- [ ] **Coupon validation** — Wire CartPage coupon input to `cartApi.applyCoupon()`
- [ ] **Reviews submission** — Wire product detail form to `reviewsApi.create()`
- [ ] **Newsletter** — Wire footer form to backend newsletter subscription endpoint

### Priority 3 — Checkout & Payments
- [ ] **Multi-step checkout stepper** with Framer Motion between steps
- [ ] **Stripe Elements** — Embed `PaymentElement` in Step 3
- [ ] **Razorpay integration** — `loadScript` + `Razorpay()` modal in Step 3
- [ ] **Stock reservation timer** — Countdown display during checkout
- [ ] **Order confirmation page** — Celebration animation + order details

### Priority 4 — Tracking & Analytics
- [ ] **Analytics module** (`src/lib/analytics.ts`)
- [ ] **Page view tracking** via `useLocation` effect
- [ ] **Cart event tracking** (add, remove, quantity change)
- [ ] **Checkout funnel events** (step 1, 2, 3, abandon, complete)
- [ ] **Search tracking** (query + result count)
- [ ] **Abandoned cart toast** (session-aware)

### Priority 5 — Power Features
- [ ] **Product comparison view** (up to 3 products, side-by-side table)
- [ ] **Harvest Calendar widget** (seasonal availability chart on product detail)
- [ ] **District interactive SVG map** (hover highlights region)
- [ ] **Progressive Web App (PWA)** — `vite-plugin-pwa`, offline shell, install prompt
- [ ] **Dark Mode** — System-preference responsive, Zustand-persisted toggle
- [ ] **WhatsApp Order Support** — Fixed WhatsApp chat bubble (alternative to AI chat)
- [ ] **Gift Packaging Option** — Checkout add-on with custom message
- [ ] **Subscription Boxes** — Weekly/monthly auto-reorder feature
- [ ] **Augmented Reality** — WebXR "place apple box in your room" (Phase 2)

---

## 8. File Structure for New Components

```
frontend/src/
├── components/
│   ├── three/                        ← All 3D components
│   │   ├── AppleOrchardHero.tsx      ← Main hero scene
│   │   ├── AppleModel3D.tsx          ← GLTF apple model
│   │   ├── FloatingApples.tsx        ← Product card mini-canvas
│   │   ├── MountainTerrain.tsx       ← Background terrain
│   │   ├── AppleVarietiesShowcase.tsx← Detail page turntable
│   │   ├── ParticleSystem.tsx        ← Leaves/snow particles
│   │   └── WebGLFallback.tsx         ← Static image fallback
│   │
│   ├── ui/                           ← Atomic UI components
│   │   ├── Button.tsx                ← btn-primary/secondary/ghost variants
│   │   ├── Card.tsx                  ← Product, Blog, District card variants
│   │   ├── Badge.tsx                 ← Status, category, altitude badges
│   │   ├── Skeleton.tsx              ← Loading skeletons matching card shapes
│   │   ├── Rating.tsx                ← Star rating display + input
│   │   ├── PriceDisplay.tsx          ← Price + original + discount badge
│   │   ├── StepIndicator.tsx         ← Checkout multi-step progress bar
│   │   ├── SearchBar.tsx             ← Autocomplete search input
│   │   ├── CountdownTimer.tsx        ← Stock reservation timer
│   │   ├── QuantityStepper.tsx       ← -/+ quantity control
│   │   └── Toast.tsx                 ← Notification toasts (using react-hot-toast)
│   │
│   └── layout/
│       ├── Navbar.tsx                ← (refactor with mega menu)
│       ├── Footer.tsx                ← (refactor)
│       ├── Layout.tsx                ← (refactor AI chat)
│       └── PageTransition.tsx        ← AnimatePresence route wrapper
│
├── hooks/                            ← TanStack React Query hooks
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── useBlogs.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   ├── useAuth.ts
│   ├── useSearch.ts
│   └── useAnalytics.ts
│
├── lib/
│   ├── utils.ts                      ← (existing)
│   ├── analytics.ts                  ← (new) event tracking
│   ├── webgl.ts                      ← (new) WebGL capability detection
│   └── payments.ts                   ← (new) Stripe/Razorpay loaders
│
└── public/
    └── models/
        ├── apple-red-delicious.glb   ← 3D model (optimize to < 500KB)
        ├── apple-golden.glb
        ├── apple-fuji.glb
        └── apple-shimla.glb
```

---

## 9. Implementation Sequence (Phase Plan)

### Phase 1 — Design Foundation (Week 1)
**Goal**: New design system, tokens, and typography live everywhere.
1. Update `theme/index.ts` with new color tokens
2. Update `tailwind.config.js` with new colors
3. Update `index.css` — remove `pine-*`/`charcoal-*`, add new utility classes
4. Add Cormorant Garamond + DM Mono to Google Fonts import
5. Create atomic UI components: `Button.tsx`, `Badge.tsx`, `Skeleton.tsx`
6. Apply to Navbar, Footer, HomePage (without 3D yet)

### Phase 2 — 3D Hero & Product Showcase (Week 2)
**Goal**: Stunning 3D experience live on homepage and product detail.
1. Source or create Apple GLTF models (use Sketchfab / Blender)
2. Build `AppleModel3D.tsx` with lighting and shadows
3. Build `AppleOrchardHero.tsx` full hero scene
4. Build `FloatingApples.tsx` for product cards
5. Build `AppleVarietiesShowcase.tsx` for detail page turntable
6. Add `WebGLFallback.tsx` for mobile/low-end devices
7. Integrate `MountainTerrain.tsx` into district section

### Phase 3 — Live Data Connection (Week 3)
**Goal**: All pages show real Django backend data.
1. Create all `src/hooks/` data-fetching hooks
2. Wire `HomePage` to real products, categories, blogs
3. Wire `ProductListPage` to real catalog with filters
4. Wire `ProductDetailPage` to real product + reviews
5. Wire `LoginPage` and `RegisterPage` to real auth
6. Wire `CartPage` to backend cart + coupon validation

### Phase 4 — Checkout & Payments (Week 4)
**Goal**: Complete purchase journey working end-to-end.
1. Build multi-step checkout stepper
2. Integrate Stripe Elements (`@stripe/react-stripe-js`)
3. Integrate Razorpay JS SDK
4. Wire order placement to `/api/v1/orders/checkout/`
5. Build order confirmation celebration page

### Phase 5 — Tracking & Analytics (Week 5)
**Goal**: Full user behavior visibility.
1. Build `analytics.ts` event system
2. Add Google Analytics 4 integration
3. Add page view + cart + checkout funnel tracking
4. Add session storage for abandoned cart detection
5. Build admin analytics dashboard widgets

---

## 10. Quick Implementation Wins (Do Today)

These can be done immediately without waiting for phases:

| Task | File | Effort | Impact |
|---|---|---|---|
| Fix Login to call real API | `LoginPage.tsx` | 30 min | 🔴 Critical |
| Fix Register to call real API | `RegisterPage.tsx` | 30 min | 🔴 Critical |
| Add `<Suspense>` to App.tsx | `App.tsx` | 15 min | 🟡 High |
| Add page transition wrapper | `App.tsx` | 20 min | 🟡 High |
| Replace `addToCart` alert in HomePage | `HomePage.tsx L8` | 10 min | 🟡 High |
| Add skeleton loaders to ProductList | `ProductListPage.tsx` | 45 min | 🟡 High |
| Normalize color classes in CartPage | `CartPage.tsx` | 20 min | 🟢 Medium |
| Connect newsletter to backend | `HomePage.tsx` footer form | 30 min | 🟢 Medium |

---

> **What to build first:** Start with the 3D Hero and design token normalization simultaneously — these two changes will have the highest visual impact and set the foundation for every other improvement. The goal is to have a stunning visual experience that loads fast, tells the Himalayan story authentically, and converts visitors into returning customers.
