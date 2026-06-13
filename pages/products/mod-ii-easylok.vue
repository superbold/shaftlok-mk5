<template>
  <ProductDetail
    name="Mod II EasyLok"
    slug="mod-ii-easylok"
    tagline="Sailboats: 20 to 100 feet with some engine room space restrictions"
    description="Shaft Lok Mod II EasyLok - enhanced marine propeller control system with improved locking features. Perfect for medium-duty sailboats 20-100 feet. 70% market share."
    og-title="Shaft Lok Mod II EasyLok - Enhanced Marine Propeller Control System"
    image="/assets/images/shaftlok-mod-orange.jpg"
    image-alt="Shaft Lok Mod II EasyLok marine propeller control system - enhanced design for medium-duty sailboats 20-100 feet with 70% market share and improved locking features"
    bore='2.25" (57.15mm)'
    :features="features"
    :specs="specs"
  >
    <p>Boats with some engine room space restrictions.</p>
    <p>The maximum Mod II Easy Lok bore size is 2.25" or 57.15mm.</p>
    <p>The width of the unit is 2.00" or 50.8mm.</p>
    <p>The Mod II Easy Lok unit is Shaft Lok's most popular unit. Out of approximately 1400 units shipped since 1979 about 70% are Mod II units. This means the components are usually in stock.</p>
    <p>A question frequently asked: "How is the unit secured to the propeller shaft?" There are four 3/8" 9.525mm diameter x 24 thread stainless steel cup pointed set screws in the stainless steel hub that are fastened to the shaft. The shaft needs to be dimpled for which a drill bit is provided. This Mod II unit is about twice the size of the Mod I Easy Lok unit and about half the size of the Mod III Easy Lok unit. Feathering propellers produce more speed when sailing and result in more drive train life.</p>
  </ProductDetail>
</template>

<script setup>
const features = [
  { icon: 'fas fa-ruler', title: 'Max Bore Size', text: '2.25" (57.15mm)' },
  { icon: 'fas fa-trophy', title: 'Most Popular Unit', text: '70% of all units sold since 1979 are Mod II units' },
  { icon: 'fas fa-screwdriver', title: 'Installation', text: '<span class="shaftlok-font">Shaft Lok</span> is quick and easy to install' },
  { icon: 'fas fa-medal', title: 'Premium Construction', text: '<span class="shaftlok-font">Shaft Lok</span> uses stainless steel fasteners' }
]

const specs = [
  { name: 'Max Bore Size', value: '2.25" (57.15mm)' },
  { name: 'Width', value: '2.00" (50.8mm)' },
  { name: 'Suitable For', value: 'Sailboats 20 to 100 feet with some engine room space restrictions' },
  { name: 'Market Share', value: '70% of all units sold since 1979' },
  { name: 'Fasteners', value: 'Four 3/8" x 24 thread stainless steel cup pointed set screws' }
]

definePageMeta({
  layout: 'default'
})
</script>
