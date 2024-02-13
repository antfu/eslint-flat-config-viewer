export const filtersConfigs = reactive<FiltersConfigsPage>({
  rule: '',
  filepath: '',
})

export const filtersRules = reactive({
  plugin: '',
  search: '',
  state: 'using' as 'using' | 'enabled' | 'unused' | 'overloads' | '',
  status: 'active' as 'deprecated' | 'active' | '',
  fixable: null as boolean | null,
})
