export interface FilterUIFilters {
  f?: any
  q?: any
  t?: any
  search?: string
}

export function extractMergedFilters (params: FilterUIFilters) {
  return { ...params.f, ...params.q, ...(typeof params.t === 'object' ? params.t : { t: params.t }), search: params.search }
}
