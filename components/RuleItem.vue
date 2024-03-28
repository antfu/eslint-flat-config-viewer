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

function capitalize(str?: string) {
  if (!str)
    return str
  return str[0].toUpperCase() + str.slice(1)
}
</script>

<template>
  <div v-if="ruleStates" flex="~ items-center gap-0.5 justify-end" text-lg>
    <template v-for="s, idx of ruleStates" :key="idx">
      <VDropdown>
        <RuleLevelIcon
          :level="s.level"
          :config-index="s.configIndex"
        />
        <template #popper="{ shown }">
          <RuleStateItem v-if="shown" :state="s" />
        </template>
      </VDropdown>
    </template>
  </div>

  <div v-if="value != null" :class="props.class">
    <RuleLevelIcon
      :level="getRuleLevel(value)!"
      :class="getRuleLevel(value) === 'error' ? 'opacity-0!' : ''"
    />
  </div>

  <div :class="props.class">
    <VDropdown inline-block>
      <ColorizedRuleName
        m1
        :name="rule.name"
        :prefix="rule.plugin"
        :deprecated="rule.deprecated"
        as="button"
        @click="e => emit('badgeClick', e)"
      />
      <template #popper="{ shown }">
        <div v-if="shown" max-h="50vh">
          <div flex="~ items-center gap-2" p3>
            <NuxtLink
              action-button
              :to="rule.docs?.url" target="_blank" rel="noopener noreferrer"
              title="Documentations"
            >
              <div i-carbon-launch />
              Documentations
            </NuxtLink>
            <button
              action-button
              title="Copy"
              @click="copy(rule.name)"
            >
              <div i-carbon-copy />
              Copy name
            </button>
            <slot name="popup-actions" />
          </div>
          <slot name="popup" />
        </div>
      </template>
    </VDropdown>
  </div>

  <div>
    <div v-if="rule.fixable" title="Fixable" i-carbon-ibm-toolchain mx2 op50 />
  </div>

  <div :class="props.class" flex="~ gap-2 items-center">
    <div of-hidden text-ellipsis op75 :class="rule.deprecated ? 'line-through' : ''">
      {{ capitalize(rule.docs?.description) }}
    </div>
    <div v-if="rule.deprecated" border="~ red rounded" px1 text-xs text-red>
      DEPRECATED
    </div>
  </div>
</template>
