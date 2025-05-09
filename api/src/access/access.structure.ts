import { programRegistry, promptRegistry, requirementRegistry } from '../internal.js'

export interface TagDefinition {
  /**
   * The actual tag that will be used to limit the grant.
   * This should be a stable string and unique within its category.
   */
  value: string
  /**
   * A human readable name for the tag that will be shown to the admin when creating a grant. Does
   * not need to be stable, but should be unique within the subjectType.
   */
  label?: string
}

export interface TagLabels {
  categoryLabel: string
  tagLabel: string
}

export interface TagCategoryDefinition {
  /**
   * The key for the tag category. This should be a stable string and unique within its subjectType.
   */
  category: string

  /**
   * A human readable name for the tag category that will be shown to the admin when creating a grant.
   * Does not need to be stable, but should be unique within the subjectType.
   */
  label: string

  /**
   * A description of the tag category to be shown to the admin when creating a grant.
   */
  description?: string

  /**
   * This controls whether the tag category is a small or large list of possible tags.
   * If notListable is false, we assume there are a finite number of tags, and the admin will be
   * able to select from a dropdown.
   *
   * If notListable is true, we assume there are too many tags to list, and the admin will be
   * able to search for them instead.
   */
  notListable?: boolean

  /**
   * This function should return a list of all possible tags in this category, so that the admin
   * can select from them. If notListable is true, this function should accept the search parameter
   * and return a list of tags that match the search. If notListable is false, this function should
   * return all tags in the category.
   */
  getTags?: (search?: string) => TagDefinition[] | Promise<TagDefinition[]>

  /**
   * This function should return a tag label for the given category and value. This is used to
   * display the tags on a saved grant or generated from a tagging target like an AppRequest.
   *
   * It may be called many times in parallel so it should be dataloaded or cached if possible.
   *
   * If notListable is false you don't need to provide this, as the getTags function can be
   * used to get the label.
   */
  getLabel?: (value: string) => string | Promise<string>
}

export interface ControlDefinition {
  description: string
}

/**
 * This interface defines the structure of a subjectType. It defines the controls
 * and tags that are relevant to the subjectType.
 */
export interface SubjectTypeDefinition {
  description?: string
  tags?: TagCategoryDefinition[]
  controls: Record<string, ControlDefinition>
}

export function initAccess () {
  const appRequestTags: TagCategoryDefinition[] = []

  const programTags = (description?: string) => ({
    category: 'program',
    label: 'Program',
    description: description ?? 'Limit this grant to the following programs.',
    getTags: () => programRegistry.list().map(program => ({ value: program.key, label: program.title }))
  })
  const requirementTags = (description?: string) => ({
    category: 'requirement',
    label: 'Requirement',
    description: description ?? 'Limit this grant to the following requirements.',
    getTags: () => requirementRegistry.list().map(requirement => ({ value: requirement.key, label: requirement.title }))
  })
  const promptTags = (description?: string) => ({
    category: 'prompt',
    label: 'Prompt',
    description: description ?? 'Limit this grant to the following prompts.',
    getTags: () => promptRegistry.list().map(prompt => ({ value: prompt.key, label: prompt.title }))
  })
  subjectTypes.Application = {
    tags: [programTags(), ...appRequestTags],
    controls: {
      view: { description: 'View application as a reviewer in an AppRequest.' }
    }
  }
  subjectTypes.ApplicationRequirement = {
    tags: [programTags(), ...appRequestTags],
    controls: {
      view: { description: 'View requirement status in an AppRequest. You still need AppRequest.review to see the reviewer interface at all.' }
    }
  }
  subjectTypes.AppRequest = {
    description: 'These controls govern the overall lifecycle of an App Request, like creating, submitting, and closing. See PromptAnswer, ApplicationRequirement, and Application for some additional controls governing the reviewer interface of an App Request.',
    tags: appRequestTags,
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
      review_own: { description: 'Must have review_own to see your own appRequests in the reviewer UI and/or update ANY reviewer-only prompt data, in addition to having appropriate permission on the Prompt subjectType.' },
      offer: { description: 'Close out a review and make an offer to the applicant. This only applies when there is at least one ACCEPTANCE requirement in the period.' },
      offer_own: { description: 'Close out the review on one\'s own appRequest and make an offer to oneself. This only applies when there is at least one ACCEPTANCE requirement in the period.' }
    }
  }
  subjectTypes.Period = {
    controls: {
      view: { description: 'View the period management interface and see all the periods.' },
      view_configuration: { description: 'View the configuration management interface for a period.' },
      create: { description: 'Create new periods.' },
      update: { description: 'Update existing periods.' },
      delete: { description: 'Delete existing periods.' }
    }
  }
  subjectTypes.Program = {
    tags: [programTags()],
    controls: {
      view: { description: 'See the current configuration for this program.' },
      configure: { description: 'Configure the way that a program works for all appRequests in a given period. The period must be eligible.' },
      disable: { description: 'Disable/Enable a program for all appRequests in a given period. The period must be eligible.' }
    }
  }
  subjectTypes.Prompt = {
    tags: [promptTags(), programTags('Limit to prompts that are used within certain programs.'), requirementTags('Limit to prompts that are used within certain requirements.')],
    controls: {
      view: { description: 'View the configuration management interface and see prompt configuration data.' },
      configure: { description: 'Configure the way that a prompt works for all appRequests.' }
    }
  }
  subjectTypes.PromptAnswer = {
    tags: [promptTags(), programTags('Limit to prompts that are used within certain programs.'), requirementTags('Limit to prompts that are used within certain requirements.'), ...appRequestTags],
    controls: {
      view: { description: 'View prompt data as a reviewer in an AppRequest.' },
      update: { description: 'Update any individual appRequest\'s prompt data.' },
      update_anytime: { description: 'Update this prompt as a reviewer even if the appRequest is in the applicant or pre-review phase.' }
    }
  }
  subjectTypes.Requirement = {
    tags: [requirementTags(), programTags('Limit to requirements that are used within certain programs.')],
    controls: {
      view: { description: 'View requirement configuration data.' },
      configure: { description: 'Configure the way that a requirement works for all appRequests.' },
      disable: { description: 'Disable/Enable a requirement for all appRequests in a given period. The period must be eligible.' }
    }
  }
  subjectTypes.Role = {
    controls: {
      view: { description: 'View the role management interface and see all the roles.' },
      create: { description: 'Create new roles.' },
      update: { description: 'Update existing roles.' },
      delete: { description: 'Delete existing roles.' }
    }
  }
}

export const subjectTypes: Record<string, SubjectTypeDefinition> = {}
