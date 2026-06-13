# Shaft Lok MK4 - Nuxt Migration & Enhancements

## Overview

This document outlines the comprehensive migration and enhancement process from Shaft Lok MK3 (HTML/CSS) to MK4 (Nuxt 4.0) project, including architectural decisions, design patterns, and implementation details.

## Migration Summary

### Project Transformation
- **Source**: Static HTML/CSS website (MK3)
- **Target**: Nuxt 4.0 application with Vue 3 Composition API (MK4)
- **Migration Scope**: Complete content and functionality preservation
- **Enhancement Goals**: Modern architecture, improved maintainability, SEO optimization

## Nuxt Layout Design Patterns

### 1. Layout Architecture Strategy

#### Landing Page - Custom Layout Pattern
```vue
<!-- pages/index.vue -->
<script setup>
definePageMeta({
  layout: false  // No default layout wrapper
})
</script>
```

**Rationale**: Landing page requires unique hero section design without header/footer interference.

#### Product Pages - Default Layout Pattern
```vue
<!-- pages/products/[slug].vue -->
<script setup>
definePageMeta({
  layout: 'default'  // Uses layouts/default.vue wrapper
})
</script>
```

**Benefits**:
- Consistent header/footer across product pages
- Centralized navigation management
- Shared styling and behavior

### 2. Component Architecture

#### BreadcrumbNav Component
```vue
<!-- components/BreadcrumbNav.vue -->
<template>
  <div class="breadcrumb-container">
    <nav class="breadcrumb">
      <span v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb-link">
          {{ item.name }}
        </NuxtLink>
        <span v-else class="breadcrumb-current">{{ item.name }}</span>
      </span>
    </nav>
  </div>
</template>
```

**Usage Pattern**:
```vue
<BreadcrumbNav :items="[
  { name: 'Products', to: '/products' }, 
  { name: 'Mod I EasyLok' }
]" />
```

#### Responsive Navigation Component
```vue
<!-- components/AppHeader.vue -->
<template>
  <header class="header">
    <!-- Desktop Navigation -->
    <nav class="nav-desktop">
      <NuxtLink v-for="link in navLinks" 
                :key="link.to" 
                :to="link.to" 
                class="nav-link">
        <i :class="link.icon"></i>
        <span>{{ link.text }}</span>
      </NuxtLink>
    </nav>
    
    <!-- Mobile Hamburger Menu -->
    <div class="hamburger-menu">
      <input type="checkbox" id="hamburger-toggle" class="hamburger-checkbox">
      <label for="hamburger-toggle" class="hamburger-label">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </label>
      <div class="hamburger-dropdown">
        <NuxtLink v-for="link in allLinks" 
                  :key="link.to" 
                  :to="link.to" 
                  class="dropdown-link">
          <i :class="link.icon"></i> {{ link.text }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
```

### 3. SEO & Meta Management

#### Head Management Pattern
```vue
<script setup>
useHead({
  title: 'Product Name',
  meta: [
    { name: 'description', content: 'Product description for SEO' },
    { property: 'og:title', content: 'Social media title' },
    { property: 'og:description', content: 'Social media description' },
    { property: 'og:image', content: 'https://shaftlok.com/image.png' },
    { property: 'og:url', content: 'https://shaftlok.com/product' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/product' }
  ]
})
</script>
```

#### Title Template Configuration
```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - Shaft Lok',
      // Results in: "Product Name - Shaft Lok"
    }
  }
})
```

### 4. CSS Architecture & Styling Patterns

#### CSS Custom Properties System
```css
:root {
  --federal-blue: #003366;
  --honolulu-blue: #0077be;
  --light-cyan: #e0f7ff;
  --non-photo-blue: #9ed9f5;
  
  --font-size-title: 3.5rem;
  --font-size-subtitle: 1.8rem;
  --font-size-description: 1.1rem;
  --font-size-icon: 1.3rem;
}
```

#### Responsive Design Pattern
```css
/* Desktop First Approach */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .feature-icon {
    display: none; /* Simplify mobile layout */
  }
}
```

#### Animation System
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: fadeIn 1s ease-out forwards;
  opacity: 0; /* Initial state */
}

