import type { ProgramDefinition } from '@reqquest/api'

const adopt_a_dog_program: ProgramDefinition = {
  title: 'Adopt a Dog',
  applicantDescription: 'Matches you with a shelter dog looking for a forever home.',
  eligibilityDescription: 'Adopting a dog requires living in an eligible state and having a yard and living space large enough for the dog, plus a commitment to regular exercise.',
  requirementKeys: [
    'which_state_req',
    'have_big_yard_req',
    'have_adequate_personal_space_req',
    'must_exercise_your_dog_req'
  ]
}

const cat_program_with_legacy_key: ProgramDefinition = {
  key: 'adopt_a_cat_program',
  title: 'Adopt a Cat',
  applicantDescription: 'Matches you with a shelter cat looking for a forever home.',
  eligibilityDescription: 'Adopting a cat requires living in an eligible state, owning a cat tower, being tolerant of tuna, and introducing any cats already in your home.',
  requirementKeys: [
    'which_state_req',
    'have_a_cat_tower_req',
    'other_cats_applicant_req',
    'other_cats_reviewer_req',
    'not_allergic_to_tuna_req',
    'applicant_seems_nice_req'
  ]
}

/**
 * Declared order is preserved and is meaningful. Do not convert this to `import * as` - a module
 * namespace iterates alphabetically rather than in declared order, and RQServer.start rejects one.
 */
export const defaultPrograms = {
  adopt_a_dog_program,
  cat_program_with_legacy_key
}
