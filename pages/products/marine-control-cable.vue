<template>
  <ProductDetail
    name="Marine Control Cable"
    slug="marine-control-cable"
    tagline="Standard control cable for propeller locking systems"
    description="Shaft Lok Marine Control Cable - durable marine-grade control cables for convenient cockpit operation. Compatible with all Shaft Lok propeller locking systems."
    og-title="Marine Control Cable - ShaftLok System Controls"
    image="/assets/images/marine-control-cable.png"
    image-alt="Shaft Lok Marine Control Cable - durable marine-grade control cables for convenient cockpit operation of propeller locking systems without engine room access"
    category="Control Accessory"
    :features="features"
    :specs="specs"
  >
    <p>Essential control cables for ShaftLok systems, allowing convenient operation from the cockpit.</p>
    <p>Engineered specifically for marine applications with corrosion-resistant materials and robust construction.</p>
    <p>Provides reliable control of your ShaftLok system without the need to access the engine room.</p>
    <p>Standard marine-grade cable that works seamlessly with all ShaftLok models for optimal performance.</p>
  </ProductDetail>
</template>

<script setup>
const features = [
  { icon: 'fas fa-check', title: 'Compatibility', text: 'Compatible with all ShaftLok systems' },
  { icon: 'fas fa-hammer', title: 'Durable Construction', text: 'Built to withstand marine environments' },
  { icon: 'fas fa-screwdriver', title: 'Easy Installation', text: 'Straightforward setup and configuration' },
  { icon: 'fas fa-cog', title: 'Maintenance-Free', text: 'Reliable, long-lasting operation' }
]

const specs = [
  { name: 'Compatibility', value: 'All Shaft Lok systems' },
  { name: 'Operation', value: 'Cockpit operation without engine room access' },
  { name: 'Construction', value: 'Corrosion-resistant marine-grade materials' }
]

definePageMeta({
  layout: 'default'
})
</script>
