import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { NoteRow } from '../internal.js'
import { DateTime } from 'luxon'

@ObjectType({ description: 'An internal note attached to an application request. Notes are always written by reviewers and never visible to applicants. "Messages" are for reviewers and applicants communicating with one another.' })
export class Note {
  constructor (data: NoteRow) {
    this.id = String(data.id)
    this.appRequestId = String(data.appRequestId)
    this.authorId = data.authorId
    this.content = data.content
    this.createdAt = DateTime.fromJSDate(data.createdAt)
    this.updatedAt = DateTime.fromJSDate(data.updatedAt)
    this.applicantId = data.applicantId
    this.applicantLogin = data.login
  }

  @Field(type => ID)
  id: string

  @Field({ description: 'The content of the note in HTML.' })
  content: string

  @Field(type => DateTime)
  createdAt: DateTime

  @Field(type => DateTime)
  updatedAt: DateTime

  appRequestId: string
  authorId: number
  applicantId: number
  appRequestTags!: Record<string, string[]>
  applicantLogin?: string
}

@ObjectType({ description: 'Actions that can be performed on a note.' })
export class NoteActions {}

@InputType()
export class AppRequestNoteFilters {
  @Field(type => [ID], { nullable: true, description: 'Filter to the specified note IDs.' })
  ids?: string[]

  @Field(type => [ID], { nullable: true, description: 'Filter notes to those attached to the specified application requests.' })
  appRequestIds?: string[]

  @Field(type => [String], { nullable: true, description: 'Filter notes to those attached to application requests from the specified applicants (by login name).' })
  applicants?: string[]

  applicantInternalIds?: number[]
}
