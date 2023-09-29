<script setup lang="ts">
import 'floating-vue/dist/style.css'
import './styles/global.css'
import { ensureDataFetch } from '~/composables/payload'

useHead({
  title: 'ESLint Flat Config Viewer',
})

await ensureDataFetch()
</script>

<template>
  <div p10>
    <NavBar />
    <NuxtPage />
  </div>
</template>
