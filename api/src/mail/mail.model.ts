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
    this.emailTo = row.emailTo
    this.variables = row.variables
    this.status = row.status
    this.attempts = row.attempts
    this.triggeredAt = DateTime.fromJSDate(row.triggeredAt)
    this.sentAt = row.sentAt ? DateTime.fromJSDate(row.sentAt) : undefined
    this.updatedAt = DateTime.fromJSDate(row.updatedAt)
    this.lastErrorAt = row.lastErrorAt ? DateTime.fromJSDate(row.lastErrorAt) : undefined
    this.lastErrorMessage = row.lastErrorMessage
  }

  @Field(type => ID)
  id: string

  @Field({ description: '' })
  templateKey: string

  @Field({ description: '' })
  emailTo: string

  @Field(type => JsonData, { description: '' })
  variables: string

  @Field({ description: '' })
  status: string

  @Field({ description: '' })
  attempts: number

  @Field({ description: '' })
  triggeredAt: DateTime

  @Field({ nullable: true, description: '' })
  sentAt?: DateTime

  @Field({ description: '' })
  updatedAt: DateTime

  @Field({ nullable: true, description: '' })
  lastErrorAt?: DateTime

  @Field({ nullable: true, description: '' })
  lastErrorMessage?: string
}
