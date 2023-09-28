import process from 'node:process'
import JITI from 'jiti'
import type { FlatESLintConfigItem } from 'eslint-define-config'
import type { RuleInfo } from '~/composables/types'

export default lazyEventHandler(() => {
  const jiti = JITI(process.cwd())
  const config = useRuntimeConfig()
  // TODO: HMR
  const rawConfigs = jiti(config.public.configPath).default as FlatESLintConfigItem[]

  return defineEventHandler(() => {
    const allRules = new Map<string, RuleInfo>()

    for (const item of rawConfigs) {
      for (const [prefix, plugin] of Object.entries(item.plugins ?? {})) {
        for (const [name, rule] of Object.entries(plugin.rules ?? {})) {
          allRules.set(`${prefix}/${name}`, {
            ...(rule as any).meta as any,
            name: `${prefix}/${name}`,
            plugin: prefix,
            schema: undefined,
            messages: undefined,
          })
        }
      }
    }

    return {
      configs: rawConfigs.map((c): FlatESLintConfigItem => {
        return {
          ...c,
          plugins: undefined,
          processor: undefined,
          languageOptions: undefined,
        }
      }),
      rules: Object.fromEntries(allRules.entries()),
    }
  })
})
