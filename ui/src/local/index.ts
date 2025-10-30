import { UIRegistry } from '$lib'
import { PUBLIC_DEMO_INSTANCE } from '$env/static/public'
/** default */
import DogWalker from 'carbon-icons-svelte/lib/DogWalker.svelte'
import Gamification from 'carbon-icons-svelte/lib/Gamification.svelte'
import PedestrianFamily from 'carbon-icons-svelte/lib/PedestrianFamily.svelte'
import YardPromptDisplay from './default/YardPromptDisplay.svelte'
import YardPrompt from './default/YardPrompt.svelte'
import CatTowerPromptDisplay from './default/CatTowerPromptDisplay.svelte'
import CatTowerPrompt from './default/CatTowerPrompt.svelte'
import TunaAllergyPromptDisplay from './default/TunaAllergyPromptDisplay.svelte'
import TunaAllergyPrompt from './default/TunaAllergyPrompt.svelte'
import SeemsNicePrompt from './default/SeemsNicePrompt.svelte'
import SeemsNicePromptDisplay from './default/SeemsNicePromptDisplay.svelte'
import ExerciseConfigure from './default/ExerciseConfigure.svelte'
import ExercisePrompt from './default/ExercisePrompt.svelte'
import ExercisePromptDisplay from './default/ExercisePromptDisplay.svelte'
import StatePrompt from './default/StatePrompt.svelte'
import StatePromptDisplay from './default/StatePromptDisplay.svelte'
import OtherCatsPrompt from './default/OtherCatsPrompt.svelte'
import OtherCatsPromptDisplay from './default/OtherCatsPromptDisplay.svelte'
import OtherCatsVaccinesPrompt from './default/OtherCatsVaccinesPrompt.svelte'
import OtherCatsVaccinesPromptDisplay from './default/OtherCatsVaccinesPromptDisplay.svelte'
import VaccineReviewPrompt from './default/VaccineReviewPrompt.svelte'
import VaccineReviewPromptDisplay from './default/VaccineReviewPromptDisplay.svelte'

/** simple */
import ResidencePrompt from './simple/ResidencePrompt.svelte'
import ResidencePromptDisplay from './simple/ResidencePromptDisplay.svelte'
import ResidenceConfig from './simple/ResidenceConfig.svelte'
import ResidenceConfirmationReviewPrompt from './simple/ResidenceConfirmationReviewPrompt.svelte'
import ResidenceConfirmationReviewPromptDisplay from './simple/ResidenceConfirmationReviewPromptDisplay.svelte'

/** Complex */
import ComplexResidencePrompt from './complex/residence/ResidencePrompt.svelte'
import ComplexResidenceDisplayPrompt from './complex/residence/ResidenceDisplayPrompt.svelte'
import ComplexResidenceConfig from './complex/residence/ResidenceConfig.svelte'
import ComplexPetOwnerPrompt from './complex/petOwner/PetOwnerPrompt.svelte'
import ComplexPetOwnerDisplayPrompt from './complex/petOwner/PetOwnerDisplayPrompt.svelte'
import ComplexPreviousDogOwnerPrompt from './complex/dogOwner/PreviousDogOwnerPrompt.svelte'
import ComplexPreviousDogOwnerDisplayPrompt from './complex/dogOwner/PreviousDogOwnerDisplayPrompt.svelte'
import ComplexCurrentDogOwnerPrompt from './complex/dogOwner/CurrentDogOwnerPrompt.svelte'
import ComplexCurrentDogOwnerDisplayPrompt from './complex/dogOwner/CurrentDogOwnerDisplayPrompt.svelte'
import ComplexCurrentDogConfig from './complex/dogOwner/CurrentDogConfig.svelte'
import ComplexYardConfig from './complex/yard/YardConfig.svelte'
import ComplexYardPrompt from './complex/yard/YardPrompt.svelte'
import ComplexYardDisplayPrompt from './complex/yard/YardDisplayPrompt.svelte'
import ComplexOwnerDogAllergyPrompt from './complex/dogOwner/OwnerDogAllergyPrompt.svelte'
import ComplexOwnerDogAllergyDisplayPrompt from './complex/dogOwner/OwnerDogAllergyDisplayPrompt.svelte'
import ComplexDogExerciseConfig from './complex/dogOwner/DogExerciseConfig.svelte'
import ComplexDogExercisePrompt from './complex/dogOwner/DogExercisePrompt.svelte'
import ComplexDogExerciseDisplayPrompt from './complex/dogOwner/DogExerciseDisplayPrompt.svelte'


const { appName, applicantDashboardIntroHeader, applicantDashboardIntroDetail, applicantDashboardRecentDays, programs, requirements, prompts} =  configureDemoInstanceParams()