.page-description {
  animation: fadeIn 1s ease-out 0.5s forwards; /* Staggered delay */
  opacity: 0;
}
```

## File-Based Routing Implementation

### Routing Structure
```
pages/
├── index.vue                 # Landing page (/)
├── about.vue                # About page (/about)
├── contact.vue              # Contact page (/contact)
├── installation.vue         # Installation guide (/installation)
├── testimonials.vue         # Testimonials (/testimonials)
├── yacht-list.vue          # Yacht list (/yacht-list)
├── faq.vue                 # FAQ page (/faq)
└── products/
    ├── index.vue           # Product catalog (/products)
    ├── mod-i-easylok.vue   # Individual product (/products/mod-i-easylok)
    ├── mod-ii-easylok.vue
    ├── mod-ii-easylok-high-torque.vue
    ├── mod-iii-easylok.vue
    ├── mod-iii-easylok-high-torque.vue
    ├── mod-iv.vue
    ├── mod-v.vue
    ├── mod-vi.vue
    ├── marine-control-cable.vue
    └── simple-spring-locking-system.vue
```

### Dynamic Navigation Generation
```vue
<!-- Product listing with automatic routing -->
<template>
  <div class="product-grid">
    <div v-for="product in products" :key="product.slug" class="product-card">
      <NuxtLink :to="`/products/${product.slug}`" class="product-link">
        <img :src="product.image" :alt="product.name">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <button class="details-btn">View Details</button>
      </NuxtLink>
    </div>
  </div>
</template>
```

## Content Migration Strategy

### 1. Systematic Content Porting
- **Phase 1**: Core pages (Landing, About, Contact)
- **Phase 2**: Information pages (Installation, FAQ, Testimonials)
- **Phase 3**: Product catalog (10 complete product pages)
- **Phase 4**: Enhancement and optimization

### 2. Content Structure Standardization

#### Product Page Template
```vue
<template>
  <div>
    <BreadcrumbNav :items="breadcrumbItems" />
    
    <div class="product-container">
      <div class="product-detail">
        <div class="product-card">
          <h1 class="page-title">{{ product.name }}</h1>
          <h2 class="page-description">{{ product.subtitle }}</h2>
          
          <div class="product-content">
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" class="product-image">
            </div>
            
            <div class="product-description">
              <div class="features-grid">
                <div v-for="feature in product.features" 
                     :key="feature.title" 
                     class="feature-item">
                  <h3 class="feature-title">
                    <i :class="feature.icon"></i>
                    {{ feature.title }}
                  </h3>
                  <p class="feature-description">{{ feature.description }}</p>
                </div>
              </div>
              
              <div class="details-text" v-html="product.details"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Key Architectural Decisions

### 1. Layout Strategy Rationale

#### Landing Page Isolation
```vue
<!-- pages/index.vue -->
<script setup>
definePageMeta({
  layout: false  // Prevents header/footer interference
})
</script>
```

**Benefits**:
- Full creative control over hero section
- Eliminates layout constraints
- Optimized for conversion-focused design

#### Product Pages Consistency
```vue
<!-- pages/products/*.vue -->
<script setup>
definePageMeta({
  layout: 'default'  // Ensures consistent navigation
})
</script>
```

**Benefits**:
- Shared header/footer across all product pages
- Consistent navigation behavior
- Centralized layout management

### 2. Component Reusability

#### BreadcrumbNav Component Design
```vue
<!-- Flexible, data-driven breadcrumb system -->
<BreadcrumbNav :items="[
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'Current Page' }  // No 'to' property = current page
]" />
```

**Features**:
- Dynamic breadcrumb generation
- SEO-friendly navigation structure
- Consistent styling across pages

### 3. Performance Optimizations

#### Image Loading Strategy
```vue
<img src="/assets/images/product.jpg" 
     alt="Product Name" 
     class="product-image" 
     loading="lazy">  <!-- Lazy loading for performance -->
```

#### CSS-in-Vue Scoping
```vue
<style scoped>
/* Scoped styles prevent CSS conflicts */
.product-card {
  /* Component-specific styling */
}
</style>
```

## Design System Implementation

### 1. Typography Hierarchy
```css
.page-title {
  font-family: 'DeVinneOrnamentDRegular', serif;  /* Brand font for "Shaft Lok" */
  font-size: var(--font-size-title);
  color: var(--federal-blue);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.page-description {
  font-size: var(--font-size-subtitle);
  color: var(--federal-blue);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
```

### 2. Color System
```css
:root {
  /* Primary Brand Colors */
  --federal-blue: #003366;      /* Primary brand color */
  --honolulu-blue: #0077be;     /* Accent color */
  
  /* Background Gradients */
  --light-cyan: #e0f7ff;        /* Light background */
  --non-photo-blue: #9ed9f5;    /* Gradient stops */
}
```

