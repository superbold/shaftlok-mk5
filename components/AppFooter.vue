<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About <span class="shaft-lok-footer">Shaft Lok</span></h3>
          <p>Advanced propeller control systems for marine vessels since 1979. Properly positions, locks and automatically unlocks the propeller quickly and easily without leaving the cockpit.</p>
        </div>
        
        <div class="footer-section">
          <h3>Products</h3>
          <ul class="footer-links">
            <li><NuxtLink to="/products/mod-i-easylok">Mod I EasyLok</NuxtLink></li>
            <li><NuxtLink to="/products/mod-ii-easylok">Mod II EasyLok</NuxtLink></li>
            <li><NuxtLink to="/products/mod-ii-easylok-high-torque">Mod II High Torque</NuxtLink></li>
            <li><NuxtLink to="/products/mod-iii-easylok">Mod III EasyLok</NuxtLink></li>
            <li><NuxtLink to="/products/mod-iii-easylok-high-torque">Mod III High Torque</NuxtLink></li>
            <li><NuxtLink to="/products/mod-iv">Mod IV</NuxtLink></li>
            <li><NuxtLink to="/products/mod-v">Mod V</NuxtLink></li>
            <li><NuxtLink to="/products/mod-vi">Mod VI</NuxtLink></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><NuxtLink to="/products">All Products</NuxtLink></li>
            <li><NuxtLink to="/yacht-list">Yacht List</NuxtLink></li>
            <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
            <li><NuxtLink to="/testimonials">Testimonials</NuxtLink></li>
            <li><NuxtLink to="/about">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          </ul>
        </div>
        
        <div class="footer-section footer-contact">
          <h3>Contact Information</h3>
          <p><i class="fas fa-map-marker-alt"></i> Shaft Lok Inc.</p>
          <p><i class="fas fa-envelope"></i> sean.nigel@shaftlok.com</p>
          <p><i class="fas fa-phone"></i> Contact via our website</p>
          <p><i class="fas fa-anchor"></i> Compatible with Borg Warner, Paragon, Hurth and Volvo Penta Transmissions</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 <span class="shaft-lok-footer">Shaft Lok</span>. All rights reserved. | Patents: <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199" style="color: var(--light-cyan);">#4389199</a> and <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583" style="color: var(--light-cyan);">#D271583</a> | Site created and built by <span class="shaft-lok-footer">Shaft Lok</span></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--federal-blue);
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: 0;
  position: relative;
}

.footer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--honolulu-blue);
  z-index: 3;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: var(--light-cyan);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section p,
.footer-section li {
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--light-cyan);
}

.footer-contact p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-contact i {
  width: 16px;
  color: var(--light-cyan);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.shaft-lok-footer {
  font-family: 'DeVinneOrnamentDRegular', serif;
  color: var(--light-cyan);
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 1rem 1rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>