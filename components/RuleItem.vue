<script setup lang="ts">
import type { RuleInfo } from '~/composables/types'

defineProps<{
  rule: RuleInfo
  ruleStates?: RuleConfigStates
  value?: any
}>()

function nth(n: number) {
  if (n === 1)
    return '1st'
  if (n === 2)
    return '2nd'
  if (n === 3)
    return '3rd'
  return `${n}th`
}

const classes = {
  error: 'border-green:20 bg-green:5 text-green',
  warn: 'border-lime:20 bg-lime:5 text-lime',
  off: 'border-gray:20 bg-gray:5 text-gray',
}
</script>

<template>
  <tr>
    <td v-if="ruleStates">
      <div flex="~ items-center" min-w-25 pr2 text-lg>
        <template v-for="s, idx of ruleStates" :key="idx">
          <div
            v-if="s[1] === 'error'" i-carbon-checkbox-checked text-green op80
            :title="`Enabled as 'error', in the ${nth(s[0] + 1)} config item`"
          />
          <div
            v-if="s[1] === 'warn'" i-carbon-checkbox-checked text-lime op80
            :title="`Enabled as 'warning', in the ${nth(s[0] + 1)} config item`"
          />
          <div
            v-if="s[1] === 'off'" i-carbon-checkbox-indeterminate text-gray op50
            :title="`Turned off, in the ${nth(s[0] + 1)} config item`"
          />
        </template>
      </div>
    </td>

    <td v-if="value != null" mr6 w-18 text-center>
      <div border="~ rounded" mr-2 px2 text-sm font-mono op75 :class="classes[getRuleLevel(value)!]">
        {{ getRuleLevel(value) }}
      </div>
    </td>

    <td flex="~ gap-1 items-center" w-min py1 pr4>
      <ColorizedRuleName :name="rule.name" :url="rule.docs?.url" />
      <div v-if="rule.fixable" i-carbon-ibm-toolchain op50 title="Fixable" />
    </td>

    <td v-if="value != null">
      <div flex="~ gap-2" max-w-full of-x-scroll>
        <div
          v-for="i, idx of getRuleOptions(value)"
          :key="idx" border="~ base" ws-nowrap rounded
          bg-gray:5 px2 font-mono op50
        >
          {{ i }}
        </div>
      </div>
    </td>
    <td>{{ rule.docs?.description }}</td>
  </tr>
</template>
