<script setup lang="ts">
import { Fragment } from 'vue'

defineProps<{
  rules: RuleInfo[]
  getBind?: (ruleName: string) => Record<string, any>
}>()

const containerClass = computed(() => {
  if (ruleViewType.value === 'list')
    return 'grid grid-cols-[max-content_max-content_max-content_1fr] gap-x-2 gap-y-2 items-center'
  else
    return 'grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-2'
})

const Wrapper = defineComponent({
  setup(_, { slots }) {
    return () => ruleViewType.value === 'list'
      ? h(Fragment, slots.default?.())
      : h('div', { class: 'relative border border-base rounded-lg p4 py3 flex flex-col gap-2 of-hidden justify-start' }, slots.default?.())
  },
})
</script>

<template>
  <div :class="containerClass">
    <Wrapper
      v-for="rule in rules"
      :key="rule.name"
    >
      <RuleItem
        :rule="rule"
        :rule-states="payload.ruleStateMap.get(rule.name) || []"
        :grid-view="ruleViewType === 'grid'"
        v-bind="getBind?.(rule.name)"
      >
        <template #popup>
          <RuleStateItem
            v-for="state, idx of payload.ruleStateMap.get(rule.name) || []"
            :key="idx"
            border="t base"
            :state="state"
          />
        </template>
      </RuleItem>
    </Wrapper>
  </div>
</template>
