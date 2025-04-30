import { programRegistry, promptRegistry, requirementRegistry } from '../internal.js'

/**
 * A type that will be used to fill the dropdown for
 */
export interface SubjectDefinition {
  id: string
  /**
   * A name for the subject instance that will be shown to the admin when creating a grant.
   */
  name?: string
}

export interface TagDefinition {
  /**
   * The actual tag that will be used to limit the grant.
   * This should be a stable string and unique within its category.
   */
  tag: string
  /**
   * A human readable name for the tag that will be shown to the admin when creating a grant. Does
   * not need to be stable, but should be unique within the subjectType.
   */
  name: string
  /**
   * A stable category string that will be used to group tags together.
   *
   * This will be prepended to the tag in the database for namespacing.
   */
  category?: string
  /**
   * A label for the tag's category. This will be shown to the admin when creating a grant.
   * For example, if the tag is a state, the label could be "State". If the tag is a
   * department, the label could be "Department".
   *
   * The category should be stable, but the label can be changed at any time. Defaults to
   * the category name.
   */
  categoryLabel?: string
}

export interface ControlDefinition {
  description: string
  /**
   * Even though the control is on a subjectType, there may be another subjectType
   * that is affiliated with the activity in question.
   *
   * For example, the Prompt subjectType has an 'update' control, which permits updating an
   * AppRequest with that Prompt's data. Both subjectTypes (Prompt and AppRequest)
   * are in play here, but we only have an instance selector for Prompt.
   *
   * The solution is to provide a list of tags that are associated with the other type, in
   * this case AppRequest. Now we can grant permission to update a specific Prompt on a specific
   * AppRequest or set of AppRequests.
   *
   * Let's tie it all together with our pet adoption demo as an example. Say we have a "validate_yard"
   * prompt for reviewers to evaluate a photo of a back yard, and we want a special type of reviewer
   * that just looks at these photos all day and nothing else, and only in states where they are
   * licensed to do this evaluation.
   *
   * We would create a role for every state, and in each one create a grant on Prompt that selects
   * the "validate_yard" instance, and also selects "Texas" or "California" as a tag.
   *
   * Now when a reviewer gets licensed in a new state, we can add them to that state's role.
   *
   * This function should return a list of all possible tags that would be relevant to
   * this control, so that the admin can select from them. In the example above,
   * something like [{ tag: "Texas" }, { tag: "California" }, { tag: "New York" }] would be returned.
   */
  getAllTags?: (search?: string) => TagDefinition[] | Promise<TagDefinition[]>
  /**
   * Controls whether the tags are treated as finite or infinite. If searchable is true, we
   * assume there are too many tags to list, and the admin will be able to search for them instead.
   *
   * If searchable is false, we assume there are a finite number of tags, and the admin will be
   * able to select from a list of them.
   */
  searchable?: boolean
}

/**
 * This is the core subjectType definition. It's used for subjectTypes that do not
 * have any controls that apply to instances, or there are too many instances to
 * permission individually.
 *
 * Each control may still use tags to limit the scope of the grant.
 */
export interface SubjectTypeNoInstances {
  controls: Record<string, ControlDefinition>
}

/**
 * With this kind of subjectType, the admin will have a Multiselect that allows
 * them to search for instances of the subjectType. getInstances will be called
 * each time the user types in the search box, and should return a list of
 * instances that match the search.
 */
export interface SubjectTypeSearchableInstances extends SubjectTypeNoInstances {
  searchable: true
  getInstances: (search: string) => Promise<SubjectDefinition[]> | SubjectDefinition[]
  getInstance: (id: string) => Promise<SubjectDefinition> | SubjectDefinition
}

/**
 * With this kind of subjectType, the admin will have a Multiselect with predefined
 * instances of the subjectType. getInstances will be called once when the admin
 * opens the modal, and should return an exhaustive list of instances that are
 * available to select.
 */
