export const filtersConfigs = reactive<FiltersConfigsPage>({
  rule: '',
})

export const filtersRules = reactive({
  plugin: '',
  search: '',
  state: 'using' as 'using' | 'unused' | 'overloads' | '',
  status: 'active' as 'deprecated' | 'active' | '',
  fixable: null as boolean | null,
})

export const filtersFileMatch = reactive({
  path: '',
})
