export const filtersConfigs = reactive<FiltersConfigsPage>({
  rule: '',
  filepath: '',
})

export const filtersRules = reactive({
  plugin: '',
  search: '',
  state: 'using' as 'using' | 'unused' | 'overloads' | '',
  status: 'active' as 'deprecated' | 'active' | '',
  fixable: null as boolean | null,
})

export const ruleViewType = useLocalStorage<'list' | 'grid'>('eslint-config-viewer-rule-view', 'list')
