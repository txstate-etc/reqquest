import type { ProgramDefinition } from '@txstate-mws/reqquest'

export const adopt_a_dog_program: ProgramDefinition = {
  key: 'adopt_a_dog_program',
  title: 'Adopt a Dog',
  requirementKeys: [
    'have_big_yard_req',
    'have_adequate_personal_space_req'
  ]
}
