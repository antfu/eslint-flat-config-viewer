<script setup lang="ts">
import type { RuleInfo } from '~/composables/types'

defineProps<{
  rule: RuleInfo
  ruleStates?: RuleConfigStates
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
</script>

<template>
  <tr :class="ruleStates?.length ? '' : 'op40'">
    <td>
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
    <td flex="~ gap-1 items-center" py1 pr4>
      <ColorizedRuleName :name="rule.name" :url="rule.docs?.url" />
      <div v-if="rule.fixable" i-carbon-ibm-toolchain op50 title="Fixable" />
    </td>
    <td>{{ rule.docs?.description }}</td>
  </tr>
</template>
