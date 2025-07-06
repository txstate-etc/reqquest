import { UIRegistry } from '$lib'
import DogWalker from 'carbon-icons-svelte/lib/DogWalker.svelte'
import YardPromptDisplay from './YardPromptDisplay.svelte'
import YardPrompt from './YardPrompt.svelte'
import CatTowerPromptDisplay from './CatTowerPromptDisplay.svelte'
import CatTowerPrompt from './CatTowerPrompt.svelte'
import TunaAllergyPromptDisplay from './TunaAllergyPromptDisplay.svelte'
import TunaAllergyPrompt from './TunaAllergyPrompt.svelte'
import SeemsNicePrompt from './SeemsNicePrompt.svelte'
import SeemsNicePromptDisplay from './SeemsNicePromptDisplay.svelte'
import ExerciseConfigure from './ExerciseConfigure.svelte'
import ExercisePrompt from './ExercisePrompt.svelte'
import ExercisePromptDisplay from './ExercisePromptDisplay.svelte'
import StatePrompt from './StatePrompt.svelte'
import StatePromptDisplay from './StatePromptDisplay.svelte'

export const uiRegistry = new UIRegistry({
  appName: 'Adopt a Critter',
  programs: [{
    key: 'adopt_a_dog_program',
    icon: DogWalker
  }],
  requirements: [
    { key: 'have_big_yard_req' },
    { key: 'have_adequate_personal_space_req' },
    { key: 'have_a_cat_tower_req' },
    { key: 'not_allergic_to_tuna_req' },
    { key: 'applicant_seems_nice_req' },
    { key: 'must_exercise_your_dog_req', configureComponent: ExerciseConfigure },
    { key: 'which_state_req' }
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
  }, {
    key: 'must_exercise_your_dog_prompt',
    formComponent: ExercisePrompt,
    displayComponent: ExercisePromptDisplay
  }, {
    key: 'which_state_prompt',
    formComponent: StatePrompt,
    displayComponent: StatePromptDisplay
  }]
})
