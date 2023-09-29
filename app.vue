<script setup lang="ts">
import 'floating-vue/dist/style.css'
import '~/composables/payload'

useHead({
  title: 'ESLint Flat Config Viewer',
})
</script>

<template>
  <div p10>
    <NavBar />
    <NuxtPage />
  </div>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #111;
  color: white;
}
</style>
