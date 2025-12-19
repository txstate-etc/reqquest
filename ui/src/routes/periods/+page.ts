import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ depends, parent }) => {
  const { access } = await parent()
  if (!access.viewPeriodManagement) throw error(403)
  const periods = await api.getPeriodList()
  depends('api:getPeriodList')
  return { periods }
}
