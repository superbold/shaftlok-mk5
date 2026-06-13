<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'Installation' }]" />
    
    <div class="product-container">
      <h1 class="page-title">Shaft Lok Installation Guide</h1>
      <p class="page-description">Comprehensive guide for installing and understanding your Shaft Lok system</p>
      <div class="product-detail">
        <div class="feature-cards">
          <div class="feature-card">
            <h2>Pre-Installation Check</h2>
            <ul>
              <li>Mod I Easy Lok: 4 1/8 inches diameter template</li>
              <li>Mod II Easy Lok: 6.75 inches diameter template</li>
              <li>Mod III Easy Lok: 11.75 inches diameter template</li>
            </ul>
            <p>Create a cardboard rotor template cut in half with a centered hole for the propeller shaft. Cut a loading slot equal to the propeller shaft diameter. Use this template in the engine room to verify fit.</p>
          </div>
          <div class="feature-card">
            <h2>System Components</h2>
            <p>Shaft Lok consists of two main sections:</p>
            <ul>
              <li>Upper Housing: Contains locking mechanism with long and short pins, stainless steel spring, and spring assembly screw</li>
              <li>Lower Housing: Features a deep groove sealed ball bearing (maintenance-free) containing the Black Rotating Disc & Stainless Steel Hub Assembly</li>
            </ul>
            <p>The propeller shaft is installed into the Hub Assembly and secured with stainless fasteners.</p>
          </div>
          <div class="feature-card">
            <h2>Locking Mechanisms</h2>
            <p>Two options for locking the system:</p>
            <ul>
              <li>Shaft Lok Marine Control Cable (S.L.M.C.C.): Fastened to the top of the housing with palm knob positioned in the cockpit</li>
              <li>Simple Spring Locking System (S.S.L.S.): Bolted to top of the housing with Black Palm Knob a few inches above the housing (requires engine room access)</li>
            </ul>
          </div>
          <div class="feature-card">
            <h2>Operation</h2>
            <p>To lock Shaft Lok when sailing:</p>
            <ul>
              <li>Press down on the Marine Control Cable or Simple Spring Locking System palm knob</li>
              <li>The long locking pin engages the rotating disc, preventing propeller rotation</li>
              <li>A spring-loaded short pin holds the long pin in locked/unlocked positions</li>
            </ul>
            <p>No electrical or hydraulic power required.</p>
          </div>
          <div class="feature-card">
            <h2>Benefits</h2>
            <p>Shaft Lok provides several advantages:</p>
            <ul>
              <li>Quiet operation while sailing</li>
              <li>Locks propeller in most efficient position (one blade vertical)</li>
              <li>Optimizes boat speed</li>
              <li>Prevents transmission and propeller shaft bearing wear</li>
              <li>Automatically unlocks when engine starts and transmission engages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Installation',
  meta: [
    { name: 'description', content: 'Shaft Lok installation guide - step-by-step instructions for marine propeller control systems. Professional tips, safety procedures, and maintenance. Easy DIY installation.' },
    { property: 'og:title', content: 'Shaft Lok Installation - Marine Propeller Control Setup Guide' },
    { property: 'og:description', content: 'Step-by-step installation guides for Shaft Lok marine shaft locking systems. Professional installation tips, safety procedures, and maintenance instructions.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/installation' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Installation - Marine Propeller Control Setup Guide' },
    { name: 'twitter:description', content: 'Step-by-step installation guides for Shaft Lok marine shaft locking systems. Professional installation tips, safety procedures, and maintenance instructions.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/installation' }
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
            name: 'Installation',
            item: 'https://shaftlok.com/installation'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Shaft Lok Installation Guide - Marine Shaft Locking System Setup',
        description: 'Shaft Lok installation guide - step-by-step instructions for marine shaft locking systems. Professional tips, safety procedures, and maintenance. Easy DIY installation.',
        url: 'https://shaftlok.com/installation',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        about: {
          '@type': 'HowTo',
          name: 'Marine Shaft Locking System Installation',
          description: 'Complete installation guide for Shaft Lok engine room shaft locking systems to prevent propeller shaft spinning'
        },
        mainEntity: {
          '@type': 'HowTo',
          name: 'How to Install Shaft Lok Marine Shaft Locking System'
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Install Shaft Lok Marine Propeller Control System',
        description: 'Complete step-by-step installation guide for Shaft Lok marine shaft locking systems. Professional installation tips, safety procedures, and maintenance instructions for optimal performance.',
        image: 'https://shaftlok.com/assets/images/shaftlok-install.jpg',
        totalTime: 'PT2H',
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: '0'
        },
        supply: [
          {
            '@type': 'HowToSupply',
            name: 'Shaft Lok Unit',
            description: 'Mod I, Mod II, or Mod III EasyLok system appropriate for your vessel'
          },
          {
            '@type': 'HowToSupply',
            name: 'Marine Control Cable or Simple Spring Locking System',
            description: 'Control mechanism for operating the system'
          },
          {
            '@type': 'HowToSupply',
            name: 'Cardboard Template',
            description: 'Template for pre-installation verification (Mod I: 4 1/8", Mod II: 6.75", Mod III: 11.75" diameter)'
          },
          {
            '@type': 'HowToSupply',
            name: 'Stainless Steel Fasteners',
            description: 'Provided with the system for securing propeller shaft'
          },
          {
            '@type': 'HowToSupply',
            name: 'Basic Tools',
            description: 'Standard marine installation tools'
          }
        ],
        tool: [
          {
            '@type': 'HowToTool',
            name: 'Drill',
            description: 'For creating dimples in propeller shaft'
          },
          {
            '@type': 'HowToTool',
            name: 'Drill Bit',
            description: 'Provided with system for shaft preparation'
          },
          {
            '@type': 'HowToTool',
            name: 'Wrench Set',
            description: 'For tightening fasteners'
          },
          {
            '@type': 'HowToTool',
            name: 'Measuring Tools',
            description: 'For verifying dimensions and fit'
          }
        ],
        step: [
          {
            '@type': 'HowToStep',
            name: 'Pre-Installation Check',
            text: 'Create a cardboard rotor template cut in half with a centered hole for the propeller shaft. Cut a loading slot equal to the propeller shaft diameter. Use this template in the engine room to verify fit.',
            image: 'https://shaftlok.com/assets/images/shaftlok-install.jpg',
            url: 'https://shaftlok.com/installation#pre-installation'
          },
          {
            '@type': 'HowToStep',
            name: 'Prepare System Components',
            text: 'Familiarize yourself with the two main sections: Upper Housing (contains locking mechanism with long and short pins, stainless steel spring, and spring assembly screw) and Lower Housing (features deep groove sealed ball bearing containing the Black Rotating Disc & Stainless Steel Hub Assembly).',
            image: 'https://shaftlok.com/assets/images/shaftlok-install.jpg',
            url: 'https://shaftlok.com/installation#components'
          },
          {
            '@type': 'HowToStep',
            name: 'Choose Locking Mechanism',
            text: 'Select either Shaft Lok Marine Control Cable (S.L.M.C.C.) for cockpit operation or Simple Spring Locking System (S.S.L.S.) for engine room access. The Marine Control Cable is fastened to the top of the housing with palm knob positioned in the cockpit, while the Simple Spring Locking System is bolted to top of the housing with Black Palm Knob a few inches above the housing.',
            image: 'https://shaftlok.com/assets/images/shaftlok-install.jpg',
            url: 'https://shaftlok.com/installation#locking-mechanisms'
          },
          {
            '@type': 'HowToStep',
            name: 'Install Propeller Shaft',
            text: 'Install the propeller shaft into the Hub Assembly and secure with stainless fasteners. Ensure proper alignment and secure attachment.',
            image: 'https://shaftlok.com/assets/images/shaftlok-install.jpg',
            url: 'https://shaftlok.com/installation#shaft-installation'
          },
          {
            '@type': 'HowToStep',
            name: 'Test Operation',
            text: 'To lock Shaft Lok when sailing: Press down on the Marine Control Cable or Simple Spring Locking System palm knob. The long locking pin engages the rotating disc, preventing propeller rotation. A spring-loaded short pin holds the long pin in locked/unlocked positions. No electrical or hydraulic power required.',
            image: 'https://shaftlok.com/assets/images/shaftlok-install.jpg',
            url: 'https://shaftlok.com/installation#operation'
          },
          {
            '@type': 'HowToStep',
            name: 'Verify Benefits',
            text: 'Confirm the system provides quiet operation while sailing, locks propeller in most efficient position (one blade vertical), optimizes boat speed, prevents transmission and propeller shaft bearing wear, and automatically unlocks when engine starts and transmission engages.',
            image: 'https://shaftlok.com/assets/images/shaftlok-install.jpg',
            url: 'https://shaftlok.com/installation#benefits'
          }
        ],
        author: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png'
          }
        },
        datePublished: '2024-01-01',
        dateModified: '2024-12-19',
        mainEntityOfPage: 'https://shaftlok.com/installation',
        about: {
          '@type': 'Thing',
          name: 'Marine Propeller Control Systems',
          description: 'Shaft Lok marine shaft locking systems for boats and yachts'
        },
        category: 'Marine Equipment Installation',
        difficulty: 'Intermediate',
        audience: {
          '@type': 'Audience',
          audienceType: 'Boat owners, marine mechanics, yacht maintenance professionals'
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How long does it take to install a Shaft Lok marine shaft locking system?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The complete Shaft Lok installation typically takes about 2 hours for an experienced installer. This includes pre-installation checks, system preparation, shaft installation, and testing. First-time installations may take longer, but the process is straightforward with our detailed instructions.'
            }
          },
          {
            '@type': 'Question',
            name: 'What tools are needed to install Shaft Lok?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You\'ll need basic marine installation tools including a drill, drill bit (provided with system), wrench set for tightening fasteners, and measuring tools for verifying dimensions. The system comes with all necessary stainless steel fasteners and mounting hardware.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I install Shaft Lok myself or do I need a professional?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok is designed for DIY installation with our comprehensive step-by-step guide. However, if you\'re not comfortable with marine engine room work or have complex shaft configurations, we recommend professional installation. Contact us for installation support or to find authorized installers in your area.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I know which Shaft Lok model is right for my vessel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Choose based on your vessel size and shaft diameter: Mod I for small sailboats (up to 1.77" shaft), Mod II for medium sailboats 20-100 feet (up to 2.25" shaft), Mod III for large vessels (up to 3.15" shaft). Use our cardboard template to verify fit in your engine room before purchase.'
            }
          },
          {
            '@type': 'Question',
            name: 'What are the benefits of installing Shaft Lok?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok provides several key benefits: improved sailing performance with more speed, quieter engine room operation by eliminating shaft spinning noise, reduced transmission and propeller shaft bearing wear, and automatic unlocking when the engine starts. Industrial vessels also benefit from improved MTBF (Mean Time Between Failures) with dual-propeller systems.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do I need both the Marine Control Cable and Simple Spring Locking System?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No, you choose one control method based on your preference: Marine Control Cable for convenient cockpit operation without engine room access, or Simple Spring Locking System for cost-effective manual operation requiring engine room access. Both are compatible with all Shaft Lok models.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is Shaft Lok compatible with all types of propellers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok works with most fixed-blade propellers on sailboats and motor vessels. It\'s designed for standard propeller shaft configurations and is compatible with most marine transmission systems. Contact us if you have specialty propeller or shaft configurations for custom solutions.'
            }
          },
          {
            '@type': 'Question',
            name: 'What maintenance does Shaft Lok require after installation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok requires minimal maintenance. The system features a maintenance-free deep-groove sealed ball bearing. Regular inspection of the locking mechanism and occasional cleaning of the control cable (if used) is recommended. The system is designed for long-term reliability with minimal upkeep.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can Shaft Lok be installed on both sailboats and motor vessels?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Shaft Lok is designed for both sailboats and motor vessels. Sailboats benefit from improved performance and quieter operation while sailing. Motor vessels, especially those with dual propellers, can use Shaft Lok to improve MTBF by locking one propeller while using the other, reducing wear and maintenance costs.'
            }
          },
          {
            '@type': 'Question',
            name: 'What if I need help during installation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We provide comprehensive installation support including detailed instructions, technical support via phone and email, and access to authorized installers. Contact our technical support team at 1-262-786-6800 or email kenneth.nigel@shaftlok.com for assistance with any installation questions or issues.'
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
.product-container {
  margin-top: 4rem;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.product-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/images/shaftlok-install.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 0;
}

.product-container::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
      var(--light-cyan) 0%,
      rgba(202, 240, 248, 0.8) 25%,
      rgba(202, 240, 248, 0.6) 50%,
      rgba(202, 240, 248, 0.4) 75%,
      transparent 100%);
  z-index: 0;
}

.product-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.feature-cards {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  color: var(--federal-blue);
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 0;
  animation: fadeIn 1s ease-out forwards;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
}

.page-description {
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: var(--federal-blue);
  max-width: 800px;
  margin: 0 auto 2rem;
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
  text-align: center;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-out forwards;
  opacity: 0;
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.feature-card:nth-child(1) { animation-delay: 0.2s; }
.feature-card:nth-child(2) { animation-delay: 0.4s; }
.feature-card:nth-child(3) { animation-delay: 0.6s; }
.feature-card:nth-child(4) { animation-delay: 0.8s; }
.feature-card:nth-child(5) { animation-delay: 1.0s; }

.feature-card h2 {
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--federal-blue);
  margin: 0 0 1rem 0;
  position: relative;
  display: inline-block;
}

.feature-card h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--federal-blue), transparent);
}

.feature-card p {
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.6;
  font-size: 1.1rem;
}

.feature-card ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.feature-card li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
  color: #333;
  font-size: 1.1rem;
}

.feature-card li::before {
  content: '✓';
  color: var(--honolulu-blue);
  position: absolute;
  left: 0;
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
  .product-container::after {
    background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.9) 50%,
        rgba(255, 255, 255, 1) 100%);
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style>