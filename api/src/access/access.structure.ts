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
  /**
   * This title will be shown in the role management UI and may be easier to read than
   * the name we store in the database.
   */
  title: string
  /**
   * Describe the set of controls that this subjectType has, to help administrators decide
   * which subjectType to choose when creating a grant.
   */
  description?: string
  tags?: TagCategoryDefinition[]
  controls: Record<string, ControlDefinition>
}

export function initAccess () {
  const appRequestTags: TagCategoryDefinition[] = promptRegistry.tagCategories.map(category => ({
    category: category.category,
    label: category.categoryLabel ?? category.category,
    description: category.description,
    notListable: category.notListable,
    getTags: async (search?: string) => await promptRegistry.getAllTags(category.category, search),
    getLabel: async (value: string) => await promptRegistry.getTagLabel(category.category, value)
  }))

  const programTags = (description?: string) => ({
    category: 'program',
    label: 'Program',
    description: description ?? 'Limit this grant to specific programs.',
    getTags: () => programRegistry.list().map(program => ({ value: program.key, label: program.title }))
  })
  const requirementTags = (description?: string) => ({
    category: 'requirement',
    label: 'Requirement',
    description: description ?? 'Limit this grant to specific requirements or the requirements associated with a program.',
    getTags: () => [
      ...programRegistry.list().map(program => ({ value: program.key, label: 'Program: ' + program.title })),
      ...requirementRegistry.list().map(requirement => ({ value: requirement.key, label: 'Requirement: ' + requirement.title }))
    ]
  })
  const promptTags = (description?: string) => ({
    category: 'prompt',
    label: 'Prompt',
    description: description ?? 'Limit this grant to specific prompts or the prompts associated with a requirement or program.',
    getTags: () => [
      ...programRegistry.list().map(program => ({ value: program.key, label: 'Program: ' + program.title })),
      ...requirementRegistry.list().map(requirement => ({ value: requirement.key, label: 'Requirement: ' + requirement.title })),
      ...promptRegistry.list().map(prompt => ({ value: prompt.key, label: 'Prompt: ' + prompt.title }))
    ]
  })
  subjectTypes.Application = {
    title: 'Reviewer - View Applications',
    tags: [programTags(), ...appRequestTags],
    controls: {
      view: { description: 'View application as a reviewer in an AppRequest.' }
    }
  }
  subjectTypes.ApplicationRequirement = {
    title: 'Reviewer - Requirement Statuses',
    tags: [requirementTags(), ...appRequestTags],
    controls: {
      view: { description: 'View requirement status in an AppRequest. You still need AppRequest.review to see the reviewer interface at all.' }
    }
  }
  subjectTypes.AppRequestOwn = {
    title: 'Applicant - Applicant Phase',
    description: 'These controls govern actions people take on their own appRequest during the applicant phase, like creating and cancelling. No restrictions are available because we need to complete the applicant phase in order to collect enough data to generate tags.',
    controls: {
      create: { description: 'Create an appRequest for oneself.' },
      cancel: { description: 'Cancel one\'s own appRequest while in the applicant phase.' },
      uncancel: { description: 'Re-open one\'s own appRequest that was cancelled in the applicant phase.' }
    }
  }
  subjectTypes.AppRequestOwnReview = {
    title: 'Applicant - Reviewer Phase',
    description: 'These controls govern actions people take on their own appRequest during the reviewer phase, like withdrawing and un-withdrawing.',
    controls: {
      withdraw: { description: 'Withdraw one\'s own appRequest while in the reviewer phase.' },
      unwithdraw: { description: 'Re-open any withdrawn appRequest (one that was cancelled while in the reviewer phase).' }
    },
    tags: appRequestTags
  }
  subjectTypes.AppRequest = {
    title: 'Reviewer - Review Phase',
    description: 'These controls govern the overall lifecycle of an App Request, like creating, submitting, and closing. See PromptAnswer, ApplicationRequirement, and Application for some additional controls governing the reviewer interface of an App Request.',
    tags: appRequestTags,
    controls: {
      submit: { description: 'Submit an appRequest when all requirements pass, even if you are not the applicant.' },
      close: { description: 'Close an appRequest despite it not being completed. It will not be marked as disqualified or ineligible, just closed. Viewing it would show it in exactly the state it was in when it was closed. The system will automatically close requests on the archive date, so you may not need to give this to anyone.' },
      reopen: { description: 'Reopen an appRequest that has been closed. Must be in a valid period.' },
      reopen_any: { description: 'Reopen any appRequest that has been closed, even in an old period or when it was cancelled by the applicant.' },
      return: { description: 'Return an appRequest in the reviewer phase to the applicant phase.' },
      review: { description: 'See an appRequest in the reviewer list interface.' },
      review_own: { description: 'Typically, reviewers are prevented from acting as reviewers on their own requests. This control removes that block, but the reviewer is still limited to the other controls they have been granted. For example, a reviewer who only has access to a single prompt still only has access to that single prompt, but may also update that prompt in their own request(s). Note that permissions from other roles will also be affected by the removal of this block, so use it carefully.' },
      offer: { description: 'Finish out a review and make an offer to the applicant. This only applies when there is at least one ACCEPTANCE requirement in the system/period.' }
    }
  }
  subjectTypes.AppRequestPreReview = {
    title: 'Reviewer - Applicant Phase',
    description: 'These are the App Request controls that relate to reviewers/admins taking action during the applicant phase instead of the review phase. No restrictions are available because we need to complete the applicant phase in order to collect enough data to generate tags.',
    controls: {
      create: { description: 'Create an appRequest on someone else\'s behalf.' },
      uncancel: { description: 'Re-open any appRequest that was cancelled in the applicant phase.' }
    }
  },
  subjectTypes.Period = {
    title: 'Admin - Manage Periods',
    controls: {
      view: { description: 'View the period management interface and see all the periods.' },
      view_configuration: { description: 'View the configuration management interface for a period.' },
      create: { description: 'Create new periods.' },
      update: { description: 'Update existing periods.' },
      delete: { description: 'Delete existing periods.' }
    }
  }
  subjectTypes.Program = {
    title: 'Admin - Configure Programs',
    tags: [programTags()],
    controls: {
      view: { description: 'See the current configuration for this program.' },
      configure: { description: 'Configure the way that a program works for all appRequests in a given period. The period must be eligible.' },
      disable: { description: 'Disable/Enable a program for all appRequests in a given period. The period must be eligible.' }
    }
  }
  subjectTypes.Prompt = {
    title: 'Admin - Configure Prompts',
    tags: [promptTags()],
    controls: {
      view: { description: 'View the configuration management interface and see prompt configuration data.' },
      configure: { description: 'Configure the way that a prompt works for all appRequests.' }
    }
  }
  subjectTypes.PromptAnswer = {
    title: 'Reviewer - View and Update Prompt Data',
    tags: [promptTags(), ...appRequestTags],
    controls: {
      view: { description: 'View prompt data as a reviewer in an AppRequest.' },
      update: { description: 'Update any individual appRequest\'s prompt data during the review phase.' },
      update_anytime: { description: 'Update this prompt as a reviewer even if the appRequest is not yet submitted or awaiting acceptance or pre-approval automations.' }
    }
  }
  subjectTypes.Requirement = {
    title: 'Admin - Configure Requirements',
    tags: [requirementTags(), programTags('Limit to requirements that are used within certain programs.')],
    controls: {
      view: { description: 'View requirement configuration data.' },
      configure: { description: 'Configure the way that a requirement works for all appRequests.' },
      disable: { description: 'Disable/Enable a requirement for all appRequests in a given period. The period must be eligible.' }
    }
  }
  subjectTypes.Role = {
    title: 'Admin - Manage Roles',
    controls: {
      view: { description: 'View the role management interface and see all the roles.' },
      create: { description: 'Create new roles.' },
      update: { description: 'Update existing roles.' },
      delete: { description: 'Delete existing roles.' }
    }
  }
}

export const subjectTypes: Record<string, SubjectTypeDefinition> = {}
