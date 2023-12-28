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
  <div v-if="errorInfo" grid h-full w-full place-content-center whitespace-pre-line>
    <div text-xl text-red5 font-bold>
      Failed to load <code rounded bg-red:5 px2 py1>./eslint.config.js</code><br>
    </div>

    <div text-lg text-red font-mono>
      {{ errorInfo.error }}
    </div>

    <div mt-5 op50>
      Note that
      <a href="https://github.com/antfu/eslint-flat-config-viewer" target="_blank" hover:underline>config viewer</a>
      only works with the <a href="https://eslint.org/docs/latest/use/configure/configuration-files-new" target="_blank" font-bold hover:underline>new flat config format</a>.
    </div>
  </div>
  <div v-else px14 py10>
    <NavBar />
    <NuxtPage />
  </div>
</template>
