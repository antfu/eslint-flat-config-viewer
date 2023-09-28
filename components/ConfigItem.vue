<script setup lang="ts">
import type { FlatESLintConfigItem } from 'eslint-define-config'

defineProps<{
  config: FlatESLintConfigItem
  index: number
}>()
</script>

<template>
  <div border="~ base rounded" relative of-hidden p4 flex="~ col gap-4">
    <div absolute left-2 top--5 text-5em line-height-1em op5>
      #{{ index + 1 }}
    </div>
    <div v-if="config.files" flex="~ gap-2 items-start">
      <div i-carbon-batch-job my1 flex-none />
      <div flex="~ col gap-2">
        <div>Files</div>
        <div flex="~ gap-2 items-center wrap">
          <GlobItem v-for="glob, idx of config.files" :key="idx" :glob="glob" />
        </div>
      </div>
    </div>
    <div v-else-if="config.rules" flex="~ gap-2 items-center">
      <div i-carbon-categories flex-none />
      <div>General rules, works in for all files</div>
    </div>
    <div v-if="config.ignores" flex="~ gap-2 items-start">
      <div i-carbon-view-off my1 flex-none />
      <div flex="~ col gap-2">
        <div>Ignores</div>
        <div flex="~ gap-2 items-center wrap">
          <GlobItem v-for="glob, idx of config.ignores" :key="idx" :glob="glob" />
        </div>
      </div>
    </div>
    <template v-else-if="config.rules">
      <div flex="~ gap-2 items-center">
        <div i-carbon-list-checked my1 flex-none />
        <div>Rules</div>
      </div>
      <table ml6>
        <tbody>
          <RuleItem
            v-for="value, name in config.rules"
            :key="name"
            :rule="{
              name,
              // TODO: get rule instance
            }"
            :value="value"
            :class="getRuleLevel(value) === 'off' ? 'op50' : ''"
          />
        </tbody>
      </table>
    </template>
  </div>
</template>
