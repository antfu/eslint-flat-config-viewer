<script setup lang="ts">
import 'floating-vue/dist/style.css'
import './styles/global.css'
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
