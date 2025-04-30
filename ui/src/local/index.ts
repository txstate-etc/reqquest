import { UIRegistry } from '$lib/registry'
import { DogWalker } from 'carbon-icons-svelte'
import YardPromptDisplay from './YardPromptDisplay.svelte'
import YardPrompt from './YardPrompt.svelte'

export const uiRegistry = new UIRegistry({
  appName: 'VA Certification',
  programs: [{
    key: 'adopt_a_dog_program',
    icon: DogWalker
  }],
  requirements: [
    { key: 'have_big_yard_req' },
    { key: 'have_adequate_personal_space_req' }
  ],
  prompts: [{
    key: 'yard_prompt',
    formComponent: YardPrompt,
    displayComponent: YardPromptDisplay
  }]
})
