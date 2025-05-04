import { UIRegistry } from '$lib/registry'
import { DogWalker } from 'carbon-icons-svelte'
import YardPromptDisplay from './YardPromptDisplay.svelte'
import YardPrompt from './YardPrompt.svelte'
import CatTowerPromptDisplay from './CatTowerPromptDisplay.svelte'
import CatTowerPrompt from './CatTowerPrompt.svelte'
import TunaAllergyPromptDisplay from './TunaAllergyPromptDisplay.svelte'
import TunaAllergyPrompt from './TunaAllergyPrompt.svelte'
import SeemsNicePrompt from './SeemsNicePrompt.svelte'
import SeemsNicePromptDisplay from './SeemsNicePromptDisplay.svelte'

export const uiRegistry = new UIRegistry({
  appName: 'Adopt a Critter',
  programs: [{
    key: 'adopt_a_dog_program',
    icon: DogWalker
  }],
  requirements: [
    { key: 'have_big_yard_req' },
    { key: 'have_adequate_personal_space_req' },
    { key: 'cat_tower_req' },
    { key: 'not_allergic_to_tuna_req' },
    { key: 'applicant_seems_nice_req' }
  ],
  prompts: [{
    key: 'have_yard_prompt',
    formComponent: YardPrompt,
    displayComponent: YardPromptDisplay
  }, {
    key: 'have_a_cat_tower_prompt',
    formComponent: CatTowerPrompt,
    displayComponent: CatTowerPromptDisplay
  }, {
    key: 'not_allergic_to_tuna_prompt',
    formComponent: TunaAllergyPrompt,
    displayComponent: TunaAllergyPromptDisplay
  }, {
    key: 'applicant_seems_nice_prompt',
    formComponent: SeemsNicePrompt,
    displayComponent: SeemsNicePromptDisplay
  }]
})
