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
import Step1PostResidencePrompt from './simple/Step1PostResidencePrompt.svelte'
import Step1PostResidencePromptDisplay from './simple/Step1PostResidencePromptDisplay.svelte'
import Step2PostResidencePrompt from './simple/Step2PostResidencePrompt.svelte'
import Step2PostResidencePromptDisplay from './simple/Step2PostResidencePromptDisplay.svelte'
import Step3PostResidencePrompt from './simple/Step3PostResidencePrompt.svelte'
import Step3PostResidencePromptDisplay from './simple/Step3PostResidencePromptDisplay.svelte'
import ThanksOrNoThanksPrompt from './simple/ThanksOrNoThanksPrompt.svelte'
import ThanksOrNoThanksPromptDisplay from './simple/ThanksOrNoThanksPromptDisplay.svelte'
import IDValuesPrompt from './simple/IDValuesPrompt.svelte'
import IDValuesPromptDisplay from './simple/IDValuesPromptDisplay.svelte'
import IDValuesExtraDataPrompt from './simple/IDValuesExtraDataPrompt.svelte'
import IDValuesExtraDataPromptDisplay from './simple/IDValuesExtraDataPromptDisplay.svelte'
import SSNValuePrompt from './simple/SSNValuePrompt.svelte'
import SSNValuePromptDisplay from './simple/SSNValuePromptDisplay.svelte'

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
import ComplexReviewApplicantResidenceInfoPrompt from './complex/residence/ReviewApplicantResidenceInfoPrompt.svelte'
import ComplexReviewApplicantResidenceInfoPromptDisplay from './complex/residence/ReviewApplicantResidenceInfoPromptDisplay.svelte'
import ComplexReviewApplicantCatInfoPrompt from './complex/catOwner/ReviewApplicantCatInfoPrompt.svelte'
import ComplexReviewApplicantCatInfoPromptDisplay from './complex/catOwner/ReviewApplicantCatInfoPromptDisplay.svelte'
import ComplexReviewApplicantDogInfoPrompt from './complex/dogOwner/ReviewApplicantDogInfoPrompt.svelte'
import ComplexReviewApplicantDogInfoPromptDisplay from './complex/dogOwner/ReviewApplicantDogInfoPromptDisplay.svelte'
import ComplexReviewApplicantFosterAPetPrompt from './complex/petOwner/ReviewApplicantFosterAPetPrompt.svelte'
import ComplexReviewApplicantFosterAPetPromptDisplay from './complex/petOwner/ReviewApplicantFosterAPetPromptDisplay.svelte'
import ComplexTermsAndConditionsConfig from './complex/termsAndConditions/TermsAndConditionsConfig.svelte'
import ComplexTermsAndConditionsPrompt from './complex/termsAndConditions/TermsAndConditionsPrompt.svelte'
import ComplexTermsAndConditionsPromptDisplay from './complex/termsAndConditions/TermsAndConditionsPromptDisplay.svelte'
import ComplexApproveReviewerExerciseExemptionConfig from './complex/dogOwner/ApproveReviewerExerciseExemptionConfig.svelte'
import ComplexApproveReviewerExerciseExemptionPrompt from './complex/dogOwner/ApproveReviewerExerciseExemptionPrompt.svelte'
import ComplexApproveReviewerExerciseExemptionPromptDisplay from './complex/dogOwner/ApproveReviewerExerciseExemptionPromptDisplay.svelte'
import ComplexPreviousDogSurrenderPrompt from './complex/dogOwner/PreviousDogSurrenderPrompt.svelte'
import ComplexPreviousDogSurrenderDisplayPrompt from './complex/dogOwner/PreviousDogSurrenderDisplayPrompt.svelte'
import ComplexBridgeOfDeathPrompt from './complex/optional/BridgeOfDeathPrompt.svelte'
import ComplexBridgeOfDeathDisplayPrompt from './complex/optional/BridgeOfDeathDisplayPrompt.svelte'
import ComplexReviewMovieLoverPrompt from './complex/optional/ReviewMovieLoverPrompt.svelte'
import ComplexReviewMovieLoverDisplayPrompt from './complex/optional/ReviewMovieLoverDisplayPrompt.svelte'
import ComplexAcceptCatPrompt from './complex/catOwner/AcceptCatPrompt.svelte'
import ComplexAcceptCatDisplayPrompt from './complex/catOwner/AcceptCatDisplayPrompt.svelte'
import ComplexAcceptDogPrompt from './complex/dogOwner/AcceptDogPrompt.svelte'
import ComplexAcceptDogDisplayPrompt from './complex/dogOwner/AcceptDogDisplayPrompt.svelte'
import ComplexAcceptFosterPetPrompt from './complex/petOwner/AcceptFosterPetPrompt.svelte'
import ComplexAcceptFosterPetDisplayPrompt from './complex/petOwner/AcceptFosterPetDisplayPrompt.svelte'
import ComplexConfirmCatMircochipServicePrompt from './complex/catOwner/ConfirmCatMircochipServicePrompt.svelte'
import ComplexConfirmCatMircochipServiceDisplayPrompt from './complex/catOwner/ConfirmCatMircochipServiceDisplayPrompt.svelte'
import PreQualPrompt from './rc/PreQualPrompt.svelte'
import WrittenAutomatinoPrompt from './rc/WrittenAutomatinoPrompt.svelte'
import EvidenceWrittenAutomationPrompt from './rc/EvidenceWrittenAutomationPrompt.svelte'
import InvestigatedFutureCareerPrompt from './rc/InvestigatedFutureCareerPrompt.svelte'
import RateFutureCareerPrompt from './rc/RateFutureCareerPrompt.svelte'
import DataRelatedPuzzle from './rc/DataRelatedPuzzle.svelte'
import AssessDataRelatedPuzzle from './rc/AssessDataRelatedPuzzle.svelte'
import OutsideClassExample from './rc/OutsideClassExample.svelte'
import AssessOutsideClassExample from './rc/AssessOutsideClassExample.svelte'
import CriticalThinking from './rc/CriticalThinking.svelte'
import AssessCriticalThinking from './rc/AssessCriticalThinking.svelte'
import Communication from './rc/Communication.svelte'
import AssessCommunication from './rc/AssessCommunication.svelte'
import AssessAttentionDetail from './rc/AssessAttentionDetail.svelte'
import Organization from './rc/Organization.svelte'
import AssessOrganization from './rc/AssessOrganization.svelte'
import CommunicationDisplay from './rc/CommunicationDisplay.svelte'
import TechnicalTroubleshooting from './rc/TechnicalTroubleshooting.svelte'
import AssessTechnicalTroubleshooting from './rc/AssessTechnicalTroubleshooting.svelte'
import SupportCommunication from './rc/SupportCommunication.svelte'
import AssessSupportCommunication from './rc/AssessSupportCommunication.svelte'
import MaintainSysDocumentation from './rc/MaintainSysDocumentation.svelte'
import AssessMaintainSysDocumentation from './rc/AssessMaintainSysDocumentation.svelte'
import ReccomendationLetter from './rc/ReccomendationLetter.svelte'
import AssessReccomendationLetter from './rc/AssessReccomendationLetter.svelte'
import PreQualDisplay from './rc/PreQualDisplay.svelte'
import WrittenAutomationDisplay from './rc/WrittenAutomationDisplay.svelte'
import EvidenceWrittenAutomationDisplay from './rc/EvidenceWrittenAutomationDisplay.svelte'
import InvestigatedFutureCareerDisplay from './rc/InvestigatedFutureCareerDisplay.svelte'
import RateFutureCareerDisplay from './rc/RateFutureCareerDisplay.svelte'
import AssessDataRelatedPuzzleDisplay from './rc/AssessDataRelatedPuzzleDisplay.svelte'
import OutsideClassExampleDisplay from './rc/OutsideClassExampleDisplay.svelte'
import AssessOutsideClassExampleDisplay from './rc/AssessOutsideClassExampleDisplay.svelte'
import CriticalThinkingDisplay from './rc/CriticalThinkingDisplay.svelte'
import AssessCriticalThinkingDisplay from './rc/AssessCriticalThinkingDisplay.svelte'
import AssessCommunicationDisplay from './rc/AssessCommunicationDisplay.svelte'
import AssessAttentionDetailDisplay from './rc/AssessAttentionDetailDisplay.svelte'
import OrganizationDisplay from './rc/OrganizationDisplay.svelte'
import AssessOrganizationDisplay from './rc/AssessOrganizationDisplay.svelte'
import TechnicalTroubleshootingDisplay from './rc/TechnicalTroubleshootingDisplay.svelte'
import AssessTechnicalTroubleshootingDisplay from './rc/AssessTechnicalTroubleshootingDisplay.svelte'
import SupportCommunicationDisplay from './rc/SupportCommunicationDisplay.svelte'
import AssessSupportCommunicationDisplay from './rc/AssessSupportCommunicationDisplay.svelte'
import MaintainSysDocumentationDisplay from './rc/MaintainSysDocumentationDisplay.svelte'
import AssessMaintainSysDocumentationDisplay from './rc/AssessMaintainSysDocumentationDisplay.svelte'
import ReccomendationLetterDisplay from './rc/ReccomendationLetterDisplay.svelte'
import AssessReccomendationLetterDisplay from './rc/AssessReccomendationLetterDisplay.svelte'
import DataRelatedPuzzleDisplay from './rc/DataRelatedPuzzleDisplay.svelte'

