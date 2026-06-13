<template>
  <div>
    <MainNav />
    <slot />
    <AppFooter />
  </div>
</template>


<style>
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom, var(--light-cyan), white);
  min-height: 100vh;
}
</style>