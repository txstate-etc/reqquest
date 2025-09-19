import type { LayoutLoad } from './$types'
// import { api } from '$lib'
// import { unifiedAuth } from '@txstate-mws/sveltekit-utils'

export const load: LayoutLoad = async input => {
  const showTabs = (input.url.pathname.split('/').length < 3)
  // api.fetch = input.fetch
  // await unifiedAuth.handle(api, input)
  // const access = await api.getAccess()
  return { showTabs }
}

export const ssr = false
