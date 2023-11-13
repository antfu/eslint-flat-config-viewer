<script setup lang="ts">
import { nth } from '~/composables/strings'

const props = defineProps<{
  level: RuleLevel
  configIndex?: number
}>()

const title = computed(() => {
  if (props.configIndex == null)
    return `Enabled as '${props.level}'`
  return `Enabled as '${props.level}', in the ${nth(props.configIndex + 1)} config item`
})
</script>

<template>
  <div
    v-if="level === 'error'" i-carbon-checkmark-filled text-green op80
    :title="title"
  />
  <div
    v-if="level === 'warn'" i-carbon-checkmark-filled text-amber op70
    :title="title"
  />
  <div
    v-if="level === 'off'" i-carbon-error-outline text-gray op50
    :title="title"
  />
</template>
