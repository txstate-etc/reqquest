import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { PeriodProgramRow, ProgramDefinitionProcessed, programRegistry, ReviewSection } from '../internal.js'

@ObjectType()
export class Program {
  constructor (public definition: ProgramDefinitionProcessed) {
    this.key = definition.key
    this.title = definition.title
    this.navTitle = definition.navTitle ?? definition.title
    this.applicantDescription = definition.applicantDescription
    this.eligibilityDescription = definition.eligibilityDescription
    this.authorizationKeys = { program: [this.key] }
  }

  @Field(type => ID)
  key: string

  @Field()
  title: string

  @Field()
  navTitle: string

  @Field({ nullable: true, description: 'A brief description of the program, written for applicants.' })
  applicantDescription?: string

  @Field({ nullable: true, description: 'A prose summary of the applicant-side requirements of the program. Intended to be shown to applicants who become ineligible before submission, since they may never have seen the program\'s prompts.' })
  eligibilityDescription?: string

  authorizationKeys: Record<string, string[]>
}

export enum ReviewDefaultSection {
  GENERAL = 'GENERAL',
  PROGRAM = 'PROGRAM',
  REVIEWER = 'REVIEWER',
  ACCEPTANCE = 'ACCEPTANCE'
}
registerEnumType(ReviewDefaultSection, {
  name: 'ReviewDefaultSection',
  description: 'The panels the reviewer screen renders by default, grouped by requirement type. A program\'s reviewSections may place any of them by name.',
  valuesConfig: {
    GENERAL: { description: '"General Questions" - PREQUAL requirements not placed in a custom panel.' },
    PROGRAM: { description: 'The panel titled with the program name - QUALIFICATION and POSTQUAL requirements not placed in a custom panel.' },
    REVIEWER: { description: '"Reviewer Questions" - PREAPPROVAL and APPROVAL requirements not placed in a custom panel.' },
    ACCEPTANCE: { description: '"Acceptance" - ACCEPTANCE requirements not placed in a custom panel.' }
  }
})

@ObjectType({ description: 'One panel of the reviewer screen, from the program definition\'s reviewSections. Exactly one shape is populated: a custom panel (title + requirementKeys), a workflow-stage panel (workflowStageKey), or a default panel (section). Panels not listed trail in the default order.' })
export class ProgramReviewSection {
  constructor (entry: ReviewSection) {
    if ('requirementKeys' in entry) {
      this.title = entry.title
      this.requirementKeys = entry.requirementKeys
    } else if ('workflowStage' in entry) {
      this.workflowStageKey = entry.workflowStage
    } else {
      this.section = entry.section as ReviewDefaultSection
    }
  }

  @Field({ nullable: true, description: 'Custom panel: its title.' })
  title?: string

  @Field(type => [String], { nullable: true, description: 'Custom panel: the requirements it shows, in display order. Requirements disabled in the period are simply absent from the application and should be skipped.' })
  requirementKeys?: string[]

  @Field({ nullable: true, description: 'Workflow-stage panel: the stage key.' })
  workflowStageKey?: string

  @Field(type => ReviewDefaultSection, { nullable: true, description: 'Default panel: which one.' })
  section?: ReviewDefaultSection
}

@InputType({ description: 'Identifies a single PeriodProgram.' })
export class PeriodProgramKey {
  @Field()
  periodId!: string

  @Field()
  programKey!: string
}

@InputType()
export class ProgramFilters {
  @Field(() => [String], { nullable: true })
  keys?: string[]
}

@ObjectType()
export class PeriodProgram extends Program {
  constructor (row: PeriodProgramRow) {
    super(programRegistry.get(row.programKey))
    this.enabled = !row.disabled
    this.periodId = String(row.periodId)
  }

  @Field({ description: 'Whether the program is enabled in this period. This is set by the system administrator.' })
  enabled: boolean

  periodId: string
}

@InputType()
export class PeriodProgramFilters {
  @Field(() => [String], { nullable: true })
  keys?: string[]

  @Field(() => [ID], { nullable: true })
  periodIds?: string[]

  periodKeys?: { periodId: string, key: string }[]
}

@ObjectType()
export class PeriodProgramActions {}

@InputType()
export class WorkflowStageFilters {
  @Field(() => [String], { nullable: true })
  workflowIds?: { periodId: string, programKey: string, workflowKey: string }[]

  @Field(() => [ID], { nullable: true })
  periodIds?: string[]

  @Field(() => [String], { nullable: true })
  workflowKeys?: string[]

  @Field(() => Boolean, { nullable: true })
  hasEnabledRequirements?: boolean

  @Field(() => Boolean, { nullable: true })
  blocking?: boolean

  @Field(() => [PeriodProgramKey], { nullable: true })
  periodIdProgramKeys?: { periodId: string, programKey: string }[]
}
