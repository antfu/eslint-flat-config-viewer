<script setup lang="ts">
import type { RuleConfig } from '@antfu/eslint-define-config'
import type { FiltersConfigsPage, FlatESLintConfigItem } from '~/composables/types'

defineProps<{
  config: FlatESLintConfigItem
  index: number
  filters?: FiltersConfigsPage
}>()

const emit = defineEmits<{
  badgeClick: [string]
}>()

const router = useRouter()
function gotoPlugin(name: string) {
  filtersRules.plugin = name
  router.push('/rules')
}
</script>

<template>
  <div border="~ base rounded" relative>
    <div class="absolute right-[calc(100%+10px)] top-2" text-right font-mono op35>
      #{{ index + 1 }}
    </div>
    <div absolute right-2 top--4 text-right text-5em font-mono op5>
      #{{ index + 1 }}
    </div>
    <div v-if="config.name" flex="~ gap-2 items-start" bg-secondary px4 py2 text-sm font-mono op75>
      {{ config.name }}
    </div>
    <div p4 flex="~ col gap-4">
      <div v-if="config.files" flex="~ gap-2 items-start">
        <div i-carbon-batch-job my1 flex-none />
        <div flex="~ col gap-2">
          <div>Applies to files matching</div>
          <div flex="~ gap-2 items-center wrap">
            <GlobItem v-for="glob, idx of config.files" :key="idx" :glob="glob" />
          </div>
        </div>
      </div>
      <div v-else-if="config.rules" flex="~ gap-2 items-center">
        <div i-carbon-categories flex-none />
        <div>Generally applies to all files</div>
      </div>
      <div v-if="config.plugins" flex="~ gap-2 items-start">
        <div i-carbon-plug my1 flex-none />
        <div flex="~ col gap-2">
          <div>Plugins</div>
          <div flex="~ gap-2 items-center wrap">
            <button
              v-for="name, idx of Object.keys(config.plugins)"
              :key="idx" border="~ base rounded" bg-gray:5 px2
              :style="{ color: getPluginColor(name) }"
              font-mono op75
              @click="gotoPlugin(name)"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="config.ignores" flex="~ gap-2 items-start">
        <div i-carbon-view-off my1 flex-none />
        <div flex="~ col gap-2">
          <div>Contribute ignore globs</div>
          <div flex="~ gap-2 items-center wrap">
            <GlobItem v-for="glob, idx of config.ignores" :key="idx" :glob="glob" />
          </div>
        </div>
      </div>
      <div v-else-if="config.rules">
        <div flex="~ gap-2 items-center">
          <div i-carbon-list-checked my1 flex-none />
          <div>Rules</div>
        </div>
        <div grid="~ cols-[max-content_max-content_max-content_1fr] gap-x-2 items-center">
          <template
            v-for="value, name in (config.rules as Record<string, RuleConfig>)"
            :key="name"
          >
            <RuleItem
              v-if="!(filters?.rule) || filters.rule === name"
              :rule="(getRule(name) || { name } as any)"
              :value="value"
              :class="getRuleLevel(value) === 'off' ? 'op50' : ''"
            >
              <template #popup>
                <RuleStateItem
                  border="t base"
                  :is-local="true"
                  :state="{
                    name,
                    level: getRuleLevel(value)!,
                    configIndex: index,
                    options: getRuleOptions(value),
                  }"
                />
              </template>
              <template #popup-actions>
                <button
                  v-close-popper
                  action-button
                  @click="emit('badgeClick', name)"
                >
                  <div i-carbon-filter />
                  Filter by this rule
                </button>
              </template>
            </RuleItem>
          </template>
        </div>
        <div>
          <button v-if="filters?.rule" ml8 op50 @click="emit('badgeClick', '')">
            ...{{ Object.keys(config.rules).filter(r => r !== filters?.rule).length }} others rules are hidden
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
