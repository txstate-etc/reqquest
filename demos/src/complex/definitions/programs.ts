import type { ProgramDefinition } from '@reqquest/api'

export const adopt_a_dog_program: ProgramDefinition = {
  key: 'adopt_a_dog_program',
  title: 'Adopt a Dog',
  requirementKeys: [
    'state_residence_req' 
  ]
}

export const adopt_a_cat_program: ProgramDefinition = {
  key: 'adopt_a_cat_program',
  title: 'Adopt a Cat',
  requirementKeys: [    
    'state_residence_req' 
  ]
}

export const foster_a_pet_program: ProgramDefinition = {
  key: 'foster_a_pet_program',
  title: 'Foster a Pet',
  requirementKeys: [
    'state_residence_req'    
  ]
}

export const senior_pet_program: ProgramDefinition = {
  key: 'senior_pet_program',
  title: 'Adopt a senior pet',
  requirementKeys: [
    'state_residence_req'    
  ]
}