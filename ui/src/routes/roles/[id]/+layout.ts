import { api } from '$lib'
import { keyby } from 'txstate-utils'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ depends }) => {
  const subjectTypes = await api.getAuthorizationInfo()
  const subjectTypeLookup = keyby(subjectTypes, 'name')
  depends('api:getAuthorizationInfo')
  return { subjectTypes, subjectTypeLookup }
}
