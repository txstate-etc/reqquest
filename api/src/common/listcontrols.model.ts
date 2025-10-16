import { InputType, Field } from 'type-graphql'

@InputType()
export class SortInstruction {
  @Field()
  field!: string

  @Field(type => Boolean, { nullable: true })
  descending?: boolean
}
