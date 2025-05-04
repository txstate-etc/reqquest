import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const prompt = await api.getNextPrompt(params.id)
  if (!prompt) throw redirect(302, `${base}/requests/${params.id}/apply/review`)
  redirect(303, `${base}/requests/${params.id}/apply/${prompt.key}`)
}
