import type { ProgramDefinition } from '@reqquest/api'

export const adopt_a_pet_program: ProgramDefinition = {
  key: 'adopt_a_pet_program',
  title: 'Adopt a Pet',
  requirementKeys: [
    'state_residence_req',
    'step1_post_residence_req',
    'step3_post_residence_req',
    'state_residence_confirmation_req'
  ]
}
