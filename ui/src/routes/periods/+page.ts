import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends }) => {
  const periods = await api.getPeriodList()
  depends('api:getPeriodList')
  return { periods }
}
