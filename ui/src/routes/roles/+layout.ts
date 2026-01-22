import type { LayoutLoad } from './$types'
// import { api } from '$internal'
// import { unifiedAuth } from '@txstate-mws/sveltekit-utils'

export const load: LayoutLoad = async input => {
  const lastPath = input.url.pathname.split('/').pop()
  const showTabs = (lastPath === 'roles' || lastPath === 'users')
  // api.fetch = input.fetch
  // await unifiedAuth.handle(api, input)
  // const access = await api.getAccess()
  return { showTabs }
}

export const ssr = false
