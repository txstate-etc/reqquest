import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ depends, parent }) => {
  const { access } = await parent()
  // access is missing only when the layout failed; it renders layoutError in place of the page, so don't mask it
  if (!access) return {} as never
  if (!access.viewPeriodManagement) throw error(403)
  const periods = await api.getPeriodList()
  depends('api:getPeriodList')
  return { periods }
}
