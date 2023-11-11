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
  <div pos-relative rounded bg-gray:5 p-3 pr-2 pt-2>
    <div flex="~" w-full items-center>
      <div :class="props.class" min-w-0>
        <VDropdown max-w-fit>
          <ColorizedRuleName
            :name="rule.name"
            :prefix="rule.plugin"
            as="button"
            mb-.5 max-w-full
            @click="e => emit('badgeClick', e)"
          />
          <template #popper>
            <div max-h="50vh">
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

      <div flex="~" items-center gap-1>
        <div v-if="ruleStates" flex="~ items-center gap-1 justify-end" text-lg>
          <template v-for="s, idx of ruleStates" :key="idx">
            <VDropdown>
              <RuleLevelIcon
                :level="s.level"
                :config-index="s.configIndex"
              />
              <template #popper>
                <RuleStateItem :state="s" />
              </template>
            </VDropdown>
          </template>
        </div>

        <div v-if="rule.fixable || value != null" flex="~" gap-1 :class="props.class">
          <div v-if="rule.fixable" title="Fixable" i-carbon-ibm-toolchain op40 />
          <div v-if="value != null">
            <div
              v-if="getRuleLevel(value) === 'error'" i-carbon-checkmark-filled text-green op80
              title="Enabled as 'error'"
            />
            <div
              v-if="getRuleLevel(value) === 'warn'" i-carbon-checkmark-filled text-yellow op50
              title="Enabled as 'warn'"
            />
            <div
              v-if="getRuleLevel(value) === 'off'" i-carbon-error-outline text-gray op50
              title="Turned off"
            />
          </div>
        </div>
      </div>
    </div>

    <div :class="props.class">
      <div ms-2 of-hidden truncate text-ellipsis text-sm op40>
        {{ capitalize(rule.docs?.description) || 'No description found' }}
      </div>
    </div>
  </div>
</template>
