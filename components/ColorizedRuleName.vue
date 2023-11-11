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
    ws-nowrap rounded px2 font-semibold font-mono op-80
  >
    <div class="group" pos-relative truncate text-lg>
      <span v-if="parsed.scope" :style="{ color: getPluginColor(parsed.scope) }">{{ parsed.scope }}</span>
      <span v-if="parsed.scope" op50>/</span>
      <span op-90 transition group-hover:op-100>{{ parsed.name }}</span>
      <div
        group-hover="op-50" pos-absolute bottom-1
        z--1 h-1 w-full bg-gray-600 op-30 transition-all
        :style="{ backgroundColor: parsed.scope && getPluginColor(parsed.scope) }"
      />
    </div>
  </component>
</template>
