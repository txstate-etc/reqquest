import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { PeriodProgramRow, ProgramDefinitionProcessed, programRegistry } from '../internal.js'

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
