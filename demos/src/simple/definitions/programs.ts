import type { ProgramDefinition } from '@reqquest/api'

export const adopt_a_pet_program: ProgramDefinition = {
  key: 'adopt_a_pet_program',
  title: 'Adopt a Pet',
  requirementKeys: [
    'state_residence_req',
    'step1_post_residence_req',
    'step3_post_residence_req',
    'id_type_req',
    'state_residence_confirmation_req'
  ]
}

export const dont_want_this_Program: ProgramDefinition = {
  key: 'thanks_or_not_thanks_Program',
  title: 'Thanks or No Thanks Program',
  requirementKeys: [
    'thanks_or_no_thanks_req'
  ]
}
