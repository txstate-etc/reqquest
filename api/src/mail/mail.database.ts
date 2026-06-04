import { DateTime } from 'luxon'
import db from 'mysql2-async/db'

export interface MailTemplateRow {
  id: number
  templateKey: string
  description: string
  audience: string
  variables: string
  subject: string
  body: string
  created: Date
  enabled: boolean
}

export interface MailOutboxRow {
  id: number
  templateKey: string
  recipients: string
  variables: string
  status: string
  attempts: number
  sent: Date
  lastError?: Date
  updatedAt: Date
}

export const createMailTemplate = async ({ templateKey, description, audience, variables, subject, body }: Pick<MailTemplateRow, 'templateKey' | 'description' | 'audience' | 'variables' | 'subject' | 'body'>) => {
  return await db.insert(`
    INSERT INTO mail_templates (templateKey, description, audience, variables, subject, body, enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [templateKey, description, audience, variables, subject, body, true])
}

export const createMailOutbox = async ({ templateKey, recipients, variables, status }: Pick<MailOutboxRow, 'templateKey' | 'recipients' | 'variables' | 'status'>) => {
  return await db.insert(`
    INSERT INTO mail_outbox (templateKey, recipients, variables, status)
    VALUES (?, ?, ?, ?)
  `, [templateKey, recipients, variables, status])
}

export const updateMailOutbox = async (id: number, { status, lastError }: Pick<MailOutboxRow, 'status' | 'lastError'>) => {
  return await db.insert(`
    UPDATE mail_outbox SET status = ?, lastError = ? WHERE id = ?
  `, [status, lastError, id])
}

export const getMailTemplate = async (templateKey: string): Promise<MailTemplateRow | undefined> => {
  return await db.getrow(`SELECT * FROM mail_templates WHERE templateKey = '${templateKey}'`)
}
