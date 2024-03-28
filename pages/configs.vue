<script setup lang="ts">
import { minimatch } from 'minimatch'
import type { Linter } from 'eslint'
import Fuse, { type FuseResultMatch } from 'fuse.js'
import type { PropType, VNode } from 'vue'
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

const autoCompleteFuse = computed(() => {
  return new Fuse(payload.value.files, {
    threshold: 0.3,
    includeMatches: true,
  })
})

const autoCompleteFiles = computed(() => {
  return autoCompleteFuse.value.search(filters.filepath || '')
})

const autoCompleteIndex = ref(0)
const autoCompleteOpen = ref(false)

function autoCompleteConfirm() {
  input.value = filters.filepath = autoCompleteFiles.value[autoCompleteIndex.value]?.item || filters.filepath
  autoCompleteOpen.value = false
}

function autoCompleteMove(delta: number) {
  autoCompleteIndex.value += delta
  if (autoCompleteIndex.value < 0)
    autoCompleteIndex.value += autoCompleteFiles.value.length
  if (autoCompleteIndex.value >= autoCompleteFiles.value.length)
    autoCompleteIndex.value -= autoCompleteFiles.value.length
}

const HighlightMatch = defineComponent({
  props: {
    matches: Array as PropType<readonly FuseResultMatch[]>,
  },
  setup(props) {
    return () => props.matches?.map((match) => {
      let start = 0
      const content = match.value || ''
      const array: VNode[] = []

      for (const [from, to] of match.indices) {
        if (start < from)
          array.push(h('span', { class: 'op50' }, content.slice(start, from)))
        array.push(h('span', { class: 'text-purple font-bold' }, content.slice(from, to + 1)))
        start = to + 1
      }
      if (start < content.length)
        array.push(h('span', { class: 'op50' }, content.slice(start)))
      return array
    })
  },
})

debouncedWatch(
  () => input.value,
  () => {
    filters.filepath = input.value
    autoCompleteIndex.value = 0
  },
  { debounce: 200 },
)
</script>

<template>
  <div>
    <div flex="~ col gap-3" py4>
      <div relative flex>
        <input
          v-model="input"
          placeholder="Test matching with filepath..."
          border="~ base rounded-full"
          w-full bg-transparent px3 py2 pl10 font-mono outline-none
          @focus="autoCompleteOpen = true"
          @click="autoCompleteOpen = true"
          @blur="autoCompleteOpen = false"
          @keydown.esc="autoCompleteOpen = false"
          @keydown.down.prevent="autoCompleteMove(1)"
          @keydown.up.prevent="autoCompleteMove(-1)"
          @keydown.enter.prevent="autoCompleteConfirm()"
        >
        <div absolute bottom-0 left-0 top-0 flex="~ items-center justify-center" p4 op50>
          <div i-carbon-search />
        </div>
        <div
          v-show="autoCompleteOpen && autoCompleteFiles.length"
          pos="absolute left-8 right-8 top-1/1"
          border="~ base rounded"
          flex="~ col" bg-glass z-1 mt--1 max-h-80 of-auto py1 shadow
        >
          <button
            v-for="file, idx of autoCompleteFiles"
            :key="file.item" px3 py0.5 text-left font-mono
            :class="idx === autoCompleteIndex ? 'bg-active' : ''"
          >
            <template v-if="file.matches">
              <HighlightMatch :matches="file.matches" />
            </template>
            <template v-else>
              {{ file.item }}
            </template>
          </button>
        </div>
      </div>
      <div flex="~ gap-2 items-center" mb2>
        <div v-if="filters.filepath">
          <div flex="~ gap-2 items-center" border="~ purple/20 rounded-full" bg-purple:10 px3 py1>
            <div i-carbon-filter />
            <span op50>Filepath</span>
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
      <template v-if="!filteredConfigs.length">
        <div italic op50>
          No matched config items.
        </div>
      </template>
    </div>
  </div>
</template>
