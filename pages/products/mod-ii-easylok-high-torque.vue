<template>
  <ProductDetail
    name="Mod II EasyLok High Torque"
    slug="mod-ii-easylok-high-torque"
    tagline="Sailboats: 45 to 130 feet with fewer engine room space restrictions"
    description="ShaftLok Mod II EasyLok High Torque - Heavy-duty marine propeller control system designed for high-torque applications. Maximum propeller control for commercial vessels."
    og-title="Shaft Lok Mod II EasyLok High Torque - Heavy-Duty Marine Propeller Control"
    image="/assets/images/shaftlok-mod-purple.jpg"
    image-alt="Shaft Lok Mod II EasyLok High Torque marine propeller control system - heavy-duty design for high-torque applications and commercial vessels with enhanced locking mechanism"
    bore='2.25" (57mm)'
    :features="features"
    :specs="specs"
  >
    <p>Enhanced version for demanding applications requiring superior torque handling capabilities.</p>
    <p>Perfect for larger sailing vessels with fixed blade propellers that need reliable shaft locking performance.</p>
    <p>Built with enhanced materials and engineering to handle the increased stresses of larger vessel applications.</p>
  </ProductDetail>
</template>

<script setup>
const features = [
  { icon: 'fas fa-ruler', title: 'Max Bore Size', text: '2.25" (57mm)' },
  { icon: 'fas fa-cog', title: 'High Torque Capability', text: 'Enhanced locking mechanism for demanding applications' },
  { icon: 'fas fa-anchor', title: 'Ideal For', text: 'Fixed bladed propellers' },
  { icon: 'fas fa-lock', title: 'Enhanced System', text: 'Superior locking mechanism design' }
]

const specs = [
  { name: 'Max Bore Size', value: '2.25" (57mm)' },
  { name: 'Suitable For', value: 'Sailboats 45 to 130 feet with fewer engine room space restrictions' },
  { name: 'Ideal For', value: 'Fixed bladed propellers' },
  { name: 'Locking System', value: 'Enhanced high-torque locking mechanism' }
]

definePageMeta({
  layout: 'default'
})
</script>
