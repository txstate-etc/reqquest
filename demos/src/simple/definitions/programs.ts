import type { ProgramDefinition } from '@reqquest/api'

const adopt_a_pet_program: ProgramDefinition = {
  title: 'Adopt a Pet',
  requirementKeys: [
    'state_residence_req',
    'step1_post_residence_req',
    'step3_post_residence_req',
    'id_type_req',
    'state_residence_confirmation_req'
  ]
}

const thanks_or_no_thanks_program: ProgramDefinition = {
  title: 'Thanks or No Thanks Program',
  requirementKeys: [
    'thanks_or_no_thanks_req'
  ]
}

/**
 * Declared order is preserved and is meaningful. Do not convert this to `import * as` - a module
 * namespace iterates alphabetically rather than in declared order, and RQServer.start rejects one.
 */
export const simplePrograms = {
  adopt_a_pet_program,
  thanks_or_no_thanks_program
}
