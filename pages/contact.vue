<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'Contact' }]" />
    
    <div class="product-container">
      <div class="product-detail">
        <div class="product-card">
          <h1 class="page-title">Contact Information</h1>
          <h2 class="page-description">Get in touch with us for any questions or support</h2>
          <div class="product-content">
            <div class="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d186588.20999999996!2d-88.1062017!3d43.0389025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880502d7578b47e7%3A0x445f1922b5417b84!2sMilwaukee%2C%20WI!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus" 
                allowfullscreen 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div class="contact-description">
              <div class="contact-grid">
                <div class="contact-item">
                  <h3 class="contact-title">
                    <i class="fas fa-envelope contact-icon"></i>
                    Email
                  </h3>
                  <p class="contact-value">kenneth.nigel@shaftlok.com</p>
                </div>
                <div class="contact-item">
                  <h3 class="contact-title">
                    <i class="fas fa-phone contact-icon"></i>
                    Phone
                  </h3>
                  <p class="contact-value">1-262-786-6800</p>
                </div>
                <div class="contact-item">
                  <h3 class="contact-title">
                    <i class="fas fa-map-marker-alt contact-icon"></i>
                    Address
                  </h3>
                  <p class="contact-value">Milwaukee, Wisconsin 53211 USA</p>
                </div>
                <div class="contact-item">
                  <h3 class="contact-title">
                    <i class="fas fa-clock contact-icon"></i>
                    Business Hours
                  </h3>
                  <p class="contact-value">Mon-Fri 9:00 AM - 5:00 PM CST</p>
                </div>
                <div class="contact-item">
                  <h3 class="contact-title">
                    <i class="fas fa-users contact-icon"></i>
                    Contact
                  </h3>
                  <p class="contact-value">Anne Marie or Kenneth</p>
                </div>
              </div>
              <div class="details-text">
                <p style="font-style: italic;">
                  Leave a message if the machine answers. We will return your call.
                </p>
                <p style="font-style: italic;">
                  Note: If the surf is up on Lake Michigan, our hours may vary.
                </p>
                <p style="margin-top: 1.5rem;">
                  For offshore inquiries, please include:
                </p>
                <ul>
                  <li>Exact "ship to" address including zip code</li>
                  <li>Named contact person</li>
                  <li>Phone number</li>
                </ul>
                <p style="font-style: italic;">
                  This information is needed to estimate shipping costs.
                </p>
              </div>
            </div>
          </div>
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
        email: 'kenneth.nigel@shaftlok.com',
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
            email: 'kenneth.nigel@shaftlok.com',
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
.product-container {
  margin-top: 8rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--light-cyan), white);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  background-color: white;
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-out forwards;
  opacity: 0;
  position: relative;
}

.page-title {
  text-align: center;
  color: var(--federal-blue);
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-size: var(--font-size-title);
  margin-top: 1rem;
  margin-bottom: 0;
  animation: fadeIn 1s ease-out forwards;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
}

.page-description {
  font-size: var(--font-size-subtitle);
  color: var(--federal-blue);
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
  text-align: center;
}

.product-content {
  display: flex;
  gap: 2rem;
  padding-top: 2rem;
}

.map-container {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 600px;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.contact-description {
  flex: 2;
  color: #333;
  line-height: 1.6;
  font-size: var(--font-size-description);
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.contact-item {
  text-align: left;
}

.contact-title {
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-subtitle);
}

.contact-icon {
  color: var(--honolulu-blue);
  font-size: var(--font-size-icon);
}

.contact-value {
  color: #666;
  font-size: var(--font-size-description);
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 2rem;
}

.details-text {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  margin-top: 1rem;
  color: #333;
  line-height: 1.6;
}

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

.details-text p {
  margin-bottom: 1rem;
}

.details-text ul {
  list-style-type: none;
  padding-left: 1.5rem;
  display: block;
}

.details-text li {
  margin-bottom: 0.5rem;
  position: relative;
  width: 100%;
}

.details-text li::before {
  content: '•';
  color: var(--honolulu-blue);
  position: absolute;
  left: -1.5rem;
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
  .product-detail {
    padding: 1rem;
  }

  .product-card {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .product-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .map-container {
    width: 100%;
    height: auto;
  }

  .contact-description {
    width: 100%;
    height: auto;
  }
}
</style>