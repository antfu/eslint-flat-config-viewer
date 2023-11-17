<script setup lang="ts">
import { nth } from '~/composables/strings'

const props = defineProps<{
  level: RuleLevel
  configIndex?: number
  class?: string
}>()

const title = computed(() => {
  if (props.configIndex == null)
    return `Enabled as '${props.level}'`
  return `Enabled as '${props.level}', in the ${nth(props.configIndex + 1)} config item`
})
</script>

<template>
  <div
    v-if="level === 'error'" i-carbon-warning-filled text-red op80
    :title="title" :class="props.class"
  />
  <div
    v-if="level === 'warn'" i-carbon-warning-alt-filled text-yellow op80
    :title="title" :class="props.class"
  />
  <div
    v-if="level === 'off'" i-carbon-error-outline text-gray op50
    :title="title" :class="props.class"
  />
</template>
