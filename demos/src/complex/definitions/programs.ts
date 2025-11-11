import type { ProgramDefinition } from '@reqquest/api'

export const adopt_a_dog_program: ProgramDefinition = {
  key: 'adopt_a_dog_program',
  title: 'Adopt a Dog',
  requirementKeys: [
    'state_residence_prequal_req',
    'petowner_prequal_req',
    'previous_dogowner_qual_req',
    'current_dogowner_qual_req',
    'yard_qual_req',
    'owner_dog_allergy_qual_req',
    'dog_exercise_qual_req',
    'terms_and_conditions_post_qual_req',
    'review_applicant_dog_info_app_req'
  ]
}

export const adopt_a_cat_program: ProgramDefinition = {
  key: 'adopt_a_cat_program',
  title: 'Adopt a Cat',
  requirementKeys: [    
    'state_residence_prequal_req',
    'petowner_prequal_req',
    'previous_catowner_qual_req',
    'current_catowner_qual_req', 
    'living_space_qual_req',
    'owner_cat_allergy_qual_req',
    'owner_cat_microchip_service_qual_req',
     'terms_and_conditions_post_qual_req',
    'review_applicant_cat_info_app_req'
  ]
}

export const foster_a_pet_program: ProgramDefinition = {
  key: 'foster_a_pet_program',
  title: 'Foster a Pet',
  requirementKeys: [
    'state_residence_prequal_req',
    'petowner_prequal_req',
    'previous_dogowner_qual_req',
    'previous_catowner_qual_req',
    'yard_qual_req',
    'living_space_qual_req',
    'children_qual_req',
    'terms_and_conditions_post_qual_req',
    'owner_cat_allergy_qual_req',
    'owner_cat_microchip_service_qual_req',
    'owner_dog_allergy_qual_req',
    'dog_exercise_qual_req',
    'review_applicant_dog_info_app_req',
    'review_applicant_cat_info_app_req',
    'review_applicant_foster_a_pet_info_app_req'
  ]
}