/** RC */

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
  let tmpDemoInstance = `${PUBLIC_DEMO_INSTANCE} `
  tmpDemoInstance = tmpDemoInstance.trim()
  if (tmpDemoInstance === 'simple') {
    return {
      appName: 'Adopt a Pet',
      applicantDashboardIntroHeader: 'Start your Pet Journey Here!',
      applicantDashboardIntroDetail: 'Submitting an adoption application is the first step in adopting a pet. Based on your responses you will receive a list of "eligible benefits."',
      applicantDashboardRecentDays: 30,
      programs: [{ key: 'adopt_a_pet_program', icon: DogWalker },
        { key: 'thanks_or_no_thanks_program', icon: Gamification }
      ],
      requirements: [
        { key: 'state_residence_req', configureComponent: ResidenceConfig },
        { key: 'state_residence_confirmation_req' },
        { key: 'step1_post_residence_req' },
        { key: 'step3_post_residence_req' },
        { key: 'id_type_req' }
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
      },
      {
        key: 'step1_post_residence_prompt',
        formComponent: Step1PostResidencePrompt,
        displayComponent: Step1PostResidencePromptDisplay
      },
      {
        key: 'step2_post_residence_prompt',
        formComponent: Step2PostResidencePrompt,
        displayComponent: Step2PostResidencePromptDisplay
      },
      {
        key: 'step3_post_residence_prompt',
        formComponent: Step3PostResidencePrompt,
        displayComponent: Step3PostResidencePromptDisplay
      },
      {
        key: 'thanks_or_no_thanks_prompt',
        formComponent: ThanksOrNoThanksPrompt,
        displayComponent: ThanksOrNoThanksPromptDisplay
      },
      {
        key: 'id_values_prompt',
        formComponent: IDValuesPrompt,
        displayComponent: IDValuesPromptDisplay
      },
      {
        key: 'id_values_extra_data_prompt',
        formComponent: IDValuesExtraDataPrompt,
        displayComponent: IDValuesExtraDataPromptDisplay
      },
      {
        key: 'ssn_value_prompt',
        formComponent: SSNValuePrompt,
        displayComponent: SSNValuePromptDisplay
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
        { key: 'foster_a_pet_program', icon: Gamification }
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
        { key: 'children_qual_req', configureComponent: ComplexChildrenConfig },
        { key: 'movie_lover_qual_req' },
        { key: 'terms_and_conditions_post_qual_req' },
        { key: 'review_applicant_state_residence_app_req' },
        { key: 'review_applicant_cat_info_app_req' },
        { key: 'review_applicant_dog_info_app_req' },
        { key: 'review_application_foster_a_pet_app_req' },
        { key: 'review_movie_lover_app_req' },
        { key: 'previous_dog_surrender_qual_req' },
        { key: 'previous_dog_surrender_foster_qual_req' },
        { key: 'approve_reviewer_exercise_exemption_workflow_req', configureComponent: ComplexApproveReviewerExerciseExemptionConfig },
        { key: 'accept_adopt_cat_req' },
        { key: 'accept_adopt_dog_req' },
        { key: 'accept_fost_pet_req' },
        { key: 'confirm_cat_microchip_service_workflow_req' }
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
        { key: 'children_prompt', formComponent: ComplexChildrenPrompt, displayComponent: ComplexChildrenDisplayPrompt },
        { key: 'bridge_of_death_prompt', formComponent: ComplexBridgeOfDeathPrompt, displayComponent: ComplexBridgeOfDeathDisplayPrompt },
        { key: 'review_applicant_state_residence_info_prompt', formComponent: ComplexReviewApplicantResidenceInfoPrompt, displayComponent: ComplexReviewApplicantResidenceInfoPromptDisplay },
        { key: 'review_applicant_cat_info_prompt', formComponent: ComplexReviewApplicantCatInfoPrompt, displayComponent: ComplexReviewApplicantCatInfoPromptDisplay },
        { key: 'review_applicant_dog_info_prompt', formComponent: ComplexReviewApplicantDogInfoPrompt, displayComponent: ComplexReviewApplicantDogInfoPromptDisplay },
        { key: 'review_applicant_foster_a_pet_info_prompt', formComponent: ComplexReviewApplicantFosterAPetPrompt, displayComponent: ComplexReviewApplicantFosterAPetPromptDisplay },
        { key: 'review_movie_lover_answers_prompt', formComponent: ComplexReviewMovieLoverPrompt, displayComponent: ComplexReviewMovieLoverDisplayPrompt },
        { key: 'terms_and_conditions_prompt', configureComponent: ComplexTermsAndConditionsConfig, formComponent: ComplexTermsAndConditionsPrompt, displayComponent: ComplexTermsAndConditionsPromptDisplay },
        { key: 'previous_dog_surrender_prompt', formComponent: ComplexPreviousDogSurrenderPrompt, displayComponent: ComplexPreviousDogSurrenderDisplayPrompt },
        { key: 'previous_dog_surrender_foster_prompt', formComponent: ComplexPreviousDogSurrenderPrompt, displayComponent: ComplexPreviousDogSurrenderDisplayPrompt },
        { key: 'approve_reviewer_exercise_exemption_prompt', formComponent: ComplexApproveReviewerExerciseExemptionPrompt, displayComponent: ComplexApproveReviewerExerciseExemptionPromptDisplay },
        { key: 'accept_cat_prompt', formComponent: ComplexAcceptCatPrompt, displayComponent: ComplexAcceptCatDisplayPrompt },
        { key: 'accept_dog_prompt', formComponent: ComplexAcceptDogPrompt, displayComponent: ComplexAcceptDogDisplayPrompt },
        { key: 'accept_foster_pet_prompt', formComponent: ComplexAcceptFosterPetPrompt, displayComponent: ComplexAcceptFosterPetDisplayPrompt },
        { key: 'confirm_cat_microchip_service_prompt', formComponent: ComplexConfirmCatMircochipServicePrompt, displayComponent: ComplexConfirmCatMircochipServiceDisplayPrompt }
      ]
    }
  } else if (tmpDemoInstance === 'rc') {
    return {
      appName: 'MWS Technical Mentorship Experience',
      applicantDashboardIntroHeader: 'Start your Pet Journey Here!',
      applicantDashboardIntroDetail: 'Submitting an adoption application is the first step in adopting a pet. Based on your responses you will receive a list of "eligible benefits."',
      applicantDashboardRecentDays: 30,
      programs: [
        { key: 'operations_infrastructure', icon: DogWalker },
        { key: 'software_development', icon: DogWalker },
        { key: 'project_management', icon: DogWalker },
        { key: 'application_management_support', icon: DogWalker }
      ],
      requirements: [
        { key: 'step1_prequal_req' },
        { key: 'written_automation_req' },
        { key: 'evidence_automation_req' },
        { key: 'investigated_future_career_req' },
        { key: 'rate_future_career_req' },
        { key: 'data_related_puzzle_req' },
        { key: 'assess_data_related_puzzle_req' },
        { key: 'outside_class_example_req' },
        { key: 'assess_outside_class_example_req' },
        { key: 'critical_thinking_req' },
        { key: 'assess_critical_thinking_req' },
        { key: 'communication_req' },
        { key: 'assess_communicationn_req' },
        { key: 'assess_attention_detail_req' },
        { key: 'organization_req' },
        { key: 'assess_organization_req' },
        { key: 'reccomendation_letter_req' },
        { key: 'assess_reccomendation_letter_req' }
      ],
      prompts: [{
        key: 'pre_qual_prompt',
        formComponent: PreQualPrompt,
        displayComponent: PreQualDisplay
      },
      {
        key: 'written_automation_prompt',
        formComponent: WrittenAutomatinoPrompt,
        displayComponent: WrittenAutomationDisplay
      },
      {
        key: 'evidence_automation_prompt',
        formComponent: EvidenceWrittenAutomationPrompt,
        displayComponent: EvidenceWrittenAutomationDisplay
      },
      {
        key: 'investigated_future_career_prompt',
        formComponent: InvestigatedFutureCareerPrompt,
        displayComponent: InvestigatedFutureCareerDisplay
      },
      {
        key: 'rate_future_career_prompt',
        formComponent: RateFutureCareerPrompt,
        displayComponent: RateFutureCareerDisplay
      },
      {
        key: 'data_related_puzzle_prompt',
        formComponent: DataRelatedPuzzle,
        displayComponent: DataRelatedPuzzleDisplay
      },
      {
        key: 'assess_data_related_puzzle_prompt',
        formComponent: AssessDataRelatedPuzzle,
        displayComponent: AssessDataRelatedPuzzleDisplay
      },
      {
        key: 'outside_class_example_prompt',
        formComponent: OutsideClassExample,
        displayComponent: OutsideClassExampleDisplay
      },
      {
        key: 'assess_outside_class_example_prompt',
        formComponent: AssessOutsideClassExample,
        displayComponent: AssessOutsideClassExampleDisplay
      },
      {
        key: 'critical_thinking_prompt',
        formComponent: CriticalThinking,
        displayComponent: CriticalThinkingDisplay
      },
      {
        key: 'assess_critical_thinking_prompt',
        formComponent: AssessCriticalThinking,
        displayComponent: AssessCriticalThinkingDisplay
      },
      {
        key: 'communication_prompt',
        formComponent: Communication,
        displayComponent: CommunicationDisplay
      },
      {
        key: 'assess_communication_prompt',
        formComponent: AssessCommunication,
        displayComponent: AssessCommunicationDisplay
      },
      {
        key: 'assess_attention_detail_prompt',
        formComponent: AssessAttentionDetail,
        displayComponent: AssessAttentionDetailDisplay
      },
      {
        key: 'organization_prompt',
        formComponent: Organization,
        displayComponent: OrganizationDisplay
      },
      {
        key: 'assess_organization_prompt',
        formComponent: AssessOrganization,
        displayComponent: AssessOrganizationDisplay
      },
      {
        key: 'technical_troubleshooting_prompt',
        formComponent: TechnicalTroubleshooting,
        displayComponent: TechnicalTroubleshootingDisplay
      },
      {
        key: 'assess_technical_troubleshooting_prompt',
        formComponent: AssessTechnicalTroubleshooting,
        displayComponent: AssessTechnicalTroubleshootingDisplay
      },
      {
        key: 'support_communication_prompt',
        formComponent: SupportCommunication,
        displayComponent: SupportCommunicationDisplay
      },
      {
        key: 'assess_support_communication_prompt',
        formComponent: AssessSupportCommunication,
        displayComponent: AssessSupportCommunicationDisplay
      },
      {
        key: 'maintain_sys_documentation_prompt',
        formComponent: MaintainSysDocumentation,
        displayComponent: MaintainSysDocumentationDisplay
      },
      {
        key: 'assess_maintain_sys_documentation_prompt',
        formComponent: AssessMaintainSysDocumentation,
        displayComponent: AssessMaintainSysDocumentationDisplay
      },
      {
        key: 'reccomendation_letter_prompt',
        formComponent: ReccomendationLetter,
        displayComponent: ReccomendationLetterDisplay
      },
      {
        key: 'assess_reccomendation_letter_prompt',
        formComponent: AssessReccomendationLetter,
        displayComponent: AssessReccomendationLetterDisplay
      }
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
