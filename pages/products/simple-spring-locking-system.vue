<template>
  <ProductDetail
    name="Simple Spring Locking System"
    slug="simple-spring-locking-system"
    tagline="Simple, reliable, manual locking system for Shaft Lok"
    description="Shaft Lok Simple Spring Locking System - cost-effective marine propeller control solution. Easy installation, reliable locking for smaller vessels. Inexpensive alternative."
    og-title="Shaft Lok Simple Spring Locking System - Cost-Effective Marine Propeller Control"
    image="/assets/images/SpringLockingSystem_withHandle.jpg"
    image-alt="Shaft Lok Simple Spring Locking System - cost-effective marine propeller control solution with manual operation and easy installation for smaller vessels"
    category="Control Accessory"
    :features="features"
    :specs="specs"
  >
    <p>This S.S.L.S is one of the two devices that lock all the Mod I thru Mod III Shaft Lok Units. It is mounted on top of the Shaft Lok Unit. Just push down on the black knob to lock.</p>
    <p>SSLS is inexpensive, easy to install and compact.</p>
    <p>To operate the SSLS one must enter the engine room, which may be difficult on some yachts. However, to LOCK the Shaft Lok unit, the propeller must be rotating slowly.</p>
    <p>Shaft Lok is an excellent LOCK but as a brake "not so much".</p>
    <p>The SSLS operator should be able to see the propeller shaft easily. Over time the operator will become aware of what shaft rotation speed is required to lock the unit. The sailor can inform the captain if more or less speed is necessary. The Shaft Lok unit automatically unlocks when the engine is started and put into gear. The locking pin, that holds the rotating disc, travels up into the housing allowing the disc to rotate should the captain want to use the motor to move the vessel. The short pin in the housing holds the locking pin in the unlocked position. When the unit is locked the short pin also holds in the locked position.</p>
  </ProductDetail>
</template>

<script setup>
const features = [
  { icon: 'fas fa-wrench', title: 'Replaces Cable', text: 'Replaces standard marine control cable' },
  { icon: 'fas fa-hand-point-down', title: 'Simple Operation', text: 'Simple and intuitive operation' },
  { icon: 'fas fa-compress-arrows-alt', title: 'Durable Spring', text: 'Durable spring mechanism' },
  { icon: 'fas fa-check-circle', title: 'Compatible', text: 'Compatible with all Shaft Lok systems' }
]

const specs = [
  { name: 'Compatibility', value: 'All Mod I through Mod III Shaft Lok units' },
  { name: 'Operation', value: 'Manual push-down knob, engine room access required' },
  { name: 'Mounting', value: 'Bolted on top of the Shaft Lok housing' },
  { name: 'Unlocking', value: 'Automatic when engine starts and transmission engages' }
]

definePageMeta({
  layout: 'default'
})
</script>
