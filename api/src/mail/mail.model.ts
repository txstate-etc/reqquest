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

  @Field()
  templateKey: string

  @Field()
  description: string

  @Field()
  audience: string

  @Field(type => JsonData, { nullable: true })
  variables?: string

  @Field()
  subject: string

  @Field()
  body: string

  @Field()
  enabled: boolean

  @Field()
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

  @Field()
  templateKey: string

  @Field()
  emailTo: string

  @Field(type => JsonData, { nullable: true })
  variables?: string

  @Field()
  status: string

  @Field()
  attempts: number

  @Field()
  triggeredAt: DateTime

  @Field({ nullable: true })
  sentAt?: DateTime

  @Field()
  updatedAt: DateTime

  @Field({ nullable: true })
  lastErrorAt?: DateTime

  @Field({ nullable: true })
  lastErrorMessage?: string
}
