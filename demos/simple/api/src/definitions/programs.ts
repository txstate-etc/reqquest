import type { ProgramDefinition } from '@reqquest/api'
import { other_cats_reviewer_req } from './requirements/cat.requirements.js'

export const adopt_a_dog_program: ProgramDefinition = {
  key: 'adopt_a_pet',
  title: 'Adopt a Pet',
  requirementKeys: [
    'tx_resident_req',
    'homeowner_req'
  ]
}
