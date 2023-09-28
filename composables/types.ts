import type { FlatESLintConfigItem } from 'eslint-define-config'
import type { RuleMetaData } from '@typescript-eslint/utils/ts-eslint'

export type RuleLevel = 'off' | 'warn' | 'error'

export interface Payload {
  configs: FlatESLintConfigItem[]
  rules: Record<string, RuleInfo>
}

export interface RuleInfo extends RuleMetaData<any> {
  name: string
  plugin: string
}

export type RuleConfigStates = [number, RuleLevel][]
