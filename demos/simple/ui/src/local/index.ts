import { UIRegistry } from '$lib'
import DogWalker from 'carbon-icons-svelte/lib/DogWalker.svelte'
import ResidencePrompt from './ResidencePrompt.svelte'
import ResidencePromptDisplay from './ResidencePromptDisplay.svelte'
import ResidenceConfig from './ResidenceConfig.svelte'

export const uiRegistry = new UIRegistry({
  appName: 'Demo - Simple - Adopt a Pet',
  applicantDashboardIntroHeader: 'Start your Pet Journey Here!',
  applicantDashboardIntroDetail: 'Submitting an adoption application is the first step in adopting a pet. Based on your responses you will receive a list of "eligible benefits."',
  applicantDashboardRecentDays: 30,
  programs: [{
    key: 'adopt_a_pet_program',
    icon: DogWalker
  }],
  requirements: [
    { key: 'state_residence_req', configComponent: ResidenceConfig  }
  ],
  prompts: [{
    key: 'state_residence_prompt',
    formComponent: ResidencePrompt,
    displayComponent: ResidencePromptDisplay
  }]
})
