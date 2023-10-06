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
  <div v-if="errorInfo" grid h-full w-full place-content-center whitespace-pre-line bg-gray-2>
    {{ errorInfo }}
  </div>
  <div v-else px14 py10>
    <NavBar />
    <NuxtPage />
  </div>
</template>
