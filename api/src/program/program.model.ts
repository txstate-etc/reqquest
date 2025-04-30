import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { PeriodProgramRow, ProgramDefinition, programRegistry } from '../internal.js'

@ObjectType()
export class Program {
  constructor (public definition: ProgramDefinition) {
    this.key = definition.key
    this.title = definition.title
    this.navTitle = definition.navTitle ?? definition.title
  }

  @Field(type => ID)
  key: string

  @Field()
  title: string

  @Field()
  navTitle: string
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
    this.disabled = !!row.disabled
    this.periodId = String(row.periodId)
  }

  @Field()
  disabled: boolean

  periodId: string
}

@InputType()
export class PeriodProgramFilters {
  @Field(() => [String], { nullable: true })
  keys?: string[]

  @Field(() => [ID], { nullable: true })
  periodIds?: string[]
}

@ObjectType()
export class PeriodProgramActions {}
