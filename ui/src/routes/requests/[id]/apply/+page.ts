import { redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { applicantVisiblePromptVisibilities } from '$internal'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, parent }) => {
  const { prequalPrompts } = await parent()
  for (const prompt of prequalPrompts) {
    if ((!prompt.answered || prompt.invalidated) && applicantVisiblePromptVisibilities.has(prompt.visibility) && !prompt.moot) {
      throw redirect(303, resolve(`/requests/${params.id}/apply/${prompt.id}`))
    }
  }
  throw redirect(303, resolve(`/requests/${params.id}/apply/programs`))
}
