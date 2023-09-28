<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Payload, RuleConfigStates } from '~/composables/types'

const props = defineProps<{
  payload: Payload
}>()

const rules = computed(() => Object.values(props.payload.rules).filter(i => !i.deprecated))
const pluginNames = computed(() => Array.from(new Set(rules.value.map(i => i.plugin))))

const ruleStateMap = computed(() => {
  const map = new Map<string, RuleConfigStates>()
  props.payload.configs.forEach((config, index) => {
    if (!config.rules)
      return
    Object.entries(config.rules).forEach(([name, raw]) => {
      let value = Array.isArray(raw) ? raw[0] : raw
      if (value === 0)
        value = 'off'
      if (value === 1)
        value = 'warn'
      if (value === 2)
        value = 'error'
      if (!value)
        return

      if (!map.has(name))
        map.set(name, [])
      map.get(name)!.push([index, value])
    })
  })

  return map
})

const filters = reactive({
  plugin: '',
  search: '',
  state: '' as 'enabled' | 'not-enabled' | '',
  fixable: null as boolean | null,
})

const conditionalFiltered = computed(() => {
  const { plugin, state, fixable } = filters
  const conditional = rules.value.filter((rule) => {
    if (plugin && !rule.name.startsWith(plugin))
      return false
    if (fixable !== null && !!rule.fixable !== fixable)
      return false
    if (state) {
      if (state === 'enabled' && !ruleStateMap.value.get(rule.name))
        return false
      if (state === 'not-enabled' && ruleStateMap.value.get(rule.name))
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
</script>

<template>
  <div p10>
    <div text-2xl font-200>
      ESLint Flat Config Viewer
    </div>
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
          :options="['', 'enabled', 'not-enabled']"
          :titles="['All', 'Enabled', 'Not Enabled']"
        />
      </div>
    </div>
    <div op50>
      {{ filtered.length }} rules available
    </div>
    <table my4>
      <tbody>
        <RuleItem
          v-for="rule in filtered"
          :key="rule.name"
          :rule="rule"
          :rule-states="ruleStateMap.get(rule.name)"
        />
      </tbody>
    </table>
  </div>
</template>
