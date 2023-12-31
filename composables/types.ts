import type { FlatESLintConfigItem as Item } from '@antfu/eslint-define-config'
import type { RuleMetaData } from '@typescript-eslint/utils/ts-eslint'

export interface FlatESLintConfigItem extends Item {
  name?: string
}

export type RuleLevel = 'off' | 'warn' | 'error'

export interface Payload {
  configs: FlatESLintConfigItem[]
  rules: Record<string, RuleInfo>
  meta: PayloadMeta
}

export interface ErrorInfo {
  error: string
  message?: string
}

export interface ResolvedPayload extends Payload {
  ruleStateMap: Map<string, RuleConfigStates>
}

export interface PayloadMeta {
  wsPort: number
  lastUpdate: number
  configPath: string
}

export interface RuleInfo extends RuleMetaData<any> {
  name: string
  plugin: string
}

export interface FiltersConfigsPage {
  rule?: string
}

export interface RuleConfigState {
  name: string
  configIndex: number
  level: RuleLevel
  options?: any[]
}

export type RuleConfigStates = RuleConfigState[]
