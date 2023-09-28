<script setup lang="ts">
const props = defineProps<{
  name: string
  url?: string
  as?: string
}>()

const parsed = computed(() => {
  const parts = props.name.split('/')
  if (parts.length === 1) {
    return {
      scope: undefined,
      name: parts[0],
    }
  }
  if (props.name[0] === '@') {
    return {
      scope: parts.slice(0, 2).join('/'),
      name: parts.slice(2).join('/'),
    }
  }
  else {
    return {
      scope: parts[0],
      name: parts.slice(1).join('/'),
    }
  }
})
</script>

<template>
  <component
    :is="as || 'div'"
    ws-nowrap rounded bg-gray:5 px2 font-mono
    border="~ base"
  >
    <span v-if="parsed.scope" :style="{ color: getPluginColor(parsed.scope) }">{{ parsed.scope }}</span>
    <span v-if="parsed.scope" op30>/</span>
    <span op75>{{ parsed.name }}</span>
  </component>
</template>
