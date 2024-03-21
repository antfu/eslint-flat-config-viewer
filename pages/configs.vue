<script setup lang="ts">
import { minimatch } from 'minimatch'
import type { Linter } from 'eslint'
import { filtersConfigs as filters } from '~/composables/state'
import { payload } from '~/composables/payload'

const opens = ref(payload.value.configs.map(() => true))
const input = ref(filters.filepath)

function expandAll() {
  opens.value = opens.value.map(() => true)
}

function collapseAll() {
  opens.value = opens.value.map(() => false)
}

function matchGlob(file: string, glob: (Linter.FlatConfigFileSpec | Linter.FlatConfigFileSpec[])[]) {
  const globs = (Array.isArray(glob) ? glob : [glob]).flat()
  return globs.some(glob => typeof glob === 'function' ? glob(file) : minimatch(file, glob))
}

const filteredConfigs = computed(() => {
  let configs = payload.value.configs

  if (filters.filepath) {
    const ignoreOnlyConfigs = configs.filter(config => !config.rules && config.ignores)
    const isIgnored = ignoreOnlyConfigs.some(config => matchGlob(filters.filepath!, config.ignores!))
    if (isIgnored)
      return []
    const isAnyIncluded = configs.some(config => matchGlob(filters.filepath!, config.files || []))
    if (!isAnyIncluded)
      return []
    configs = configs.filter((config) => {
      const isIncluded = config.files ? matchGlob(filters.filepath!, config.files) : true
      const isExcluded = config.ignores ? matchGlob(filters.filepath!, config.ignores) : false
      return isIncluded && !isExcluded
    })
  }

  if (filters.rule)
    configs = configs.filter(config => filters.rule! in (config.rules || {}))

  return configs
})

debouncedWatch(
  () => input.value,
  () => filters.filepath = input.value,
  { debounce: 200 },
)
</script>

<template>
  <div>
    <div flex="~ col gap-3" py6>
      <input
        v-model="input"
        placeholder="Match file names..."
        border="~ base rounded"
        bg-transparent px3 py2 outline-none
      >
      <div flex="~ gap-2 items-center">
        <div v-if="filters.filepath">
          <div flex="~ gap-2 items-center" border="~ lime/10 rounded" bg-lime:5 px4 py1>
            <div i-carbon-filter />
            <span op50>File path</span>
            <code>{{ filters.filepath }}</code>
            <span op50>Matched with</span>
            <span>{{ filteredConfigs.length }} / {{ payload.configs.length }}</span>
            <span op50>config items</span>
            <button
              i-carbon-close op50 hover:op100
              @click="filters.filepath = ''"
            />
          </div>
        </div>
        <div v-if="filters.rule">
          <div flex="~ gap-2 items-center" border="~ lime/10 rounded" bg-lime:5 px4 py1>
            <div i-carbon-filter />
            <span op50>Filtered by</span>
            <ColorizedRuleName :name="filters.rule" />
            <span op50>rule</span>
            <button
              i-carbon-close op50 hover:op100
              @click="filters.rule = ''"
            />
          </div>
        </div>
        <div flex-auto />
        <button
          hover="op100! bg-active"
          px3 py1 op50 border="~ base rounded"
          flex="~ gap-2 items-center"
          @click="expandAll"
        >
          Expand All
        </button>
        <button
          hover="op100! bg-active"
          px3 py1 op50 border="~ base rounded"
          flex="~ gap-2 items-center"
          @click="collapseAll"
        >
          Collapse All
        </button>
      </div>
      <template
        v-for="config, idx in payload.configs"
        :key="idx"
      >
        <ConfigItem
          v-show="filteredConfigs.includes(config)"
          v-model:open="opens[idx]"
          :payload="payload"
          :config="config"
          :index="idx"
          :filters="filters"
          @badge-click="e => filters.rule = e"
        />
      </template>
    </div>
  </div>
</template>
