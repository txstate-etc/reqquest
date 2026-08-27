import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { DateTime } from 'luxon'
import { ValidatedResponse } from '@txstate-mws/graphql-server'
import { AnnouncementRow } from './announcement.database.js'

@ObjectType({ description: 'A site-wide announcement shown to users, optionally limited to a date range.' })
export class Announcement {
  constructor (row: AnnouncementRow) {
    this.id = String(row.id)
    this.link = row.link ?? undefined
    this.linkText = row.linkText ?? undefined
    this.subject = row.subject
    this.body = row.body
    this.start = row.start ? DateTime.fromJSDate(row.start) : undefined
    this.end = row.end ? DateTime.fromJSDate(row.end) : undefined
    this.enabled = !!row.enabled
    this.type = row.type
  }

  @Field(type => ID)
  id: string

  @Field({ nullable: true, description: 'URL the announcement directs the user to for more information.' })
  link?: string

  @Field({ nullable: true, description: 'The text to display for the link.' })
  linkText?: string

  @Field({ description: 'Short headline for the announcement.' })
  subject: string

  @Field({ description: 'The content of the announcement in HTML.' })
  body: string

  @Field(type => DateTime, { nullable: true, description: 'The announcement will not display before this date. Null means it displays as soon as it is enabled.' })
  start?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'The announcement will not display after this date. Null means it displays until it is disabled.' })
  end?: DateTime

  @Field({ description: 'Whether the announcement has been turned on. A disabled announcement never displays, regardless of its date range.' })
  enabled: boolean

  @Field({ description: 'The type of announcement, toggleable or date range' })
  type: string

  /**
   * Whether the announcement should be displaying right now: enabled and inside its date range.
   * Resolved as a field so the UI can show admins why an enabled announcement is not visible yet.
   */
  isActive (now = DateTime.now()) {
    if (!this.enabled) return false
    if (this.start != null && this.start > now) return false
    if (this.end != null && this.end <= now) return false
    return true
  }
}

@ObjectType({ description: 'Actions that can be performed on an announcement.' })
export class AnnouncementActions {}

@InputType()
export class AnnouncementFilters {
  @Field(type => [ID], { nullable: true, description: 'Return the announcements with these IDs.' })
  ids?: string[]

  @Field({ nullable: true, description: 'Return only enabled (true) or only disabled (false) announcements.' })
  enabled?: boolean

  @Field({ nullable: true, description: 'Return only the announcements that should be displayed at this moment: enabled OR within their date range.' })
  active?: boolean
}

@InputType()
export class AnnouncementUpdate {
  @Field({ nullable: true, description: 'URL the announcement directs the user to for more information.' })
  link?: string

  @Field({ nullable: true, description: 'The text to display for the link. Required when a link is given.' })
  linkText?: string

  @Field({ nullable: true, description: 'Short headline for the announcement.' })
  subject?: string

  @Field({ nullable: true, description: 'The content of the announcement in HTML. Unsafe markup is stripped on save.' })
  body?: string

  @Field(type => DateTime, { nullable: true, description: 'The announcement will not display before this date. Null means it displays as soon as it is enabled.' })
  start?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'The announcement will not display after this date. Null means it displays until it is disabled.' })
  end?: DateTime

  @Field({ nullable: true, defaultValue: false, description: 'Whether the announcement has been turned on.' })
  enabled?: boolean

  @Field({ nullable: true, description: 'The type of announcement, toggleable or date range' })
  type?: string
}

@ObjectType()
export class ValidatedAnnouncementResponse extends ValidatedResponse {
  @Field(type => Announcement, { nullable: true, description: 'The created or updated announcement. Null when validateOnly was true or when validation errors prevented the operation.' })
  announcement?: Announcement
}