export interface SubjectTypeFiniteInstances extends SubjectTypeNoInstances {
  searchable: false
  getInstances: () => Promise<SubjectDefinition[]> | SubjectDefinition[]
  getInstance: (id: string) => Promise<SubjectDefinition> | SubjectDefinition
}

export type SubjectTypeDefinition = SubjectTypeSearchableInstances | SubjectTypeNoInstances | SubjectTypeFiniteInstances

export const subjectTypes: Record<string, SubjectTypeDefinition> = {
  AppRequest: {
    controls: {
      close: { description: 'Close an appRequest despite it not being completed.' },
      cancel: { description: 'Cancel one\'s own appRequest while in the applicant phase.' },
      cancel_review: { description: 'Cancel one\'s own appRequest while in the reviewer phase.' },
      reopen: { description: 'Reopen anyone\'s appRequest that has been closed or cancelled. Must be in a valid period.' },
      reopen_own: { description: 'Reopen one\'s own appRequest that has been cancelled. Must be in a valid period.' },
      submit: { description: 'Submit anyone\'s appRequest when all requirements pass.' },
      submit_own: { description: 'Submit one\'s own appRequest when all requirements pass.' },
      return: { description: 'Return an appRequest in the reviewer phase to the applicant phase.' },
      return_own: { description: 'Return one\'s own appRequest to the applicant phase. Only available under certain conditions.' },
      create: { description: 'Create an appRequest for anyone.' },
      create_own: { description: 'Create an appRequest for oneself.' },
      review: { description: 'See appRequests in the reviewer interface.' },
      review_own: { description: 'Must have review_own to see your own appRequests in the reviewer UI and/or update ANY reviewer-only prompt data, in addition to having appropriate permission on the Prompt subjectType.' }
    }
  },
  Period: {
    controls: {
      view: { description: 'View the period management interface and see all the periods.' },
      create: { description: 'Create new periods.' },
      update: { description: 'Update existing periods.' },
      delete: { description: 'Delete existing periods.' }
    }
  },
  Program: {
    searchable: false,
    getInstances: () => programRegistry.list().map(program => ({ id: program.key, name: program.title })),
    controls: {
      view: { description: 'View the application for this program as a reviewer in an AppRequest.' },
      view_configuration: { description: 'View the configuration management interface and see program configuration data.' },
      configure: { description: 'Configure the way that a program works for all appRequests in a given period. The period must be eligible.' },
      disable: { description: 'Disable/Enable a program for all appRequests in a given period. The period must be eligible.' }
    }
  },
  Prompt: {
    searchable: false,
    getInstances: () => promptRegistry.list().map(prompt => ({ id: prompt.key, name: prompt.title })),
    getInstance: (id: string) => {
      const def = promptRegistry.get(id)
      return { id: def.key, name: def.title }
    },
    controls: {
      view: { description: 'View the prompt data for this prompt as a reviewer in an AppRequest.' },
      view_configuration: { description: 'View the configuration management interface and see prompt configuration data.' },
      update: { description: 'Update any individual appRequest\'s prompt data.' },
      configure: { description: 'Configure the way that a prompt works for all appRequests.' }
    }
  },
  Requirement: {
    searchable: false,
    getInstances: () => requirementRegistry.list().map(r => ({ id: r.key, name: r.title })),
    getInstance: (id: string) => {
      const def = requirementRegistry.get(id)
      return { id: def.key, name: def.title }
    },
    controls: {
      view: { description: 'View the requirement status for this requirement as a reviewer in an AppRequest.' },
      view_configuration: { description: 'View the configuration management interface and see requirement configuration data.' },
      configure: { description: 'Configure the way that a requirement works for all appRequests.' },
      disable: { description: 'Disable/Enable a requirement for all appRequests in a given period. The period must be eligible.' }
    }
  },
  Role: {
    controls: {
      view: { description: 'View the role management interface and see all the roles.' },
      create: { description: 'Create new roles.' },
      update: { description: 'Update existing roles.' },
      delete: { description: 'Delete existing roles.' }
    }
  }
}
