import { redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { api, enumPromptVisibility } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, parent }) => {
  const { prequalPrompts } = await parent()
  for (const prompt of prequalPrompts) {
    if ((!prompt.answered || prompt.invalidated) && prompt.visibility === enumPromptVisibility.AVAILABLE && !prompt.moot) {
      throw redirect(303, resolve(`/requests/${params.id}/apply/${prompt.id}`))
    }
  }
  throw redirect(303, resolve(`/requests/${params.id}/apply/programs`))
}
