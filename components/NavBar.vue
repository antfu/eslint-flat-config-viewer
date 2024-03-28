<script setup lang="ts">
import { version } from '../package.json'
import { payload } from '~/composables/payload'
import { filtersRules as filters } from '~/composables/state'

const lastUpdate = useTimeAgo(() => payload.value.meta.lastUpdate)

const isDark = useDark()

const rules = computed(() => Object.values(payload.value.rules))
const deprecatedUsing = computed(() => rules.value
  .filter(rule => rule.deprecated && payload.value.ruleStateMap.get(rule.name)?.some(i => i.level !== 'off')))

const router = useRouter()
function showDeprecated() {
  filters.status = 'deprecated'
  filters.plugin = ''
  filters.state = 'using'
  filters.search = ''

  if (router.currentRoute.value.path !== '/rules')
    router.push('/rules')
}

function toggleRuleView() {
  ruleViewType.value = ruleViewType.value === 'list' ? 'grid' : 'list'
}
</script>

<template>
  <div text-3xl font-200>
    <a
      href="https://github.com/antfu/eslint-flat-config-viewer" target="_blank"
      flex="inline gap-2 items-center" mr1
    >
      <img src="/favicon.svg" inline-block h-1em> ESLint Flat Config Viewer
    </a>
    <sup op50>v{{ version }}</sup>
  </div>
  <div flex="~ gap-1 items-center" text-sm>
    <span font-mono op50>{{ payload.meta.configPath }}</span>
  </div>
  <div flex="~ gap-1 items-center" text-sm>
    <span op50>Composed with</span>
    <span font-bold>{{ payload.configs.length }}</span>
    <span op50>config items, updated</span>
    <span op75>{{ lastUpdate }}</span>
  </div>
  <div flex="~ gap-3 items-center" py4>
    <NuxtLink
      to="/configs" active-class="op100! bg-active"
      px3 py1 op50 border="~ base rounded"
      flex="~ gap-2 items-center"
    >
      <div i-ph-stack-duotone flex-none />
      Config Items
    </NuxtLink>
    <NuxtLink
      to="/rules" active-class="op100! bg-active"
      px3 py1 op50 border="~ base rounded"
      flex="~ gap-2 items-center"
    >
      <div i-ph-list-dashes-duotone flex-none />
      Available Rules
    </NuxtLink>
    <button
      title="Toggle Dark Mode"
      i-ph-sun-dim-duotone dark:i-ph-moon-stars-duotone ml1 text-xl op50 hover:op75
      @click="isDark = !isDark"
    />
    <button
      title="Toggle Rule View"
      :class="ruleViewType === 'list' ? 'i-ph-list-duotone' : 'i-ph-grid-four-duotone'"
      text-xl op50 hover:op75
      @click="toggleRuleView()"
    />
    <NuxtLink
      href="https://github.com/antfu/eslint-flat-config-viewer" target="_blank"
      i-carbon-logo-github text-lg op50 hover:op75
    />
    <div v-if="deprecatedUsing.length" ml-5>
      <button
        to="/configs"
        border="~ orange/20 rounded-full"
        flex="~ gap-2 items-center"
        bg-orange:5 px3 py1 text-sm text-orange hover:bg-orange:10
        @click="showDeprecated"
      >
        <div i-ph-warning-duotone flex-none />
        Using {{ deprecatedUsing.length }} deprecated rules
      </button>
    </div>
  </div>
</template>
