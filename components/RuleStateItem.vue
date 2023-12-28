<script setup lang="ts">
import { nth } from '~/composables/strings'
import type { RuleConfigState } from '~/composables/types'

const props = defineProps<{
  state: RuleConfigState
  isLocal?: boolean
}>()

const colors = {
  error: 'text-green',
  warn: 'text-amber',
  off: 'text-gray',
}

const config = computed(() => payload.value.configs[props.state.configIndex])

const router = useRouter()
function goto() {
  filtersConfigs.rule = props.state.name
  router.push('/configs')
}
</script>

<template>
  <div min-w-100 p4 flex="~ col gap-2">
    <div flex="~ gap-1 items-center">
      <RuleLevelIcon
        :level="state.level"
        :config-index="state.configIndex"
      />
      <span v-if="state.level === 'off'" ml1 op50>Turned </span>
      <span v-else ml1 op50>Set to </span>
      <span font-mono :class="colors[state.level]">{{ state.level }}</span>
      <template v-if="!isLocal">
        <span op50>in the</span>
        <button hover="underline" @click="goto()">
          {{ nth(state.configIndex + 1) }}
          <span op50> config item </span>
          <span v-if="config.name" text-sm text-teal6 font-mono op75 dark:text-teal>({{ config.name }})</span>
        </button>
      </template>
      <div v-else op50>
        in this config
      </div>
    </div>
    <div v-if="!isLocal" flex="~ gap-2">
      <template v-if="config.files">
        <div i-carbon-batch-job my1 flex-none op75 />
        <div flex="~ col gap-2">
          <div op50>
            Applies to files matching
          </div>
          <div flex="~ gap-2 items-center wrap">
            <GlobItem v-for="glob, idx of config.files" :key="idx" :glob="glob" />
          </div>
        </div>
      </template>
      <template v-else-if="config.rules">
        <div i-carbon-categories flex-none op75 />
        <div op50>
          Applied generally for all files
        </div>
      </template>
    </div>
    <template v-if="state.options?.length">
      <div flex="~ gap-2 items-center">
        <div i-carbon-settings my1 flex-none op75 />
        <div op50>
          Rule options
        </div>
      </div>
      <pre rounded bg-secondary p2 text-sm>{{ state.options }}</pre>
    </template>
  </div>
</template>
