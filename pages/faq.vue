<template>
  <div class="page-shell faq-shell">
    <BreadcrumbNav :items="[{ name: 'FAQ' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-circle-question"></i> Support</span>
      <h1>Frequently Asked <span class="grad-text">Questions</span></h1>
      <p>Common questions about <span class="shaftlok-font">Shaft Lok</span> marine shaft locking systems</p>
    </div>

    <div class="faq-list">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        :class="['faq-item glass-card', { open: faq.isOpen }]"
        v-reveal="(index % 4) * 60"
      >
        <button
          class="faq-question"
          :aria-expanded="faq.isOpen"
          @click="toggleFaq(index)"
        >
          <span class="faq-q-text">{{ faq.question }}</span>
          <span class="faq-toggle"><i class="fas fa-plus"></i></span>
        </button>
        <div class="faq-answer" :class="{ open: faq.isOpen }">
          <p v-html="faq.answer"></p>
        </div>
      </div>
    </div>

    <div class="faq-cta glass-card" v-reveal>
      <div>
        <h2>Still have a question?</h2>
        <p>Call 1-262-786-6800 or send us your vessel details — we answer every inquiry.</p>
      </div>
      <NuxtLink to="/contact" class="btn btn-primary">Contact Us</NuxtLink>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const faqs = ref([
  {
    question: "What is Shaft Lok and how does it work?",
    answer: "Shaft Lok is a marine shaft locking system that prevents propeller free-wheeling when sailing. It uses a spring-loaded locking mechanism that engages the propeller shaft, preventing rotation and reducing drag, noise, and wear.",
    isOpen: false
  },
  {
    question: "Will Shaft Lok fit my boat?",
    answer: "Shaft Lok systems are available in multiple sizes (Mod I, II, III) to accommodate various shaft diameters and boat sizes. Check our installation guide for specific measurements and compatibility requirements.",
    isOpen: false
  },
  {
    question: "Do I need a Marine Control Cable?",
    answer: "The Marine Control Cable allows you to operate Shaft Lok from the cockpit. Alternatively, you can use the Simple Spring Locking System which requires engine room access. The cable system is more convenient for frequent use.",
    isOpen: false
  },
  {
    question: "How do I install Shaft Lok?",
    answer: "Installation requires basic mechanical skills and tools. The system mounts between the transmission and propeller. Professional installation is recommended for optimal performance. See our installation guide for detailed instructions.",
    isOpen: false
  },
  {
    question: "Does Shaft Lok require maintenance?",
    answer: "Shaft Lok features maintenance-free ball bearings and marine-grade materials. Occasional inspection and cleaning are recommended, but no regular maintenance is required under normal operating conditions.",
    isOpen: false
  },
  {
    question: "Will Shaft Lok automatically unlock when I start the engine?",
    answer: "Yes, when you engage the transmission, the rotational force automatically disengages the locking mechanism, allowing normal propeller operation. No manual unlocking is required.",
    isOpen: false
  },
  {
    question: "What transmissions are compatible with Shaft Lok?",
    answer: "Shaft Lok is compatible with Borg Warner, Paragon, Hurth, and Volvo Penta transmissions, among others. Contact us for specific compatibility questions about your transmission model.",
    isOpen: false
  },
  {
    question: "How much does Shaft Lok improve sailing performance?",
    answer: "Users typically report improved sailing speed, reduced noise, and smoother sailing experience. The locked propeller reduces drag and prevents the annoying 'free-wheeling' sound during sailing.",
    isOpen: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

useHead({
  title: 'FAQ',
  meta: [
    { name: 'description', content: 'Shaft Lok FAQ - answers to common questions about marine propeller control systems. Installation tips, maintenance guides, and expert technical support.' },
    { property: 'og:title', content: 'Shaft Lok FAQ - Marine Propeller Control Questions & Answers' },
    { property: 'og:description', content: 'Find answers to frequently asked questions about Shaft Lok marine shaft locking systems. Installation tips, maintenance guides, and technical support information.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/faq' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok FAQ - Marine Propeller Control Questions & Answers' },
    { name: 'twitter:description', content: 'Find answers to frequently asked questions about Shaft Lok marine shaft locking systems. Installation tips, maintenance guides, and technical support.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/faq' }
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
            name: 'FAQ',
            item: 'https://shaftlok.com/faq'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Shaft Lok and how does it work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok is a marine shaft locking system that prevents propeller free-wheeling when sailing. It uses a spring-loaded locking mechanism that engages the propeller shaft, preventing rotation and reducing drag, noise, and wear.'
            }
          },
          {
            '@type': 'Question',
            name: 'Will Shaft Lok fit my boat?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok systems are available in multiple sizes (Mod I, II, III) to accommodate various shaft diameters and boat sizes. Check our installation guide for specific measurements and compatibility requirements.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do I need a Marine Control Cable?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Marine Control Cable allows you to operate Shaft Lok from the cockpit. Alternatively, you can use the Simple Spring Locking System which requires engine room access. The cable system is more convenient for frequent use.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I install Shaft Lok?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Installation requires basic mechanical skills and tools. The system mounts between the transmission and propeller. Professional installation is recommended for optimal performance. See our installation guide for detailed instructions.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does Shaft Lok require maintenance?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok features maintenance-free ball bearings and marine-grade materials. Occasional inspection and cleaning are recommended, but no regular maintenance is required under normal operating conditions.'
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
.faq-shell { max-width: 880px; }

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.faq-item.open { border-color: rgba(56, 189, 248, 0.45); }

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 1.35rem 1.6rem;
  text-align: left;
}

.faq-q-text {
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--text-hi);
}

.faq-toggle {
  flex-shrink: 0;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.faq-item.open .faq-toggle {
  transform: rotate(45deg);
  background: var(--grad-accent);
  color: #04121F;
  border-color: transparent;
}

.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}

.faq-answer > p {
  overflow: hidden;
  margin: 0;
  padding: 0 1.6rem;
  color: var(--text-mid);
  line-height: 1.7;
  transition: padding 0.35s ease;
}

.faq-answer.open {
  grid-template-rows: 1fr;
}

.faq-answer.open > p {
  padding: 0 1.6rem 1.45rem;
}

.faq-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2.5rem;
  padding: 2rem 2.2rem;
}

.faq-cta h2 {
  font-size: 1.3rem;
  margin: 0 0 0.4rem;
}

.faq-cta p {
  color: var(--text-mid);
  margin: 0;
}
</style>
