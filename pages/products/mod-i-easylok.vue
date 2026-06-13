<template>
  <ProductDetail
    name="Mod I EasyLok"
    slug="mod-i-easylok"
    tagline="Small sailboats with engine room space restrictions"
    description="Shaft Lok Mod I EasyLok - original marine propeller control system since 1979. Easy installation, reliable locking, proven performance for small sailboats."
    og-title="Shaft Lok Mod I EasyLok - Original Marine Propeller Control System"
    image="/assets/images/shaftlok-mod-black.jpg"
    image-alt="Shaft Lok Mod I EasyLok marine propeller control system - original compact design for small sailboats with engine room space restrictions since 1979"
    bore='1.77" (45mm)'
    :features="features"
    :specs="specs"
  >
    <p>Boats with engine room space restrictions.</p>
    <p>Maximum Bore: 45mm, 1.77"</p>
    <p>This a standard stocked unit. About half the size of the Mod II Easy Lok Unit.</p>
    <p>It is the smallest physical size but can handle yachts with a maximum propeller shaft diameter of (45mm) 1.771 inches. One of the most popular propeller sizes is 1 ¾" so our new Mod I can handle it.</p>
    <p>This was the first unit to hit the market in 1979.</p>
    <p>In late 2023 Shaft Lok Inc. upgraded the Mod I with a larger deep-groove ball bearing 6911ZZ by Nachi to include maintenance free double bearing shields. The Basic Dynamic Load Rating is 3,600 Pounds.</p>
    <p>The Mod I Housing, is made of hard marine urethane which is imperious to salt air. The unit's housing will last decades.</p>
    <p>The Mod I Easy Lok unit has a 316 Stainless Steel rotating 4.08" (103.6mm) diameter disc with a 45 degree locking ramp. The hub of the unit, in which the propeller shaft is contained is also made of the best material to fight salt air 316 Stainless Steel.</p>
    <p>The length of the unit is 7.08" (180mm). The width at the Spring Adjustment Screw is 3.346" (85mm). The required propeller shaft space is equal to length through the bore 1.57" (40.0mm).</p>
  </ProductDetail>
</template>

<script setup>
const features = [
  { icon: 'fas fa-ruler', title: 'Max Bore Size', text: '1.77" (45mm)' },
  { icon: 'fas fa-compress-alt', title: 'Compact Design', text: 'Compact design for tight spaces' },
  { icon: 'fas fa-shield-alt', title: 'Maintenance-Free', text: '<span class="shaftlok-font">Shaft Lok</span> uses double bearing shields' },
  { icon: 'fas fa-medal', title: 'Premium Construction', text: '316 Stainless Steel construction' }
]

const specs = [
  { name: 'Max Bore Size', value: '1.77" (45mm)' },
  { name: 'Length', value: '7.08" (180mm)' },
  { name: 'Width', value: '3.346" (85mm)' },
  { name: 'Suitable For', value: 'Small sailboats with engine room space restrictions' },
  { name: 'Material', value: '316 Stainless Steel construction' },
  { name: 'Bearing Type', value: 'Deep-groove ball bearing 6911ZZ by Nachi' },
  { name: 'Dynamic Load Rating', value: '3,600 Pounds' }
]

definePageMeta({
  layout: 'default'
})
</script>
