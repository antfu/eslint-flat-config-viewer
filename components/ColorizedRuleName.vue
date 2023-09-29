<script setup lang="ts">
const props = defineProps<{
  name: string
  prefix?: string
  url?: string
  as?: string
}>()

const parsed = computed(() => {
  if (props.prefix) {
    if (props.name.startsWith(props.prefix)) {
      return {
        scope: props.prefix,
        name: props.name.slice(props.prefix.length).replace(/^\/+/, ''),
      }
    }
    else {
      return {
        scope: undefined,
        name: props.name,
      }
    }
  }
  const parts = props.name.split('/')
  if (parts.length === 1) {
    return {
      scope: undefined,
      name: parts[0],
    }
  }
  return {
    scope: parts[0],
    name: parts.slice(1).join('/'),
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
