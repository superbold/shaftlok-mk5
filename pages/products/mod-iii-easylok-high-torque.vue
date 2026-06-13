<template>
  <ProductDetail
    name="Mod III EasyLok High Torque"
    slug="mod-iii-easylok-high-torque"
    tagline="Large Sailboats with no engine room space restrictions"
    description="Shaft Lok Mod III EasyLok High Torque - Ultimate high-torque marine propeller control system for large vessels. Maximum reliability and performance for demanding applications."
    og-title="Shaft Lok Mod III EasyLok High Torque - Ultimate Marine Propeller Control"
    image="/assets/images/shaftlok-mod-red.jpg"
    image-alt="Shaft Lok Mod III EasyLok High Torque marine propeller control system - ultimate high-torque design for large vessels with maximum reliability and performance for demanding applications"
    bore='3.15" (80mm)'
    :features="features"
    :specs="specs"
  >
    <p>The ultimate high-torque solution for large sailboats with demanding propeller control requirements.</p>
    <p>Features the highest torque capability in the Shaft Lok product line with enhanced locking system design.</p>
    <p>Perfect for large vessels with fixed propellers requiring maximum reliability and performance.</p>
    <p>Built with premium materials and engineering to handle the most challenging marine applications.</p>
  </ProductDetail>
</template>

<script setup>
const features = [
  { icon: 'fas fa-ruler', title: 'Max Bore Size', text: '3.15" (80mm)' },
  { icon: 'fas fa-cog', title: 'Highest Torque Capability', text: 'Maximum torque handling for demanding applications' },
  { icon: 'fas fa-lock', title: 'Enhanced Locking System', text: 'Superior locking mechanism design' },
  { icon: 'fas fa-anchor', title: 'Ideal For', text: 'Large fixed propellers' }
]

const specs = [
  { name: 'Max Bore Size', value: '3.15" (80mm)' },
  { name: 'Suitable For', value: 'Large sailboats with no engine room space restrictions' },
  { name: 'Ideal For', value: 'Large fixed propellers' },
  { name: 'Torque Capability', value: 'Highest in the Shaft Lok product line' }
]

definePageMeta({
  layout: 'default'
})
</script>
