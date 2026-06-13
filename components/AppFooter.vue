<template>
  <footer class="footer">
    <div class="footer-glow" aria-hidden="true"></div>
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/assets/images/Logo_propeller_only.png" alt="Shaft Lok propeller logo">
            <span class="footer-wordmark">Shaft Lok</span>
          </div>
          <p>
            Advanced propeller control systems for marine vessels since 1979.
            Properly positions, locks and automatically unlocks the propeller —
            quickly and easily, without leaving the cockpit.
          </p>
          <div class="footer-badges">
            <span class="footer-badge"><i class="fas fa-anchor"></i> Since 1979</span>
            <span class="footer-badge"><i class="fas fa-certificate"></i> US Patented</span>
          </div>
        </div>

        <div class="footer-col">
          <h3>Products</h3>
          <ul>
            <li><NuxtLink to="/products/mod-i-easylok">Mod I EasyLok</NuxtLink></li>
            <li><NuxtLink to="/products/mod-ii-easylok">Mod II EasyLok</NuxtLink></li>
            <li><NuxtLink to="/products/mod-iii-easylok">Mod III EasyLok</NuxtLink></li>
            <li><NuxtLink to="/products/mod-iv">Mod IV – VI Custom</NuxtLink></li>
            <li><NuxtLink to="/products/marine-control-cable">Marine Control Cable</NuxtLink></li>
            <li><NuxtLink to="/products/simple-spring-locking-system">Spring Locking System</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Company</h3>
          <ul>
            <li><NuxtLink to="/products">All Products</NuxtLink></li>
            <li><NuxtLink to="/yacht-list">Yacht List</NuxtLink></li>
            <li><NuxtLink to="/installation">Installation</NuxtLink></li>
            <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
            <li><NuxtLink to="/testimonials">Testimonials</NuxtLink></li>
            <li><NuxtLink to="/about">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col footer-contact">
          <h3>Contact</h3>
          <p><i class="fas fa-map-marker-alt"></i> Milwaukee, Wisconsin 53211 USA</p>
          <p><i class="fas fa-envelope"></i> kenneth.nigel@shaftlok.com</p>
          <p><i class="fas fa-phone"></i> 1-262-786-6800</p>
          <p><i class="fas fa-gears"></i> Compatible with Borg Warner, Paragon, Hurth &amp; Volvo Penta transmissions</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} <span class="footer-wordmark-sm">Shaft Lok</span> Inc. All rights reserved.
          &nbsp;|&nbsp; Patents
          <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199" target="_blank" rel="noopener">#4389199</a>
          and
          <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583" target="_blank" rel="noopener">#D271583</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: linear-gradient(180deg, rgba(8, 18, 38, 0.4), rgba(4, 10, 24, 0.95));
  border-top: 1px solid var(--line);
  padding: 4rem 1.5rem 1.5rem;
  overflow: hidden;
}

.footer-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 640px;
  height: 240px;
  background: radial-gradient(closest-side, rgba(56, 189, 248, 0.16), transparent);
  pointer-events: none;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
  gap: 2.5rem;
  margin-bottom: 3rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.footer-logo img {
  height: 2.6rem;
  width: 2.6rem;
  object-fit: contain;
  background: #fff;
  border-radius: 10px;
  padding: 3px;
  filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.35));
}

.footer-wordmark {
  font-family: var(--font-brand);
  font-size: 1.7rem;
  color: var(--text-hi);
}

.footer-wordmark-sm {
  font-family: var(--font-brand);
  color: var(--text-mid);
}

.footer-brand p {
  color: var(--text-mid);
  font-size: 0.95rem;
  margin: 0 0 1.25rem;
  max-width: 36ch;
}

.footer-badges {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.footer-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--accent);
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
}

.footer-col h3 {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-hi);
  margin: 0 0 1.1rem;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col li { margin-bottom: 0.55rem; }

.footer-col a {
  color: var(--text-mid);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.footer-col a:hover { color: var(--accent); }

.footer-contact p {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  color: var(--text-mid);
  font-size: 0.95rem;
  margin: 0 0 0.7rem;
}

.footer-contact i {
  color: var(--accent);
  width: 1.1rem;
  text-align: center;
  margin-top: 0.25rem;
}

.footer-bottom {
  border-top: 1px solid var(--line);
  padding-top: 1.4rem;
  text-align: center;
}

.footer-bottom p {
  color: var(--text-low);
  font-size: 0.85rem;
  margin: 0;
}

.footer-bottom a {
  color: var(--text-mid);
  text-decoration: none;
}

.footer-bottom a:hover { color: var(--accent); }

@media (max-width: 980px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 580px) {
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
}
</style>
