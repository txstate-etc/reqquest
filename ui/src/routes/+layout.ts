import { api } from '$internal'
import type { LayoutLoad } from './$types'
import { unifiedAuth } from '@txstate-mws/sveltekit-utils'

export const load: LayoutLoad = async input => {
  api.fetch = input.fetch
  await unifiedAuth.handle(api, input)
  try {
    const canImpersonate = await unifiedAuth.mayImpersonateAny(api)
    const access = await api.getAccess()
    return { access, canImpersonate }
  } catch (e: any) {
    return { layoutError: { status: e.status, message: e.message } }
  }
}

export const ssr = false
