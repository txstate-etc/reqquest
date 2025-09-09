import { UIRegistry } from '$lib'
import DogWalker from 'carbon-icons-svelte/lib/DogWalker.svelte'
import StatePrompt from './StatePrompt.svelte'
import StatePromptDisplay from './StatePromptDisplay.svelte'

export const uiRegistry = new UIRegistry({
  appName: 'Adopt a Critter',
  applicantDashboardIntroHeader: 'Start your Pet Journey Here!',
  applicantDashboardIntroDetail: 'Submitting an adoption application is the first step in adopting a cat or dog. Based on your responses you will receive a list of "eligible benefits."',
  applicantDashboardRecentDays: 30,
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
    { key: 'which_state_req' },
    { key: 'other_cats_applicant_req' },
    { key: 'other_cats_reviewer_req' }
  ],
  prompts: [{
    key: 'which_state_prompt',
    formComponent: StatePrompt,
    displayComponent: StatePromptDisplay
  }]
})
