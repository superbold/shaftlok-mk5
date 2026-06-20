<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Privacy Policy' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-shield-alt"></i> Legal</span>
      <h1>Privacy <span class="shaftlok-font grad-text">Policy</span></h1>
      <p>Last updated: June 2026</p>
    </div>

    <div class="privacy-wrap">
      <div class="privacy-body glass-card prose" v-reveal>

        <h2>Who we are</h2>
        <p>Shaft Lok Inc. is a marine hardware company based in Milwaukee, Wisconsin, USA. We manufacture and sell propeller locking systems for sailboats and yachts. Our website is <a href="https://shaftlok.com">shaftlok.com</a>.</p>
        <p>Questions about this policy can be directed to <a href="mailto:sean.nigel@shaftlok.com">sean.nigel@shaftlok.com</a>.</p>

        <h2>What data we collect and why</h2>

        <h3>Quote request form</h3>
        <p>When you submit a quote request we collect your name, email address, and the vessel details you provide (yacht type, propeller specs, engine information, etc.). This information is used solely to prepare and send you a product quote. We do not add you to any mailing list.</p>

        <h3>Analytics</h3>
        <p>We use Google Analytics 4 to understand how visitors use our site (pages visited, general location, device type). IP addresses are anonymized. This data is aggregated and not linked to any individual. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's Privacy Policy</a> for details on how Google handles this data.</p>

        <h2>How we use your data</h2>
        <ul>
          <li>To respond to your quote request by email</li>
          <li>To improve our website based on aggregated analytics</li>
        </ul>
        <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

        <h2>Third-party processors</h2>
        <p>Your quote request is transmitted via <strong>Resend</strong> (resend.com), an email delivery service. Only the information you submit in the form is passed to Resend for the purpose of delivery. Resend is compliant with applicable data protection regulations.</p>

        <h2>Data retention</h2>
        <p>Quote request emails are retained in our email inbox for as long as needed to fulfill your request and for reasonable follow-up. We do not store your form data in any database beyond the email record itself.</p>

        <h2>Your rights</h2>
        <p>If you are located in the European Union or United Kingdom, you have the right to access, correct, or request deletion of any personal data we hold about you. To exercise these rights, email us at <a href="mailto:sean.nigel@shaftlok.com">sean.nigel@shaftlok.com</a> and we will respond within 30 days.</p>

        <h2>Cookies</h2>
        <p>Our site uses analytics cookies set by Google Analytics 4 (<code>_ga</code>, <code>_ga_XDWZW2TCLR</code>). These cookies help us understand site usage in aggregate. You can disable cookies in your browser settings at any time without affecting your ability to use the site.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of the site after a change constitutes acceptance of the updated policy.</p>

      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Privacy Policy',
  meta: [
    { name: 'description', content: 'Shaft Lok Inc. privacy policy — how we collect, use, and protect your personal information.' },
    { name: 'robots', content: 'noindex, follow' }
  ],
  link: [{ rel: 'canonical', href: 'https://shaftlok.com/privacy' }]
})

definePageMeta({ layout: 'default' })
</script>

<style scoped>
.privacy-wrap {
  max-width: 720px;
  margin: 0 auto;
}

.privacy-body {
  padding: 2.4rem 2.8rem;
}

.privacy-body h2 {
  font-size: 1.15rem;
  color: var(--accent);
  margin: 2rem 0 0.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--line);
}

.privacy-body h2:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.privacy-body h3 {
  font-size: 0.98rem;
  color: var(--text-hi);
  margin: 1.2rem 0 0.4rem;
}

.privacy-body p,
.privacy-body li {
  color: var(--text-mid);
  line-height: 1.75;
  font-size: 0.97rem;
}

.privacy-body ul {
  padding-left: 1.4rem;
  margin: 0.5rem 0 1rem;
}

.privacy-body li { margin-bottom: 0.3rem; }

.privacy-body a {
  color: var(--accent);
  text-decoration: none;
}

.privacy-body a:hover { color: var(--accent-2); }

.privacy-body code {
  font-size: 0.85rem;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 4px;
  padding: 0.1em 0.4em;
  color: var(--accent);
}

@media (max-width: 600px) {
  .privacy-body { padding: 1.6rem 1.4rem; }
}
</style>
