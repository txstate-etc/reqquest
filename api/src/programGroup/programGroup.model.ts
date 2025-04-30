import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { ProgramGroupDefinition } from '../internal.js'

@ObjectType()
export class ProgramGroup {
  constructor (public definition: ProgramGroupDefinition) {
    this.key = definition.key
    this.title = definition.title
    this.navTitle = definition.navTitle ?? definition.title
  }

  @Field(type => ID)
  key: string

  @Field({ description: 'A human readable title for the program group. This will be shown to users.' })
  title: string

  @Field({ description: 'A human readable title for the program group in the navigation. You may want it to be shorter than the full title. If not provided, the title will be used.' })
  navTitle: string
}

@InputType()
export class ProgramGroupFilter {
  @Field(() => [ID], { nullable: true })
  keys?: string[]
}
