import type { ValidateFunction } from 'ajv'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { PeriodProgramRow, ProgramDefinitionProcessed, programRegistry, registryAjv } from '../internal.js'

/**
 * Per-period label overrides for a program, stored in `period_configurations` under the program's
 * key. Programs have no developer-defined configuration, so this shape is fixed. An empty object
 * means "use the titles from the code definition".
 *
 * Only labels live here, never identity: the key stays fixed in code, so renaming a program for a
 * period never orphans its applications.
 */
export interface ProgramLabelConfig {
  title?: string
  navTitle?: string
}

const programLabelSchema = {
  type: 'object',
  properties: {
    // blank is allowed here, it is how the form clears an override - normalizeProgramLabels drops it
    title: { type: 'string', maxLength: 255 },
    navTitle: { type: 'string', maxLength: 255 }
  },
  additionalProperties: false
}

let programLabelValidator: ValidateFunction | undefined
export function validateProgramLabels (data: any) {
  programLabelValidator ??= registryAjv.compile(programLabelSchema)
  const valid = programLabelValidator(data)
  if (!valid) console.error(programLabelValidator.errors)
  return valid
}

export function normalizeProgramLabels (data: any): ProgramLabelConfig {
  const ret: ProgramLabelConfig = {}
  for (const field of ['title', 'navTitle'] as const) {
    const value = typeof data?.[field] === 'string' ? data[field].trim() : undefined
    if (value) ret[field] = value
  }
  return ret
}

export function resolveProgramLabels (definition: ProgramDefinitionProcessed, labels?: ProgramLabelConfig) {
  return {
    title: labels?.title ?? definition.title,
    navTitle: labels?.navTitle ?? labels?.title ?? definition.navTitle ?? definition.title
  }
}

export function parseProgramLabels (data: string | null | undefined): ProgramLabelConfig | undefined {
  return data ? JSON.parse(data) : undefined
}

@ObjectType()
export class Program {
  constructor (public definition: ProgramDefinitionProcessed, labels?: ProgramLabelConfig) {
    const { title, navTitle } = resolveProgramLabels(definition, labels)
    this.key = definition.key
    this.title = title
    this.navTitle = navTitle
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
    super(programRegistry.get(row.programKey), parseProgramLabels(row.programLabels))
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
