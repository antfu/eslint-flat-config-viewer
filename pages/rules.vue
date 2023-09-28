<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Payload, RuleConfigStates } from '~/composables/types'
import { filtersRules as filters, filtersConfigs } from '~/composables/state'

const props = defineProps<{
  payload: Payload
}>()

const router = useRouter()
const rules = computed(() => Object.values(props.payload.rules).filter(i => !i.deprecated))
const pluginNames = computed(() => Array.from(new Set(rules.value.map(i => i.plugin))))

const ruleStateMap = computed(() => {
  const map = new Map<string, RuleConfigStates>()
  props.payload.configs.forEach((config, index) => {
    if (!config.rules)
      return
    Object.entries(config.rules).forEach(([name, raw]) => {
      const value = getRuleLevel(raw)
      if (!value)
        return
      if (!map.has(name))
        map.set(name, [])
      map.get(name)!.push([index, value])
    })
  })

  return map
})

const conditionalFiltered = computed(() => {
  const { plugin, state, fixable } = filters
  const conditional = rules.value.filter((rule) => {
    if (plugin && rule.plugin !== plugin)
      return false
    if (fixable !== null && !!rule.fixable !== fixable)
      return false
    if (state) {
      if (state === 'using' && !ruleStateMap.value.get(rule.name))
        return false
      if (state === 'unused' && ruleStateMap.value.get(rule.name))
        return false
    }
    return true
  })
  return conditional
})

const fuse = computed(() => new Fuse(conditionalFiltered.value, {
  keys: ['name', 'docs.description'],
  threshold: 0.5,
}))

const filtered = computed(() => {
  const { search } = filters
  if (!search)
    return conditionalFiltered.value
  return fuse.value.search(search).map(i => i.item)
})

function gotoConfigs(rule: string) {
  filtersConfigs.rule = rule
  router.push('/configs')
}
</script>

<template>
  <div>
    <div py4 flex="~ col gap-2">
      <input
        v-model="filters.search"
        placeholder="Search"
        border="~ base rounded"
        bg-transparent px2 py1 outline-none
      >
      <div>
        <OptionSelectGroup
          v-model="filters.plugin"
          :options="['', ...pluginNames]"
          :titles="['All Plugins', ...pluginNames]"
          :props="[{}, ...pluginNames.map(i => filters.plugin === i ? ({ style: { color: getPluginColor(i) } }) : {})]"
        />
      </div>
      <div>
        <OptionSelectGroup
          v-model="filters.state"
          :options="['', 'using', 'unused']"
          :titles="['All', 'Using', 'Unused']"
        />
      </div>
    </div>
    <div op50>
      {{ filtered.length }} rules available
    </div>
    <div my4 grid="~ cols-[max-content_max-content_max-content_1fr] gap-x-2 items-center">
      <RuleItem
        v-for="rule in filtered"
        :key="rule.name"
        :rule="rule"
        :rule-states="ruleStateMap.get(rule.name) || []"
        :class="(ruleStateMap.get(rule.name)?.length || filters.state === 'unused') ? '' : 'op40'"
        @state-click="gotoConfigs(rule.name)"
      />
    </div>
  </div>
</template>
