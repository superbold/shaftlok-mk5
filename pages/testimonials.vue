<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'Testimonials' }]" />
    
    <div class="testimonials-container">
      <h1 class="page-title">Customer Testimonials</h1>
      <p class="page-description">What sailors are saying about Shaft Lok</p>
      
      <div class="testimonials-grid">
        <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
          <div class="testimonial-content">
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <strong>{{ testimonial.author }}</strong>
              <span class="testimonial-boat">{{ testimonial.boat }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
      children: JSON.stringify({
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
      children: JSON.stringify({
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
.testimonials-container {
  margin-top: 4rem;
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  text-align: center;
  color: var(--federal-blue);
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out forwards;
}

.page-description {
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: var(--federal-blue);
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-out 0.3s forwards;
  opacity: 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: white;
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.testimonial-card:nth-child(1) { animation-delay: 0.2s; }
.testimonial-card:nth-child(2) { animation-delay: 0.4s; }
.testimonial-card:nth-child(3) { animation-delay: 0.6s; }
.testimonial-card:nth-child(4) { animation-delay: 0.8s; }
.testimonial-card:nth-child(5) { animation-delay: 1.0s; }
.testimonial-card:nth-child(6) { animation-delay: 1.2s; }

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.testimonial-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.testimonial-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  font-style: italic;
  margin: 0;
}

.testimonial-author {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.testimonial-author strong {
  color: var(--federal-blue);
  font-size: 1rem;
}

.testimonial-boat {
  color: var(--honolulu-blue);
  font-size: 0.9rem;
}

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

@media (max-width: 768px) {
  .testimonials-container {
    padding: 2rem 1rem;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .testimonial-card {
    padding: 1.5rem;
  }
}
</style>