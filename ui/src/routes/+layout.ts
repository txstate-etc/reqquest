import { api } from '$internal'
import type { LayoutLoad } from './$types'
import { unifiedAuth } from '@txstate-mws/sveltekit-utils'

export const load: LayoutLoad = async input => {
  api.fetch = input.fetch
  await unifiedAuth.handle(api, input)
  const access = await api.getAccess()
  return { access }
}

export const ssr = false
