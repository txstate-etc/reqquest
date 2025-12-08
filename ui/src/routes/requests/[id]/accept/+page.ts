import { redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, parent }) => {
  const { applicationsAccept } = await parent()
  for (const prompt of applicationsAccept.flatMap(a => a.requirements).flatMap(r => r.prompts)) {
    if (!prompt.answered) {
      throw redirect(303, resolve(`/requests/${params.id}/accept/${prompt.id}`))
    }
  }
  throw redirect(303, resolve(`/requests/${params.id}/accept/review`))
}
