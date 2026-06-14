<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Testimonials' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-star"></i> Customer stories</span>
      <h1>What sailors are <span class="grad-text">saying</span></h1>
      <p>Real experiences from skippers who locked the shaft and freed the sail.</p>
    </div>

    <div class="testimonials-grid">
      <figure
        v-for="(testimonial, index) in testimonials"
        :key="index"
        class="testimonial-card glass-card hoverable"
        v-reveal="(index % 3) * 100"
      >
        <div class="stars" aria-label="5 out of 5 stars">
          <i v-for="n in 5" :key="n" class="fas fa-star"></i>
        </div>
        <blockquote>"{{ testimonial.text }}"</blockquote>
        <figcaption>
          <span class="avatar">{{ initials(testimonial.author) }}</span>
          <span class="author-meta">
            <strong>{{ testimonial.author }}</strong>
            <span class="boat"><i class="fas fa-sailboat"></i> {{ testimonial.boat }}</span>
          </span>
        </figcaption>
      </figure>
    </div>

    <div class="testimonial-cta glass-card" v-reveal>
      <div>
        <h2>Sailing with a <span class="shaftlok-font">Shaft Lok</span>?</h2>
        <p>We'd love to hear your story — and add your yacht to the list.</p>
      </div>
      <NuxtLink to="/contact" class="btn btn-primary">Share Your Experience</NuxtLink>
    </div>
  </div>
</template>


<script setup>
// First letters of the first two name words (skipping titles like "Captain")
const initials = (name) => {
  const words = name.replace(/^Captain\s+/i, '').split(/\s+/)
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const testimonials = [
  {
    text: "The Shaft Lok has been a game changer for our sailing experience. No more annoying propeller noise, and we've noticed a definite improvement in our sailing speed.",
    author: "Captain James Wilson",
    boat: "Catalina 34 'Sea Breeze'"
  },
  {
    text: "Installation was straightforward, and the system works flawlessly. Being able to lock the propeller from the cockpit is incredibly convenient.",
    author: "Sarah Martinez",
    boat: "Hunter 36 'Wind Dancer'"
  },
  {
    text: "After 15 years with Shaft Lok, I can't imagine sailing without it. The system is maintenance-free and reliable.",
    author: "Robert Thompson",
    boat: "Pearson 365 'Ocean Spirit'"
  },
  {
    text: "The difference in sailing performance is remarkable. Quiet, smooth sailing without the constant clunking of a free-wheeling propeller.",
    author: "Linda Chen",
    boat: "Beneteau 393 'Blue Horizon'"
  },
  {
    text: "Excellent product with great customer support. The engineering is top-notch and built to last in the marine environment.",
    author: "Captain Mike Davis",
    boat: "Jeanneau 42 'Serenity'"
  },
  {
    text: "Worth every penny. The peace of mind knowing our transmission isn't being damaged by propeller drag is invaluable.",
    author: "Tom and Jennifer Adams",
    boat: "Catalina 42 'Freedom'"
  }
]

useHead({
  title: 'Testimonials',
  meta: [
    { name: 'description', content: 'Shaft Lok customer testimonials - real experiences from sailors who improved their sailing performance with our marine propeller control systems. Read reviews.' },
    { property: 'og:title', content: 'Shaft Lok Testimonials - Customer Reviews & Experiences' },
    { property: 'og:description', content: 'Read testimonials from satisfied Shaft Lok customers. Real experiences from sailors who have improved their sailing with our marine shaft locking systems.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/testimonials' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Testimonials - Customer Reviews & Experiences' },
    { name: 'twitter:description', content: 'Read testimonials from satisfied Shaft Lok customers. Real experiences from sailors who have improved their sailing.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/testimonials' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://shaftlok.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Testimonials',
            item: 'https://shaftlok.com/testimonials'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Shaft Lok Inc.',
        review: [
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Captain James Wilson'
            },
            reviewBody: 'The Shaft Lok has been a game changer for our sailing experience. No more annoying propeller noise, and we\'ve noticed a definite improvement in our sailing speed.',
            itemReviewed: {
              '@type': 'Product',
              name: 'Shaft Lok Marine Propeller Control System'
            }
          },
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Sarah Martinez'
            },
            reviewBody: 'Installation was straightforward, and the system works flawlessly. Being able to lock the propeller from the cockpit is incredibly convenient.',
            itemReviewed: {
              '@type': 'Product',
              name: 'Shaft Lok Marine Propeller Control System'
            }
          },
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Robert Thompson'
            },
            reviewBody: 'After 15 years with Shaft Lok, I can\'t imagine sailing without it. The system is maintenance-free and reliable.',
            itemReviewed: {
              '@type': 'Product',
              name: 'Shaft Lok Marine Propeller Control System'
            }
          },
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Linda Chen'
            },
            reviewBody: 'The difference in sailing performance is remarkable. Quiet, smooth sailing without the constant clunking of a free-wheeling propeller.',
            itemReviewed: {
              '@type': 'Product',
              name: 'Shaft Lok Marine Propeller Control System'
            }
          }
        ]
      })
    }
  ]
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;
}

.testimonial-card {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 1.9rem 2rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
  color: var(--gold);
  font-size: 0.85rem;
  margin-bottom: 1.1rem;
}

blockquote {
  flex: 1;
  margin: 0 0 1.5rem;
  color: var(--text-mid);
  font-size: 1rem;
  line-height: 1.7;
}

figcaption {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border-top: 1px solid var(--line);
  padding-top: 1.2rem;
}

.avatar {
  flex-shrink: 0;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 999px;
  background: var(--grad-accent);
  color: #04121F;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.author-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.author-meta strong {
  font-family: var(--font-display);
  color: var(--text-hi);
  font-size: 0.97rem;
}

.boat {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text-low);
  font-size: 0.85rem;
}

.boat i { color: var(--accent); font-size: 0.75rem; }

.testimonial-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2.5rem;
  padding: 2rem 2.2rem;
}

.testimonial-cta h2 {
  font-size: 1.3rem;
  margin: 0 0 0.4rem;
}

.testimonial-cta p {
  color: var(--text-mid);
  margin: 0;
}

@media (max-width: 980px) {
  .testimonials-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 620px) {
  .testimonials-grid { grid-template-columns: 1fr; }
}
</style>
