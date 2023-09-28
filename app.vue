<script setup lang="ts">
import 'floating-vue/dist/style.css'

useHead({
  title: 'ESLint Flat Config Viewer',
})

const { data: payload, refresh } = await useFetch<Payload>('/api/get')

const ws = new WebSocket(`ws://${location.hostname}:${payload.value!.meta.wsPort}`)
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 'config-change')
    refresh()
})
</script>

<template>
  <div p10>
    <NavBar :payload="payload" />
    <NuxtPage :payload="payload" />
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
