import { api } from '$internal'
import { keyby } from 'txstate-utils'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ depends }) => {
  const controlGroups = await api.getAuthorizationInfo()
  const controlGroupLookup = keyby(controlGroups, 'name')
  depends('api:getAuthorizationInfo')
  return { controlGroups, controlGroupLookup }
}
