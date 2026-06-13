<template>
  <ProductDetail
    name="Mod III EasyLok"
    slug="mod-iii-easylok"
    tagline="Large Sailboats with no engine room space restrictions"
    description="Shaft Lok Mod III EasyLok - advanced propeller control for large vessels. Maximum torque handling with rotating disc assembly for superior marine performance."
    og-title="Shaft Lok Mod III EasyLok - Advanced Marine Propeller Control"
    image="/assets/images/shaftlok-mod-black.jpg"
    image-alt="Shaft Lok Mod III EasyLok marine propeller control system - advanced design for large vessels with maximum torque handling and large rotating disc assembly for superior performance"
    bore='3.15" (80mm)'
    :features="features"
    :specs="specs"
  >
    <p>Advanced propeller control for larger vessels with ample engine room space.</p>
    <p>The Mod III EasyLok is designed for large sailboats that require maximum torque handling and reliability.</p>
    <p>Features a larger rotating disc assembly and enhanced construction for demanding marine environments.</p>
    <p>Perfect for vessels with fixed 3-5 blade propellers requiring superior locking performance.</p>
  </ProductDetail>
</template>

<script setup>
const features = [
  { icon: 'fas fa-ruler', title: 'Max Bore Size', text: '3.15" (80mm)' },
  { icon: 'fas fa-cog', title: 'High Torque Capability', text: 'Built for demanding large vessel applications' },
  { icon: 'fas fa-anchor', title: 'Ideal For', text: 'Fixed 3-5 blade propellers' },
  { icon: 'fas fa-circle-nodes', title: 'Large Rotating Disc', text: 'Enhanced disc assembly for superior performance' }
]

const specs = [
  { name: 'Max Bore Size', value: '3.15" (80mm)' },
  { name: 'Suitable For', value: 'Large sailboats with no engine room space restrictions' },
  { name: 'Ideal For', value: 'Fixed 3-5 blade propellers' },
  { name: 'Disc Assembly', value: 'Large rotating disc for maximum torque handling' }
]

definePageMeta({
  layout: 'default'
})
</script>
