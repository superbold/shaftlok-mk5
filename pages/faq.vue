<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'FAQ' }]" />
    
    <div class="faq-container">
      <h1 class="page-title">Frequently Asked Questions</h1>
      <p class="page-description">Common questions about Shaft Lok marine shaft locking systems</p>
      
      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <div class="faq-question" @click="toggleFaq(index)">
            <h3>{{ faq.question }}</h3>
            <i class="fas fa-chevron-down" :class="{ 'rotated': faq.isOpen }"></i>
          </div>
          <div class="faq-answer" :class="{ 'open': faq.isOpen }">
            <p v-html="faq.answer"></p>
          </div>
        </div>
      </div>
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
            name: 'FAQ',
            item: 'https://shaftlok.com/faq'
          }
        ]
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
.faq-container {
  margin-top: 4rem;
  min-height: 100vh;
  padding: 2rem;
  max-width: 1000px;
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

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: white;
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.faq-item:nth-child(1) { animation-delay: 0.1s; }
.faq-item:nth-child(2) { animation-delay: 0.2s; }
.faq-item:nth-child(3) { animation-delay: 0.3s; }
.faq-item:nth-child(4) { animation-delay: 0.4s; }
.faq-item:nth-child(5) { animation-delay: 0.5s; }
.faq-item:nth-child(6) { animation-delay: 0.6s; }
.faq-item:nth-child(7) { animation-delay: 0.7s; }
.faq-item:nth-child(8) { animation-delay: 0.8s; }

.faq-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--federal-blue);
  color: white;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background: var(--honolulu-blue);
}

.faq-question h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.faq-question i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.faq-question i.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  background: rgba(202, 240, 248, 0.1);
}

.faq-answer.open {
  max-height: 200px;
  padding: 1.5rem;
}

.faq-answer p {
  margin: 0;
  color: #333;
  line-height: 1.6;
  font-size: 1.1rem;
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
  .faq-container {
    padding: 2rem 1rem;
  }
  
  .faq-question {
    padding: 1rem;
  }
  
  .faq-question h3 {
    font-size: 1.1rem;
  }
  
  .faq-answer.open {
    padding: 1rem;
  }
}
</style>