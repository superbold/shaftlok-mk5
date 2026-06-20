export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // 301 redirects from old .html URLs to new routes
  const redirects: Record<string, string> = {
    '/about.html': '/about',
    '/contact.html': '/contact',
    '/faq-list.html': '/faq',
    '/installation.html': '/installation',
    '/testimonials.html': '/testimonials',
    '/yacht-list.html': '/yacht-list',
    '/products.html': '/products',
    '/mod-i-easylok.html': '/products/mod-i-easylok',
    '/mod-ii-easylok.html': '/products/mod-ii-easylok',
    '/mod-ii-easylok-high-torque.html': '/products/mod-ii-easylok-high-torque',
    '/mod-iii-easylok.html': '/products/mod-iii-easylok',
    '/mod-iii-easylok-high-torque.html': '/products/mod-iii-easylok-high-torque',
    '/mod-iv.html': '/products',
    '/mod-v.html': '/products',
    '/mod-vi.html': '/products/mod-vi',
    '/products/mod-iv': '/products',
    '/products/mod-v': '/products',
    '/simple-spring-locking-system.html': '/products/simple-spring-locking-system',
    '/marine-control-cable.html': '/products/marine-control-cable'
  }

  const redirect = redirects[url.pathname]
  if (redirect) {
    await sendRedirect(event, redirect, 301)
  }
})