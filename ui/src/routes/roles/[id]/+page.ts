import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends }) => {
  const role = await api.getRoleDetails(params.id)
  if (!role) throw error(404, 'Role not found')
  depends('api:getRoleDetails')
  return { role }
}
