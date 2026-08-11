import type { ProgramDefinition } from '@reqquest/api'
import { other_cats_reviewer_req } from './requirements/cat.requirements.js'

const adopt_a_dog_program: ProgramDefinition = {
  key: 'adopt_a_dog_program',
  title: 'Adopt a Dog',
  applicantDescription: 'Matches you with a shelter dog looking for a forever home.',
  ineligibleDescription: 'Adopting a dog requires living in an eligible state and having a yard and living space large enough for the dog, plus a commitment to regular exercise.',
  requirementKeys: [
    'which_state_req',
    'have_big_yard_req',
    'have_adequate_personal_space_req',
    'must_exercise_your_dog_req'
  ]
}

const adopt_a_cat_program: ProgramDefinition = {
  key: 'adopt_a_cat_program',
  title: 'Adopt a Cat',
  applicantDescription: 'Matches you with a shelter cat looking for a forever home.',
  ineligibleDescription: 'Adopting a cat requires living in an eligible state, owning a cat tower, being tolerant of tuna, and introducing any cats already in your home.',
  requirementKeys: [
    'which_state_req',
    'have_a_cat_tower_req',
    'other_cats_applicant_req',
    other_cats_reviewer_req.key,
    'not_allergic_to_tuna_req',
    'applicant_seems_nice_req'
  ]
}

export const defaultPrograms = [
  adopt_a_dog_program,
  adopt_a_cat_program
]
