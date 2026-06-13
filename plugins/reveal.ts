// v-reveal: adds .reveal and toggles .is-visible when the element scrolls
// into view. Optional value sets a stagger delay in ms: v-reveal="150"
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  if (import.meta.client) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding: { value?: number }) {
      el.classList.add('reveal')
      if (binding.value) {
        el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      }
      observer?.observe(el)
    },
    getSSRProps() {
      return {}
    }
  })
})
