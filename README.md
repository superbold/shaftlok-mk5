# ShaftLok MK5 - Nuxt 4 Website

Full visual redesign of the ShaftLok marine propeller control systems website (based on MK4), built on Nuxt 4 with Vue 3 Composition API and Supabase.

**MK5 design system — "Deep Ocean Engineering":** dark-first marine industrial theme (deep navy + aurora cyan), glassmorphism navigation and cards, bento feature grids, Space Grotesk / Inter typography, scroll-reveal micro-interactions (`v-reveal` directive), and a shared `ProductDetail` component that generates per-product SEO (meta, OpenGraph, JSON-LD Product schema) from props.

## 🚀 Features

- **Nuxt 4.0.3** - Latest Nuxt framework with file-based routing
- **Vue 3 Composition API** - Modern reactive component architecture
- **TypeScript** - Type safety and developer experience
- **Complete Content Migration** - All MK3 content faithfully preserved and enhanced
- **10 Product Pages** - Full product catalog with detailed specifications
- **SEO Optimized** - Meta tags, structured data, sitemaps, breadcrumbs
- **Responsive Design** - Mobile-first approach with hamburger navigation
- **Performance Optimized** - Lazy loading, efficient CSS, hardware-accelerated animations
- **Component Architecture** - Reusable Vue components for maintainability

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate
```

### URLs

- **Development**: http://localhost:3000
- **Production**: https://shaftlok.com

## 📁 Project Structure

```
├── assets/          # CSS, fonts, and build assets
├── components/      # Vue components
├── layouts/         # Layout templates
├── pages/           # File-based routing
├── public/          # Static assets
├── nuxt.config.ts   # Nuxt configuration
└── package.json     # Dependencies and scripts
```

## 🎯 Pages

### Core Pages
- **Home** (`/`) - Hero section with split-screen design and company overview
- **About** (`/about`) - Company history, patents, and technical expertise
- **Contact** (`/contact`) - Contact information with Google Maps integration
- **Get a Quote** (`/quote`) - Vessel questionnaire form; submits to sean.nigel@shaftlok.com via Resend
- **Privacy Policy** (`/privacy`) - Data collection disclosure; required for GDPR compliance
- **Installation** (`/installation`) - Complete installation guide and procedures
- **FAQ** (`/faq`) - Frequently asked questions with expandable sections
- **Testimonials** (`/testimonials`) - Customer testimonials and success stories
- **Yacht List** (`/yacht-list`) - Comprehensive list of yachts using ShaftLok systems

### Product Catalog
- **Products Overview** (`/products`) - Complete product catalog with 10 systems
- **Mod I EasyLok** (`/products/mod-i-easylok`) - Entry-level propeller control
- **Mod II EasyLok** (`/products/mod-ii-easylok`) - Mid-range marine systems
- **Mod II EasyLok High Torque** (`/products/mod-ii-easylok-high-torque`) - Enhanced torque capability
- **Mod III EasyLok** (`/products/mod-iii-easylok`) - Large vessel applications
- **Mod III EasyLok High Torque** (`/products/mod-iii-easylok-high-torque`) - Maximum torque handling
- **Mod IV** (`/products/mod-iv`) - Specialty and custom applications
- **Mod V** (`/products/mod-v`) - Largest yachts and extreme requirements
- **Mod VI** (`/products/mod-vi`) - Next-generation advanced systems
- **Marine Control Cable** (`/products/marine-control-cable`) - Standard control cables
- **Simple Spring Locking System** (`/products/simple-spring-locking-system`) - Manual locking system

## 🔧 SEO Features

- **Meta Management** - Dynamic meta descriptions and titles per page
- **Social Media** - Open Graph tags and Twitter Card support
- **Structured Data** - JSON-LD breadcrumb navigation for search engines
- **Sitemaps** - XML sitemap for search engine indexing
- **Search Control** - Robots.txt for search engine directives
- **Canonical URLs** - Proper URL canonicalization
- **Breadcrumb Navigation** - SEO-friendly breadcrumb component system

## 📦 Key Dependencies

- `nuxt` - Framework
- `vue` - Frontend framework
- `@nuxtjs/supabase` - Auth and database (yacht list, products, admin CRUD)
- `resend` - Transactional email for the quote form
- `@nuxt/devtools` - Development tools

## 🏗️ Build & Deploy

```bash
# Build for production
pnpm build

