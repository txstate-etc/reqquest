import { PUBLIC_DEMO_INSTANCE } from '$env/static/public'
import { UIRegistry } from '$lib'
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
import ComplexPreviousCatOwnerPrompt from './complex/catOwner/PreviousCatOwnerPrompt.svelte'
import ComplexPreviousCatOwnerDisplayPrompt from './complex/catOwner/PreviousCatOwnerDisplayPrompt.svelte'
import ComplexCurrentCatConfig from './complex/catOwner/CurrentCatConfig.svelte'
import ComplexCurrentCatOwnerPrompt from './complex/catOwner/CurrentCatOwnerPrompt.svelte'
import ComplexCurrentCatOwnerDisplayPrompt from './complex/catOwner/CurrentCatOwnerDisplayPrompt.svelte'
import ComplexLivingSpaceConfig from './complex/livingSpace/LivingSpaceConfig.svelte'
import ComplexLivingSpacePrompt from './complex/livingSpace/LivingSpacePrompt.svelte'
import ComplexLivingSpaceDisplayPrompt from './complex/livingSpace/LivingSpaceDisplayPrompt.svelte'
import ComplexOwnerCatAllergyPrompt from './complex/catOwner/OwnerCatAllergyPrompt.svelte'
import ComplexOwnerCatAllergyDisplayPrompt from './complex/catOwner/OwnerCatAllergyDisplayPrompt.svelte'
import ComplexOwnerCatMicrochipServicePrompt from './complex/catOwner/OwnerCatMicrochipServicePrompt.svelte'
import ComplexOwnerCatMicrochipServiceDisplayPrompt from './complex/catOwner/OwnerCatMicrochipServiceDisplayPrompt.svelte'
import ComplexChildrenConfig from './complex/children/ChildrenConfig.svelte'
import ComplexChildrenPrompt from './complex/children/ChildrenPrompt.svelte'
import ComplexChildrenDisplayPrompt from './complex/children/ChildrenDisplayPrompt.svelte'

const { appName, applicantDashboardIntroHeader, applicantDashboardIntroDetail, applicantDashboardRecentDays, programs, requirements, prompts } = configureDemoInstanceParams()

export const uiRegistry = new UIRegistry({
  appName,
  applicantDashboardIntroHeader,
  applicantDashboardIntroDetail,
  applicantDashboardRecentDays,
  programs,
  requirements,
  prompts
})

function configureDemoInstanceParams () {
  /**
   * So here's a fun hack. PUBLIC_DEMO_INSTANCE is one of our environment variables, but we
   * have a bit of a custom system for injecting environment at startup time rather than build time.
   *
   * So at build time, PUBLIC_DEMO_INSTANCE is set to '$PUBLIC_DEMO_INSTANCE' (literally). At container
   * startup, our apply-env.sh script replaces that with the actual value we want.
   *
   * The catch is, vite/rollup looks for dead code during build, and at build, it can clearly see that
   * PUBLIC_DEMO_INSTANCE is a constant string '$PUBLIC_DEMO_INSTANCE', so any conditional branches
   * depending on its value are optimized away. To avoid that, we do a little string manipulation
   * here to prevent vite/rollup from being able to tell what the value is at build time.
   */
  let tmpDemoInstance = PUBLIC_DEMO_INSTANCE + ' '
  tmpDemoInstance = tmpDemoInstance.trim()
  if (tmpDemoInstance === 'simple') {
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
  } else if (tmpDemoInstance === 'multi') { // TODO - Update one spec for multi complete, currently mirror demo
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
  } else if (tmpDemoInstance === 'complex') {
    return {
      appName: 'Pet lover',
      applicantDashboardIntroHeader: 'Keep your love of pets alive!',
      applicantDashboardIntroDetail: 'Submitting an application is the first step in making the life of a pet better! Based on your responses you will receive a list of "eligible benefits."',
      applicantDashboardRecentDays: 30,
      programs: [{ key: 'adopt_a_dog_program', icon: DogWalker },
        { key: 'adopt_a_cat_program', icon: PedestrianFamily },
        /** TOOD: Blocked pending a fix to UI to support shared qual type req per program
        */ { key: 'foster_a_pet_program', icon: Gamification }
      ],
      requirements: [
        { key: 'state_residence_prequal_req', configureComponent: ComplexResidenceConfig },
        { key: 'petowner_prequal_req' },
        { key: 'previous_dogwowner_qual_req' },
        { key: 'current_dogowner_qual_req', configureComponent: ComplexCurrentDogConfig },
        { key: 'yard_qual_req', configureComponent: ComplexYardConfig },
        { key: 'owner_dog_allergy_qual_req' },
        { key: 'dog_exercise_qual_req', configureComponent: ComplexDogExerciseConfig },
        { key: 'previous_catowner_qual_req' },
        { key: 'current_catowner_qual_req', configureComponent: ComplexCurrentCatConfig },
        { key: 'living_space_qual_req', configureComponent: ComplexLivingSpaceConfig },
        { key: 'owner_cat_allergy_qual_req' },
        { key: 'owner_cat_microchip_servive_qual_req' },
        { key: 'children_qual_req', configureComponent: ComplexChildrenConfig }
      ],
      prompts: [
        { key: 'state_residence_prompt', formComponent: ComplexResidencePrompt, displayComponent: ComplexResidenceDisplayPrompt },
        { key: 'petowner_prompt', formComponent: ComplexPetOwnerPrompt, displayComponent: ComplexPetOwnerDisplayPrompt },
        { key: 'previous_dogowner_prompt', formComponent: ComplexPreviousDogOwnerPrompt, displayComponent: ComplexPreviousDogOwnerDisplayPrompt },
        { key: 'current_dogowner_prompt', formComponent: ComplexCurrentDogOwnerPrompt, displayComponent: ComplexCurrentDogOwnerDisplayPrompt },
        { key: 'yard_prompt', formComponent: ComplexYardPrompt, displayComponent: ComplexYardDisplayPrompt },
        { key: 'owner_dog_allergy_prompt', formComponent: ComplexOwnerDogAllergyPrompt, displayComponent: ComplexOwnerDogAllergyDisplayPrompt },
        { key: 'dog_exercise_prompt', formComponent: ComplexDogExercisePrompt, displayComponent: ComplexDogExerciseDisplayPrompt },
        { key: 'previous_catowner_prompt', formComponent: ComplexPreviousCatOwnerPrompt, displayComponent: ComplexPreviousCatOwnerDisplayPrompt },
        { key: 'current_catowner_prompt', formComponent: ComplexCurrentCatOwnerPrompt, displayComponent: ComplexCurrentCatOwnerDisplayPrompt },
        { key: 'living_space_prompt', formComponent: ComplexLivingSpacePrompt, displayComponent: ComplexLivingSpaceDisplayPrompt },
        { key: 'owner_cat_allergy_prompt', formComponent: ComplexOwnerCatAllergyPrompt, displayComponent: ComplexOwnerCatAllergyDisplayPrompt },
        { key: 'owner_cat_microchip_service_prompt', formComponent: ComplexOwnerCatMicrochipServicePrompt, displayComponent: ComplexOwnerCatMicrochipServiceDisplayPrompt },
        { key: 'children_prompt', formComponent: ComplexChildrenPrompt, displayComponent: ComplexChildrenDisplayPrompt }
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
