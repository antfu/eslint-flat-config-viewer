<script setup lang="ts">
import Fuse from 'fuse.js'
import { filtersRules as filters } from '~/composables/state'
import { payload } from '~/composables/payload'

const rules = computed(() => Object.values(payload.value.rules))
const pluginNames = computed(() => Array.from(new Set(rules.value.map(i => i.plugin))))

const conditionalFiltered = computed(() => {
  let conditional = rules.value

  if (filters.plugin) {
    conditional = conditional
      .filter(rule => rule.plugin === filters.plugin)
  }

  if (filters.fixable != null) {
    conditional = conditional
      .filter(rule => !!rule.fixable === filters.fixable)
  }

  switch (filters.state) {
    case 'using':
      conditional = conditional.filter(rule => payload.value.ruleStateMap.get(rule.name))
      break
    case 'unused':
      conditional = conditional.filter(rule => !payload.value.ruleStateMap.get(rule.name))
      break
    case 'overloads':
      conditional = conditional.filter(rule => (payload.value.ruleStateMap.get(rule.name)?.length || 0) > 1)
      break
  }

  switch (filters.status) {
    case 'active':
      conditional = conditional.filter(rule => !rule.deprecated)
      break
    case 'deprecated':
      conditional = conditional.filter(rule => rule.deprecated)
      break
  }

  return conditional
})

const fuse = computed(() => new Fuse(conditionalFiltered.value, {
  keys: ['name', 'docs.description'],
  threshold: 0.5,
}))

const filtered = ref(conditionalFiltered.value)

debouncedWatch(
  () => [filters.search, conditionalFiltered.value],
  () => {
    if (!filters.search)
      return filtered.value = conditionalFiltered.value
    filtered.value = fuse.value.search(filters.search).map(i => i.item)
  },
  { debounce: 200 },
)

function resetFilters() {
  filters.search = ''
  filters.plugin = ''
  filters.state = 'using'
  filters.status = 'active'
}
</script>

<template>
  <div>
    <div py4 flex="~ col gap-2">
      <input
        v-model="filters.search"
        placeholder="Search rules..."
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
      <div flex="~ gap-2">
        <OptionSelectGroup
          v-model="filters.state"
          :options="['', 'using', 'overloads', 'unused']"
          :titles="['All', 'Using', 'Has Overloads', 'Unused']"
        />
        <OptionSelectGroup
          v-model="filters.status"
          :options="['', 'active', 'deprecated']"
          :titles="['All', 'Active', 'Deprecated']"
        />
      </div>
    </div>

    <div flex="~ gap-2 items-center">
      <span op50>{{ filtered.length }} rules available</span>
      <button
        v-if="filters.search || filters.plugin || filters.state !== 'using' || filters.status !== 'active'"
        active-class="op100! bg-active"
        border="~ base rounded"
        flex="~ gap-2 items-center" px3 py1 text-sm op50
        @click="resetFilters()"
      >
        <div i-carbon-filter-remove flex-none />
        Clear Filters
      </button>
    </div>
    <div my4 grid="~ cols-[max-content_max-content_max-content_1fr] gap-x-2 items-center">
      <RuleItem
        v-for="rule in filtered"
        :key="rule.name"
        :rule="rule"
        :rule-states="payload.ruleStateMap.get(rule.name) || []"
        :class="(payload.ruleStateMap.get(rule.name)?.length || filters.state === 'unused') ? '' : 'op40'"
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
    </div>
  </div>
</template>