### 3. Interactive Components

#### Custom Scrollbar Design
```css
.details-text::-webkit-scrollbar {
  width: 8px;
}

.details-text::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.details-text::-webkit-scrollbar-thumb {
  background: var(--honolulu-blue);
  border-radius: 4px;
}

.details-text::-webkit-scrollbar-thumb:hover {
  background: var(--federal-blue);
}
```

## Error Resolution & Troubleshooting

### 1. Common Issues Encountered

#### 404 Routing Errors
**Problem**: Links missing `/products/` prefix
```html
<!-- Incorrect -->
<NuxtLink to="/mod-i-easylok">Product</NuxtLink>

<!-- Correct -->
<NuxtLink to="/products/mod-i-easylok">Product</NuxtLink>
```

#### Font Loading Issues
**Problem**: Brand font applying to entire headings instead of specific text
```css
/* Incorrect - applies to entire h1 */
h1 {
  font-family: 'DeVinneOrnamentDRegular', serif;
}

/* Correct - only "Shaft Lok" text gets brand font */
.brand-text {
  font-family: 'DeVinneOrnamentDRegular', serif;
}
```

#### Layout Warnings
**Problem**: Nuxt layout warnings for pages without `<NuxtLayout />`
**Solution**: Use `layout: false` for custom layout pages

### 2. Performance Optimizations

#### Image Optimization
```vue
<img src="/assets/images/product.jpg"
     alt="Descriptive alt text"
     loading="lazy"  <!-- Defer loading -->
     class="product-image">
```

#### CSS Animation Performance
```css
/* Use transform for better performance */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);  /* Hardware accelerated */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Project Structure Overview

```
shaftlok-mk4/
├── app.vue                    # Root application component
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Dependencies and scripts
├── assets/
│   ├── css/
│   │   ├── main.css          # Global styles and CSS variables
│   │   ├── yacht-list.css    # Page-specific styles
│   └── images/               # Static images
├── components/
│   ├── AppHeader.vue         # Navigation header
│   ├── AppFooter.vue         # Site footer
│   └── BreadcrumbNav.vue     # Breadcrumb navigation
├── layouts/
│   └── default.vue           # Default page layout wrapper
├── pages/                    # File-based routing
│   ├── index.vue            # Landing page (layout: false)
│   ├── about.vue            # About page
│   ├── contact.vue          # Contact page
│   ├── products/
│   │   ├── index.vue        # Product catalog
│   │   └── [product].vue    # Individual product pages
│   └── ...                  # Other pages
└── public/                  # Static assets
    ├── assets/images/       # Product images
    ├── sitemap.xml         # SEO sitemap
    └── _robots.txt         # Search engine directives
```

## Future Enhancement Opportunities

### 1. Content Management
- Consider headless CMS integration for easier content updates
- Implement dynamic product data management
- Add multi-language support capability

### 2. Performance Enhancements
- Implement image optimization pipeline
- Add Progressive Web App (PWA) features
- Consider static site generation for improved performance

### 3. User Experience
- Add search functionality across products
- Implement product comparison features
- Consider adding customer testimonial integration

### 4. Database Integration & Dynamic Content
- **Supabase Integration**: Implement Supabase database for dynamic content management
  - **Yacht List Database**: Replace static yacht list with dynamic database-driven content
  - **FAQ Management**: Convert static FAQ to database with admin CRUD capabilities
  - **Testimonials System**: Dynamic testimonial management with approval workflow
  - **Data Entry Forms**: Admin forms for adding new yachts, FAQs, and testimonials
  - **Real-time Updates**: Live content updates without deployment requirements
  - **Content Moderation**: Admin dashboard for reviewing and approving new submissions

### 5. Development Workflow
- Set up automated testing pipeline
- Implement continuous deployment
- Add content validation and linting

## Conclusion

The Shaft Lok MK4 migration successfully transformed a static HTML/CSS website into a modern, maintainable Nuxt 4.0 application while preserving all original content and functionality. The implementation demonstrates best practices for:

- **Modern Vue.js architecture** with Composition API
- **Responsive design patterns** for all device types
- **SEO optimization** with proper meta management
- **Component reusability** and maintainable code structure
- **Performance optimization** through lazy loading and efficient CSS

The new architecture provides a solid foundation for future enhancements while maintaining the professional appearance and functionality that customers expect from the Shaft Lok brand.