# Preview the build
pnpm preview
```

## 🎨 MK5 Redesign — What Was Built

The MK5 redesign carries the "Deep Ocean Engineering" theme across the entire site while preserving all MK4 content, SEO metadata, and Supabase integrations.

### Design system
- New design tokens in `assets/css/main.css`: deep navy background (`--abyss`), aurora cyan/teal accents, glassmorphism cards (`.glass-card`), gradient text/buttons, bento grids, and a `.check-list` / `.prose` content system
- Space Grotesk (display) + Inter (body) loaded via Google Fonts, with the legacy `DeVinneOrnamentDRegular` brand font retained for the "Shaft Lok" wordmark
- Legacy CSS variables (`--federal-blue`, `--honolulu-blue`, etc.) mapped onto the new palette for backward compatibility
- SSR-safe `v-reveal` scroll-reveal directive (`plugins/reveal.ts`), built on `IntersectionObserver` and respecting `prefers-reduced-motion`

### Home page
- Redesigned hero ("Lock the shaft. Free the sail.") with stats row and floating brochure chips
- Transmission brand marquee, bento "why lock the shaft" grid, 1978–1981 history timeline, engineering section with check-list, and a final CTA band
- All original JSON-LD (BreadcrumbList, WebPage, Organization with `hasOfferCatalog`) preserved

### Products
- New shared `ProductDetail.vue` component generates SEO meta (OpenGraph, Twitter cards, canonical links, JSON-LD BreadcrumbList + Product schema with `additionalProperty` specs) from props
- All 10 product pages rewritten as thin wrappers around `ProductDetail`, preserving original prose and specs
- Redesigned product catalog (`/products`) with "Locking Units" and "Controls & Accessories" sections
- Catalog is now backed by the Supabase `products` table (live data, SSR-fetched via `useAsyncData`), with admin CRUD modals (add/edit/delete) matching the Yacht List pattern

### Content pages
- About, Installation, Contact, FAQ, and Testimonials pages restyled with glass cards, step-cards, accordions, and review cards
- All original Article/WebPage/HowTo/LocalBusiness/FAQPage/Review JSON-LD schema preserved exactly

### Yacht list
- Dark glass table theme with sticky headers, mobile card-stacking, and a pulsing gradient discount button
- Live Supabase data (956 yachts) confirmed working with search, sort, pagination, and admin CRUD modals restyled to match

### Verification
- All 19 routes return HTTP 200; JSON-LD renders correctly in SSR output (including `additionalProperty` and product-specific details)
- `pnpm build` completes successfully (`.output/` ≈ 2.97 MB, ~703 kB gzip)
- Visually verified via headless-Chrome screenshots of home, products catalog, product detail, yacht list, and FAQ pages

## 📬 Quote Form & Email

The "Get a Quote" nav button (previously pointing to `/contact`) now routes to `/quote`, a vessel questionnaire that collects ten fields covering the boat's propeller, engine, and hull specs. On submission, a Nitro server route (`server/api/quote.post.ts`) sends a formatted HTML email to `sean.nigel@shaftlok.com` via **Resend**, with `Reply-To` set to the customer's email so Sean can reply directly.

**Email flow:**
1. Customer fills out `/quote` and submits
2. `POST /api/quote` fires (Nitro serverless function on Vercel)
3. Resend delivers a styled HTML email to `sean.nigel@shaftlok.com`
4. Sean replies directly to the customer

**Configuration:**
- Sending domain: `contact.shaftlok.com` (verified in Resend)
- From address: `quote@contact.shaftlok.com`
- Environment variable: `RESEND_API_KEY` — set in `.env` locally and in Vercel project environment variables
- The API key is a secret and must never be committed to the repository

## 🔒 Privacy Policy

A Privacy Policy page (`/privacy`) was added to satisfy **GDPR** obligations that arise when collecting personal data (name, email) from visitors in the European Union or UK.

**Why it was added:**
- The quote form collects personal data (name, email address), which triggers GDPR disclosure requirements for EU residents
- GA4 analytics cookies are in use site-wide, which also requires disclosure even though `anonymize_ip: true` is set
- A Privacy Policy is the minimum practical compliance step for a US business that may receive inquiries from European sailors

**What it covers:**
- Data collected via the quote form and why (to respond to the inquiry — no mailing list)
- GA4 analytics usage (aggregated, anonymized)
- Resend named as the third-party email processor
- Data retention (email inbox only, no separate database storage)
- EU/UK user rights (access, correction, deletion within 30 days)
- Cookie disclosure (`_ga`, `_ga_XDWZW2TCLR`)

**What was deliberately omitted:**
- A cookie consent banner — enforcement risk for a small US-based marine hardware business with primarily US customers is negligible. The `anonymize_ip: true` GA4 config further reduces exposure. Revisit if active EU marketing begins.

**Discoverability:** The Privacy Policy link appears in two places in `AppFooter.vue` — the Company navigation column and the bottom copyright bar — so it is reachable from every page on the site.

## 📊 Analytics

The site uses Google Analytics 4 (GA4) via the `gtag.js` snippet, configured in [nuxt.config.ts](./nuxt.config.ts) under `app.head.script`. Because this is part of the global Nuxt head config, it's automatically injected into the `<head>` of every server-rendered page — no per-page setup needed.

- **Measurement ID**: `G-XDWZW2TCLR` (Shaft Lok Inc. GA4 property)
- **Config**: `gtag('config', 'G-XDWZW2TCLR', { anonymize_ip: true })` — `anonymize_ip` truncates visitor IP addresses for privacy
- **Updating the ID**: change both occurrences of the Measurement ID in `nuxt.config.ts` (the `script src` URL and the `gtag('config', ...)` call) if the GA4 property ever changes
- A GA4 Measurement ID is not a secret — it's visible in the rendered page source — so it's safe to reference here.

The Measurement ID isn't a secret — it's embedded in the rendered HTML that gets sent to every visitor's browser. When the page loads, this literally appears in the page source:

```js
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XDWZW2TCLR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XDWZW2TCLR', { anonymize_ip: true });
</script>
```
So the flow is:

1. Visitor's browser loads your page
2. The gtag.js script is fetched from Google's servers
3. That script reads the G-XDWZW2TCLR ID from the gtag('config', ...) call
4. It sends pageview/event data back to Google's collection servers, tagged with that ID
5. Google routes the data into the matching GA4 property in your account

The ID is Google's way of knowing which GA4 account/property the data belongs to. It's intentionally public — anyone can view-source on shaftlok.com and see it, which is fine. The only thing that keeps others from accessing your GA4 reports is your Google account login.

## 📝 License

© 2026 Shaft Lok Inc. All rights reserved.

## 📋 Migration Documentation

For detailed information about the migration process, architectural decisions, and implementation patterns, see:
- **[Shaft Lok MK4 Initial Enhancements.md](./docs/initial-enhancements.md)** - Comprehensive migration guide and Nuxt design patterns

## 🚀 Future Enhancements

- ~~**Analytics** - Replace the placeholder Google Analytics ID with a production tracking ID~~ (done — `G-XDWZW2TCLR`)
- **Supabase Types** - Generate `types/database.types.ts` via the Supabase CLI (`supabase gen types typescript --project-id <id> > types/database.types.ts`) and remove `types: false` from `nuxt.config.ts` for full type-safety on `useSupabaseClient<Database>()` calls (`yachts`/`profiles`/`products` tables)
- **Performance** - Progressive Web App (PWA) features and further image optimization
- **User Experience** - Product comparison tools and richer yacht list filtering

## 🔗 Related

- **Original Site**: Shaft Lok MK3 (HTML/CSS) - Static website predecessor
- **Company**: [Shaft Lok Inc.](https://shaftlok.com) - Marine propeller control systems
- **Patents**: [#4389199](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199) and [#D271583](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583)

## 🏗️ Architecture

- **Layout Strategy**: Landing page uses custom layout (`layout: false`), product pages use default layout
- **Component System**: Reusable Vue components (BreadcrumbNav, AppHeader, AppFooter)
- **Responsive Design**: Mobile-first approach with breakpoint-specific navigation
- **Performance**: Lazy-loaded images, hardware-accelerated CSS animations
- **SEO Optimization**: Dynamic meta management with `useHead()` composable
