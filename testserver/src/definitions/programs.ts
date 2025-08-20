import type { ProgramDefinition } from '@reqquest/api'
import { other_cats_reviewer_req } from './cat.js'

export const adopt_a_dog_program: ProgramDefinition = {
  key: 'adopt_a_dog_program',
  title: 'Adopt a Dog',
  requirementKeys: [
    'which_state_req',
    'have_big_yard_req',
    'have_adequate_personal_space_req',
    'must_exercise_your_dog_req'
  ]
}

export const adopt_a_cat_program: ProgramDefinition = {
  key: 'adopt_a_cat_program',
  title: 'Adopt a Cat',
  requirementKeys: [
    'have_a_cat_tower_req',
    'not_allergic_to_tuna_req',
    'other_cats_applicant_req',
    'applicant_seems_nice_req',
    other_cats_reviewer_req.key
  ]
}
