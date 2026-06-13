<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Installation' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-wrench"></i> Installation guide</span>
      <h1><span class="shaftlok-font grad-text">Shaft Lok</span> Installation</h1>
      <p>Comprehensive guide for installing and understanding your Shaft Lok system — about two hours with basic tools.</p>
    </div>

    <div class="steps">
      <div class="step-card glass-card hoverable prose" v-reveal>
        <div class="step-num">01</div>
        <div class="step-body">
          <h2>Pre-Installation Check</h2>
          <ul class="check-list">
            <li>Mod I Easy Lok: 4 1/8 inches diameter template</li>
            <li>Mod II Easy Lok: 6.75 inches diameter template</li>
            <li>Mod III Easy Lok: 11.75 inches diameter template</li>
          </ul>
          <p>Create a cardboard rotor template cut in half with a centered hole for the propeller shaft. Cut a loading slot equal to the propeller shaft diameter. Use this template in the engine room to verify fit.</p>
        </div>
      </div>

      <div class="step-card glass-card hoverable prose" v-reveal="100">
        <div class="step-num">02</div>
        <div class="step-body">
          <h2>System Components</h2>
          <p>Shaft Lok consists of two main sections:</p>
          <ul class="check-list">
            <li>Upper Housing: Contains locking mechanism with long and short pins, stainless steel spring, and spring assembly screw</li>
            <li>Lower Housing: Features a deep groove sealed ball bearing (maintenance-free) containing the Black Rotating Disc &amp; Stainless Steel Hub Assembly</li>
          </ul>
          <p>The propeller shaft is installed into the Hub Assembly and secured with stainless fasteners.</p>
        </div>
      </div>

      <div class="step-card glass-card hoverable prose" v-reveal="100">
        <div class="step-num">03</div>
        <div class="step-body">
          <h2>Locking Mechanisms</h2>
          <p>Two options for locking the system:</p>
          <ul class="check-list">
            <li>Shaft Lok Marine Control Cable (S.L.M.C.C.): Fastened to the top of the housing with palm knob positioned in the cockpit</li>
            <li>Simple Spring Locking System (S.S.L.S.): Bolted to top of the housing with Black Palm Knob a few inches above the housing (requires engine room access)</li>
          </ul>
        </div>
      </div>

      <div class="step-card glass-card hoverable prose" v-reveal="100">
        <div class="step-num">04</div>
        <div class="step-body">
          <h2>Operation</h2>
          <p>To lock Shaft Lok when sailing:</p>
          <ul class="check-list">
            <li>Press down on the Marine Control Cable or Simple Spring Locking System palm knob</li>
            <li>The long locking pin engages the rotating disc, preventing propeller rotation</li>
            <li>A spring-loaded short pin holds the long pin in locked/unlocked positions</li>
          </ul>
          <p>No electrical or hydraulic power required.</p>
        </div>
      </div>

      <div class="step-card glass-card hoverable prose" v-reveal="100">
        <div class="step-num">05</div>
        <div class="step-body">
          <h2>Benefits</h2>
          <p>Shaft Lok provides several advantages:</p>
          <ul class="check-list">
            <li>Quiet operation while sailing</li>
            <li>Locks propeller in most efficient position (one blade vertical)</li>
            <li>Optimizes boat speed</li>
            <li>Prevents transmission and propeller shaft bearing wear</li>
            <li>Automatically unlocks when engine starts and transmission engages</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="install-cta glass-card" v-reveal>
      <div>
        <h2>Need a hand with your installation?</h2>
        <p>Our technical team has guided over 1,390 installations since 1979.</p>
      </div>
      <NuxtLink to="/contact" class="btn btn-primary">Contact Support</NuxtLink>
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
              text: 'We provide comprehensive installation support including detailed instructions, technical support via phone and email, and access to authorized installers. Contact our technical support team at 1-262-786-6800 or email sean.nigel@shaftlok.com for assistance with any installation questions or issues.'
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
.steps {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  max-width: 860px;
  margin: 0 auto;
}

.step-card {
  display: flex;
  gap: 1.8rem;
  padding: 2rem 2.2rem;
}

.step-num {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  width: 3.6rem;
  height: 3.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(56, 189, 248, 0.06);
}

.step-body { flex: 1; }

.step-body h2 {
  font-size: 1.3rem;
  margin: 0.35rem 0 0.9rem;
}

.install-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 860px;
  margin: 2.5rem auto 0;
  padding: 2rem 2.2rem;
}

.install-cta h2 {
  font-size: 1.3rem;
  margin: 0 0 0.4rem;
}

.install-cta p {
  color: var(--text-mid);
  margin: 0;
}

@media (max-width: 560px) {
  .step-card {
    flex-direction: column;
    gap: 0.8rem;
    padding: 1.6rem 1.4rem;
  }
}
</style>
