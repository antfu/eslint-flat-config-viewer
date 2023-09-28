<script setup lang="ts">
import type { RuleInfo } from '~/composables/types'

const props = defineProps<{
  rule: RuleInfo
  ruleStates?: RuleConfigStates
  value?: any
  class?: string
}>()

const emit = defineEmits<{
  badgeClick: [MouseEvent]
  stateClick: [RuleLevel]
}>()

const { copy } = useClipboard()

function nth(n: number) {
  if (n === 1)
    return '1st'
  if (n === 2)
    return '2nd'
  if (n === 3)
    return '3rd'
  return `${n}th`
}

function capitalize(str?: string) {
  if (!str)
    return str
  return str[0].toUpperCase() + str.slice(1)
}
</script>

<template>
  <div v-if="ruleStates" flex="~ items-center gap-0.5 justify-end" text-lg>
    <template v-for="s, idx of ruleStates" :key="idx">
      <div
        v-if="s[1] === 'error'" i-carbon-warning-filled text-orange op80
        :title="`Enabled as 'error', in the ${nth(s[0] + 1)} config item`"
        @click="emit('stateClick', s[1])"
      />
      <div
        v-if="s[1] === 'warn'" i-carbon-warning-alt-filled text-amber op80
        :title="`Enabled as 'warning', in the ${nth(s[0] + 1)} config item`"
        @click="emit('stateClick', s[1])"
      />
      <div
        v-if="s[1] === 'off'" i-carbon-error-outline text-gray op50
        :title="`Turned off, in the ${nth(s[0] + 1)} config item`"
        @click="emit('stateClick', s[1])"
      />
    </template>
  </div>

  <div v-if="value != null" :class="props.class">
    <div
      v-if="getRuleLevel(value) === 'error'" i-carbon-warning-filled text-orange op80
      title="Enabled as 'error'"
    />
    <div
      v-if="getRuleLevel(value) === 'warn'" i-carbon-warning-alt-filled text-amber op80
      title="Enabled as 'warn'"
    />
    <div
      v-if="getRuleLevel(value) === 'off'" i-carbon-error-outline text-gray op50
      title="Turned off"
    />
  </div>

  <div :class="props.class">
    <div flex="~ items-center gap-2" py1 pr2 class="group">
      <ColorizedRuleName
        :name="rule.name" as="button"
        @click="e => emit('badgeClick', e)"
      />
      <NuxtLink
        :to="rule.docs?.url" target="_blank" rel="noopener noreferrer"
        i-carbon-launch
        class="op0 group-hover:op35 hover:op75!"
        title="Documentations"
      />
      <button
        i-carbon-copy
        class="op0 group-hover:op35 hover:op75!"
        title="Copy"
        @click="copy(rule.name)"
      />
    </div>
  </div>

  <div>
    <div v-if="rule.fixable" title="Fixable" i-carbon-ibm-toolchain mx2 op50 />
  </div>

  <div :class="props.class">
    <div op75>
      {{ capitalize(rule.docs?.description) }}
    </div>
  </div>
<!--
  <div v-if="value != null" w-100>
    <div flex="~ gap-2 wrap" max-w-full of-x-scroll>
      <div
        v-for="i, idx of getRuleOptions(value)"
        :key="idx" border="~ base" rounded
        bg-gray:5 px2 font-mono op50
      >
        {{ i }}
      </div>
    </div>
  </div> -->
</template>
