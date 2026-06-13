/// <reference types="nuxt" />
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-16',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
  ],
  supabase: {
    redirect: false,
    useSsrCookies: false,
    types: false,
    redirectOptions: {
      login: '/adminaccess',
      callback: '/yacht-list',
      exclude: ['/', '/adminaccess', '/reset-password', '/products', '/installation', '/contact', '/faq', '/testimonials', '/about']
    },
    clientOptions: {
      auth: {
        flowType: 'implicit'
      }
    }
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/yacht-list.css'
  ],
  app: {
    head: {
      titleTemplate: '%s - Shaft Lok',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#040A18' },
        { name: 'robots', content: 'index, follow' },
        { name: 'description', content: 'Shaft Lok - Premium marine propeller locking systems for boats and yachts. Secure your propeller with our innovative locking solutions.' },
        { property: 'og:title', content: 'Shaft Lok - Marine Propeller Locking Systems' },
        { property: 'og:description', content: 'Premium marine propeller locking systems for boats and yachts. Secure your propeller with our innovative locking solutions.' },
        { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
        { property: 'og:image:width', content: '512' },
        { property: 'og:image:height', content: '512' },
        { property: 'og:url', content: 'https://shaftlok.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Shaft Lok - Marine Propeller Locking Systems' },
        { name: 'twitter:description', content: 'Premium marine propeller locking systems for boats and yachts.' },
        { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/assets/images/favico/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ],
      script: [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-XDWZW2TCLR'
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XDWZW2TCLR', {
              anonymize_ip: true
            });
          `,
          type: 'text/javascript'
        }
      ]
    }
  }
})
