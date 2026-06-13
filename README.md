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
- `@nuxt/devtools` - Development tools

## 🏗️ Build & Deploy

```bash
# Build for production
pnpm build

# Preview the build
pnpm preview
```

## 📝 License

© 2025 Shaft Lok Inc. All rights reserved.

## 📋 Migration Documentation

For detailed information about the migration process, architectural decisions, and implementation patterns, see:
- **[Shaft Lok MK4 Initial Enhancements.md](./docs/initial-enhancements.md)** - Comprehensive migration guide and Nuxt design patterns

## 🚀 Future Enhancements

- **Database Integration** - Supabase integration for dynamic yacht list, FAQ, and testimonials
- **Content Management** - Admin forms for easy content updates
- **Performance** - Progressive Web App (PWA) features and image optimization
- **User Experience** - Search functionality and product comparison tools

## 🔗 Related

- **Original Site**: ShaftLok MK3 (HTML/CSS) - Static website predecessor
- **Company**: [ShaftLok Inc.](https://shaftlok.com) - Marine propeller control systems
- **Patents**: [#4389199](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199) and [#D271583](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583)

## 🏗️ Architecture

- **Layout Strategy**: Landing page uses custom layout (`layout: false`), product pages use default layout
- **Component System**: Reusable Vue components (BreadcrumbNav, AppHeader, AppFooter)
- **Responsive Design**: Mobile-first approach with breakpoint-specific navigation
- **Performance**: Lazy-loaded images, hardware-accelerated CSS animations
- **SEO Optimization**: Dynamic meta management with `useHead()` composable
