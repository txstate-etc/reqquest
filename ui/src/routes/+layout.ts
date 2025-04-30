import { api } from '$lib'
import type { LayoutLoad } from './$types'
import { unifiedAuth } from '@txstate-mws/sveltekit-utils'
import { error, isHttpError, type HttpError } from '@sveltejs/kit'

export const load: LayoutLoad = async input => {
  api.fetch = input.fetch
  await unifiedAuth.handle(api, input)
  try {
    return { access: await api.getAccess() }
  } catch (e: unknown) {
    if (isHttpError(e)) {
      error(e.status, e.body.message)
    } else {
      console.log(e)
    }
  }
}

export const ssr = false
