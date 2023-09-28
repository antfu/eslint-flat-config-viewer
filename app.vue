<script setup lang="ts">
useHead({
  title: 'ESLint Flat Config Viewer',
})

const payload = await $fetch('/api/get')
</script>

<template>
  <NuxtLayout>
    <NuxtPage :payload="payload" />
  </NuxtLayout>
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
