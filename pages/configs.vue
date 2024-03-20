<script setup lang="ts">
import { filtersConfigs as filters } from '~/composables/state'
import { payload } from '~/composables/payload'

const opens = ref(payload.value.configs.map(() => true))

function expandAll() {
  opens.value = opens.value.map(() => true)
}

function collapseAll() {
  opens.value = opens.value.map(() => false)
}
</script>

<template>
  <div>
    <div flex="~ col gap-3" py6>
      <div v-if="filters.rule">
        <div flex="~ gap-2 items-center" border="~ lime/10 rounded" bg-lime:5 px4 py1.5>
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
      <div flex="~ gap-2 items-center">
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
          v-show="!filters.rule || (filters.rule in (config.rules || {}))"
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
