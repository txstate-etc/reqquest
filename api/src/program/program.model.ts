import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { PeriodProgramRow, ProgramDefinition, programRegistry } from '../internal.js'

@ObjectType()
export class Program {
  constructor (public definition: ProgramDefinition) {
    this.key = definition.key
    this.title = definition.title
    this.navTitle = definition.navTitle ?? definition.title
    this.authorizationKeys = { program: [this.key] }
  }

  @Field(type => ID)
  key: string

  @Field()
  title: string

  @Field()
  navTitle: string

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
