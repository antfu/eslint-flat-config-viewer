import type { RuleConfig } from 'eslint-define-config'

export function getRuleLevel(level: RuleConfig | undefined) {
  const first = Array.isArray(level) ? level[0] : level
  switch (first) {
    case 0:
    case 'off':
      return 'off'
    case 1:
    case 'warn':
      return 'warn'
    case 2:
    case 'error':
      return 'error'
  }
}

export function getRuleOptions<T extends any[]>(level: RuleConfig<T> | undefined): T | undefined {
  if (Array.isArray(level))
    return level.slice(1) as T
}
