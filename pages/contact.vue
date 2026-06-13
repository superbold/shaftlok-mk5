<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Contact' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-envelope"></i> Get in touch</span>
      <h1>Contact <span class="shaftlok-font grad-text">Shaft Lok</span></h1>
      <p>Questions, support, or yacht details for a quote — Anne Marie or Kenneth will get back to you.</p>
    </div>

    <div class="contact-layout">
      <div class="contact-cards">
        <div class="contact-card glass-card hoverable" v-reveal>
          <i class="fas fa-envelope contact-icon"></i>
          <h3>Email</h3>
          <p><a href="mailto:sean.nigel@shaftlok.com">sean.nigel@shaftlok.com</a></p>
        </div>
        <div class="contact-card glass-card hoverable" v-reveal="80">
          <i class="fas fa-phone contact-icon"></i>
          <h3>Phone</h3>
          <p><a href="tel:+12627866800">1-262-786-6800</a></p>
        </div>
        <div class="contact-card glass-card hoverable" v-reveal="160">
          <i class="fas fa-map-marker-alt contact-icon"></i>
          <h3>Address</h3>
          <p>Milwaukee, Wisconsin 53211 USA</p>
        </div>
        <div class="contact-card glass-card hoverable" v-reveal="240">
          <i class="fas fa-clock contact-icon"></i>
          <h3>Business Hours</h3>
          <p>Mon–Fri 9:00 AM – 5:00 PM CST</p>
        </div>
      </div>

      <div class="contact-aside">
        <div class="map-frame glass-card" v-reveal="120">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d186588.20999999996!2d-88.1062017!3d43.0389025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880502d7578b47e7%3A0x445f1922b5417b84!2sMilwaukee%2C%20WI!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Map of Milwaukee, Wisconsin - Shaft Lok Inc. location"
          ></iframe>
        </div>

        <div class="contact-notes glass-card prose" v-reveal="200">
          <h2><i class="fas fa-circle-info"></i> Good to know</h2>
          <p><em>Leave a message if the machine answers. We will return your call.</em></p>
          <p><em>Note: If the surf is up on Lake Michigan, our hours may vary.</em></p>
          <p>For offshore inquiries, please include:</p>
          <ul class="check-list">
            <li>Exact "ship to" address including zip code</li>
            <li>Named contact person</li>
            <li>Phone number</li>
          </ul>
          <p><em>This information is needed to estimate shipping costs.</em></p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
useHead({
  title: 'Contact',
  meta: [
    { name: 'description', content: 'Contact Shaft Lok for expert marine propeller control support. Product inquiries, technical assistance, and personalized solutions for your vessel. Milwaukee, WI.' },
    { property: 'og:title', content: 'Contact Shaft Lok - Expert Marine Propeller Control Support' },
    { property: 'og:description', content: 'Contact ShaftLok for expert support, product inquiries, and technical assistance. Get personalized solutions for your marine shaft locking needs.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/contact' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Contact Shaft Lok - Expert Marine Propeller Control Support' },
    { name: 'twitter:description', content: 'Contact ShaftLok for expert support, product inquiries, and technical assistance. Get personalized solutions for your marine shaft locking needs.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/contact' }
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
            name: 'Contact',
            item: 'https://shaftlok.com/contact'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://shaftlok.com/#organization',
        name: 'Shaft Lok Inc.',
        legalName: 'Shaft Lok Inc.',
        description: 'Leading manufacturer of innovative marine propeller control systems since 1979. Providing premium quality, easy installation, and reliable propeller locking solutions for improved sailing performance.',
        url: 'https://shaftlok.com',
        logo: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png',
        image: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png',
        telephone: '+1-262-786-6800',
        email: 'sean.nigel@shaftlok.com',
        foundingDate: '1979',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Milwaukee',
          addressLocality: 'Milwaukee',
          addressRegion: 'Wisconsin',
          postalCode: '53211',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '43.0389',
          longitude: '-87.9065'
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '17:00',
            validFrom: '2024-01-01',
            validThrough: '2024-12-31'
          }
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+1-262-786-6800',
            contactType: 'Customer Service',
            availableLanguage: 'English',
            areaServed: 'US',
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '17:00'
            }
          },
          {
            '@type': 'ContactPoint',
            email: 'sean.nigel@shaftlok.com',
            contactType: 'Sales',
            availableLanguage: 'English',
            areaServed: 'Worldwide'
          }
        ],
        sameAs: [],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Marine Propeller Control Systems',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mod I EasyLok',
                category: 'Marine Equipment'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mod II EasyLok',
                category: 'Marine Equipment'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mod III EasyLok',
                category: 'Marine Equipment'
              }
            }
          ]
        },
        areaServed: {
          '@type': 'Country',
          name: 'United States'
        },
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: '43.0389',
            longitude: '-87.9065'
          },
          geoRadius: '5000000'
        },
        priceRange: '$$',
        paymentAccepted: 'Cash, Check, Credit Card, Wire Transfer',
        currenciesAccepted: 'USD'
      })
    }
  ]
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 1.4rem;
  align-items: start;
}

.contact-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.4rem;
}

.contact-card {
  padding: 1.7rem 1.9rem;
}

.contact-icon {
  font-size: 1.2rem;
  color: var(--accent);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: var(--radius-sm);
  width: 2.6rem;
  height: 2.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.contact-card h3 {
  font-size: 1.05rem;
  margin: 0 0 0.3rem;
}

.contact-card p {
  color: var(--text-mid);
  margin: 0;
  font-size: 0.98rem;
}

.contact-card a {
  color: var(--accent);
  text-decoration: none;
}

.contact-card a:hover { color: var(--accent-2); }

.contact-aside {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.map-frame {
  overflow: hidden;
  border-radius: var(--radius-lg);
  line-height: 0;
}

.map-frame iframe {
  width: 100%;
  height: 320px;
  border: none;
  filter: invert(0.88) hue-rotate(185deg) saturate(0.7) brightness(0.95);
}

.contact-notes {
  padding: 1.9rem 2.1rem;
}

.contact-notes h2 {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.2rem;
  margin: 0 0 1rem;
}

.contact-notes h2 i { color: var(--accent-2); font-size: 1rem; }

.contact-notes em { color: var(--gold); }

@media (max-width: 860px) {
  .contact-layout { grid-template-columns: 1fr; }
  .contact-cards { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 560px) {
  .contact-cards { grid-template-columns: 1fr; }
}
</style>
