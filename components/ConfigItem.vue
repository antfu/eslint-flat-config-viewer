<script setup lang="ts">
import type { RuleConfig } from '@antfu/eslint-define-config'
import type { FiltersConfigsPage, FlatESLintConfigItem } from '~/composables/types'

const props = defineProps<{
  config: FlatESLintConfigItem
  index: number
  filters?: FiltersConfigsPage
}>()

const emit = defineEmits<{
  badgeClick: [string]
}>()

const open = defineModel('open', {
  default: true,
})

const router = useRouter()
function gotoPlugin(name: string) {
  filtersRules.plugin = name
  router.push('/rules')
}

const extraConfigs = computed(() => {
  const ignoredKeys = ['files', 'plugins', 'ignores', 'rules', 'name']
  return Object.fromEntries(
    Object.entries(props.config)
      .filter(([key]) => !ignoredKeys.includes(key)),
  )
})
</script>

<template>
  <details
    class="flat-config-item"
    :open="open"
    border="~ base rounded" relative
    @toggle="open = $event.target.open"
  >
    <summary block>
      <div class="absolute right-[calc(100%+10px)] top-1.5" text-right font-mono op35>
        #{{ index + 1 }}
      </div>
      <div flex="~ gap-2 items-start" cursor-pointer select-none bg-secondary px2 py2 text-sm font-mono op75>
        <div i-carbon-chevron-right class="[details[open]_&]:rotate-90" transition />
        <span :class="config.name ? '' : 'op50 italic'">
          {{ config.name || `anonymous #${index + 1}` }}
        </span>
        <div flex-auto />

        <SummarizeItem
          icon="i-carbon-filter"
          :number="config.files?.length || 0"
          color="text-yellow"
          title="Files"
        />
        <SummarizeItem
          icon="i-carbon-view-off"
          :number="config.ignores?.length || 0"
          color="text-purple"
          title="Ignores"
        />
        <SummarizeItem
          icon="i-carbon-operations-record"
          :number="Object.keys(extraConfigs).length"
          color="text-green"
          title="Options"
        />
        <SummarizeItem
          icon="i-carbon-plug"
          :number="Object.keys(config.plugins || {}).length"
          color="text-teal"
          title="Plugins"
        />
        <SummarizeItem
          icon="i-carbon-list-checked"
          :number="Object.keys(config.rules || {}).length"
          color="text-blue"
          title="Rules"
          mr-2
        />
      </div>
    </summary>

    <div absolute right-2 top-2 text-right text-5em font-mono op5>
      #{{ index + 1 }}
    </div>

    <div p4 flex="~ col gap-4">
      <div v-if="config.files" flex="~ gap-2 items-start">
        <div i-carbon-filter my1 flex-none />
        <div flex="~ col gap-2">
          <div>Applies to files matching</div>
          <div flex="~ gap-2 items-center wrap">
            <GlobItem v-for="glob, idx of config.files" :key="idx" :glob="glob" />
          </div>
        </div>
      </div>
      <div v-else-if="config.rules || Object.keys(extraConfigs).length" flex="~ gap-2 items-center">
        <div i-carbon-categories flex-none />
        <div>Generally applies to all files</div>
      </div>
      <div v-if="config.plugins" flex="~ gap-2 items-start">
        <div i-carbon-plug my1 flex-none />
        <div flex="~ col gap-2">
          <div>Plugins ({{ Object.keys(config.plugins).length }})</div>
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
          <div v-if="!config.files">
            Ignore files globally
          </div>
          <div v-else>
            Ignore
          </div>
          <div flex="~ gap-2 items-center wrap">
            <GlobItem v-for="glob, idx of config.ignores" :key="idx" :glob="glob" />
          </div>
        </div>
      </div>
      <div v-else-if="config.rules">
        <div flex="~ gap-2 items-center">
          <div i-carbon-list-checked my1 flex-none />
          <div>Rules ({{ Object.keys(config.rules).length }})</div>
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

      <div v-if="Object.keys(extraConfigs).length" flex="~ gap-2">
        <div i-carbon-operations-record my1 flex-none />
        <div flex="~ col gap-2" w-full>
          <div>
            Additional configurations
          </div>
          <template v-for="v, k in extraConfigs" :key="k">
            <div>
              <code border="~ base rounded" px2 py1>{{ k }}</code>
            </div>
            <Shiki lang="ts" :code="stringifyUnquoted(v)" max-h-150 w-full of-scroll rounded bg-secondary p2 text-sm />
          </template>
        </div>
      </div>
    </div>
  </details>
</template>
