import { ObjectType, Field, ID } from 'type-graphql'
import { MailOutboxRow, MailTemplateRow } from './mail.database'
import { DateTime } from 'luxon'
import { JsonData } from '../scalar'

@ObjectType()
export class MailTemplate {
  constructor (row: MailTemplateRow) {
    this.id = String(row.id)
    this.templateKey = row.templateKey
    this.description = row.description
    this.audience = row.audience
    this.variables = row.variables
    this.subject = row.subject
    this.body = row.body
    this.enabled = !!row.enabled
    this.created = DateTime.fromJSDate(row.created)
  }

  @Field(type => ID)
  id: string

  @Field({ description: '' })
  templateKey: string

  @Field({ description: '' })
  description: string

  @Field({ description: '' })
  audience: string

  @Field(type => JsonData, { description: '' })
  variables: string

  @Field({ description: '' })
  subject: string

  @Field({ description: '' })
  body: string

  @Field({ description: '' })
  enabled: boolean

  @Field({ description: '' })
  created: DateTime
}

@ObjectType()
export class MailOutbox {
  constructor (row: MailOutboxRow) {
    this.id = String(row.id)
    this.templateKey = row.templateKey
    this.recipients = row.recipients
    this.variables = row.variables
    this.status = row.status
    this.attempts = row.attempts
    this.sent = DateTime.fromJSDate(row.sent)
    this.updatedAt = DateTime.fromJSDate(row.updatedAt)
    this.lastError = row.lastError ? DateTime.fromJSDate(row.lastError) : undefined
  }

  @Field(type => ID)
  id: string

  @Field({ description: '' })
  templateKey: string

  @Field({ description: '' })
  recipients: string

  @Field(type => JsonData, { description: '' })
  variables: string

  @Field({ description: '' })
  status: string

  @Field({ description: '' })
  attempts: number

  @Field({ description: '' })
  sent: DateTime

  @Field({ description: '' })
  updatedAt: DateTime

  @Field({ nullable: true, description: '' })
  lastError?: DateTime
}