export const uiRegistry = new UIRegistry({
  appName,
  applicantDashboardIntroHeader,
  applicantDashboardIntroDetail,
  applicantDashboardRecentDays,
  programs,
  requirements,
  prompts
})

function configureDemoInstanceParams() {
  if (PUBLIC_DEMO_INSTANCE === 'simple') {
    return {
      appName: 'Adopt a Pet',
      applicantDashboardIntroHeader: 'Start your Pet Journey Here!',
      applicantDashboardIntroDetail: 'Submitting an adoption application is the first step in adopting a pet. Based on your responses you will receive a list of "eligible benefits."',
      applicantDashboardRecentDays: 30,
      programs: [{
        key: 'adopt_a_pet_program',
        icon: DogWalker
      }],
      requirements: [
        { key: 'state_residence_req', configureComponent: ResidenceConfig },
        { key: 'state_residence_confirmation_req' }
      ],
      prompts: [{
          key: 'state_residence_prompt',
          formComponent: ResidencePrompt,
          displayComponent: ResidencePromptDisplay
        },
        {
          key: 'state_residence_confirmation_prompt',
          formComponent: ResidenceConfirmationReviewPrompt,
          displayComponent: ResidenceConfirmationReviewPromptDisplay
        }
      ]
    }
  }
  else if (PUBLIC_DEMO_INSTANCE === 'multi') { //TODO - Update one spec for multi complete, currently mirror demo
    return {
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
      }, {
        key: 'other_cats_prompt',
        formComponent: OtherCatsPrompt,
        displayComponent: OtherCatsPromptDisplay
      }, {
        key: 'other_cats_vaccines_prompt',
        formComponent: OtherCatsVaccinesPrompt,
        displayComponent: OtherCatsVaccinesPromptDisplay
      }, {
        key: 'vaccine_review_prompt',
        formComponent: VaccineReviewPrompt,
        displayComponent: VaccineReviewPromptDisplay
      }]
    }
  }
  else if (PUBLIC_DEMO_INSTANCE === 'complex') {
    return {
      appName: 'Pet lover',
      applicantDashboardIntroHeader: 'Keep your love of pets alive!',
      applicantDashboardIntroDetail: 'Submitting an application is the first step in making the life of a pet better! Based on your responses you will receive a list of "eligible benefits."',
      applicantDashboardRecentDays: 30,
      programs: [{ key: 'adopt_a_dog_program', icon: DogWalker },
        { key: 'adopt_a_cat_program', icon: PedestrianFamily },
        { key: 'foster_a_pet_program', icon: Gamification },
        { key: 'senior_pet_program', icon: DogWalker }
      ],
      requirements: [
        { key: 'state_residence_prequal_req', configureComponent: ComplexResidenceConfig },
        { key: 'petowner_prequal_req' },
        { key: 'previous_dogwowner_qual_req'},
        { key: 'current_dogowner_qual_req', configureComponent: ComplexCurrentDogConfig },
        { key: 'yard_qual_req', configureComponent: ComplexYardConfig },
        { key: 'owner_dog_allergy_qual_req'},
        { key: 'dog_exercise_qual_req', configureComponent: ComplexDogExerciseConfig }
      ],
      prompts: [
        { key: 'state_residence_prompt', formComponent: ComplexResidencePrompt, displayComponent: ComplexResidenceDisplayPrompt },
        { key: 'petowner_prompt', formComponent: ComplexPetOwnerPrompt, displayComponent: ComplexPetOwnerDisplayPrompt },
        { key: 'previous_dogowner_prompt', formComponent: ComplexPreviousDogOwnerPrompt, displayComponent: ComplexPreviousDogOwnerDisplayPrompt },
        { key: 'current_dogowner_prompt', formComponent: ComplexCurrentDogOwnerPrompt, displayComponent: ComplexCurrentDogOwnerDisplayPrompt },
        { key: 'yard_prompt', formComponent: ComplexYardPrompt, displayComponent: ComplexYardDisplayPrompt},
        { key: 'owner_dog_allergy_prompt', formComponent: ComplexOwnerDogAllergyPrompt, displayComponent: ComplexOwnerDogAllergyDisplayPrompt},
        { key: 'dog_exercise_prompt', formComponent: ComplexDogExercisePrompt, displayComponent: ComplexDogExerciseDisplayPrompt}
      ]
    }
  }
  return {
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
    }, {
      key: 'other_cats_prompt',
      formComponent: OtherCatsPrompt,
      displayComponent: OtherCatsPromptDisplay
    }, {
      key: 'other_cats_vaccines_prompt',
      formComponent: OtherCatsVaccinesPrompt,
      displayComponent: OtherCatsVaccinesPromptDisplay
    }, {
      key: 'vaccine_review_prompt',
      formComponent: VaccineReviewPrompt,
      displayComponent: VaccineReviewPromptDisplay
    }]
  }
}