import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends }) => {
  const { programs, period } = await api.getPeriodConfigurations(params.id)
  depends('api:getPeriodConfigurations')
  if (!period) throw error(404, 'Period not found')
  return { programs, period }
}
