import db from 'mysql2-async/db'
import { Queryable } from 'mysql2-async'

export interface MailTemplateRow {
  id: number
  templateKey: string
  description: string
  audience: string
  variables?: string
  subject: string
  body: string
  created: Date
  enabled: number
}

export interface MailOutboxRow {
  id: number
  templateKey: string
  emailTo: string
  replyTo?: string
  variables?: string
  status: string
  attempts: number
  triggeredAt: Date
  sentAt?: Date
  lastErrorAt?: Date
  lastErrorMessage?: string
  updatedAt: Date
}

export const createMailTemplate = async ({ templateKey, description, audience, variables, subject, body }: Pick<MailTemplateRow, 'templateKey' | 'description' | 'audience' | 'variables' | 'subject' | 'body'>, tdb: Queryable = db) => {
  // seeding runs again whenever new templates are added, so leave any existing row
  // which may have been edited or disabled as it is
  return await tdb.insert(`
    INSERT INTO mail_templates (templateKey, description, audience, variables, subject, body, enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE templateKey = templateKey
  `, [templateKey, description, audience, variables, subject, body, true])
}

export const createMailOutbox = async ({ templateKey, emailTo, variables, status, replyTo }: Pick<MailOutboxRow, 'templateKey' | 'emailTo' | 'variables' | 'status' | 'replyTo'>) => {
  return await db.insert(`
    INSERT INTO mail_outbox (templateKey, emailTo, variables, status, replyTo)
    VALUES (?, ?, ?, ?, ?)
  `, [templateKey, emailTo, variables, status, replyTo])
}

export const getPendingMail = async (): Promise<MailOutboxRow[]> => {
  return db.getall('SELECT * FROM mail_outbox WHERE status != "delivered"')
}

export const getMailOutbox = async (id: number): Promise<MailOutboxRow[]> => {
  return db.getall('SELECT * FROM mail_outbox WHERE id = ?', [id])
}

export const updateMailOutbox = async (id: number, { status, lastErrorAt, sentAt, lastErrorMessage, attempts }: Pick<MailOutboxRow, 'status' | 'lastErrorAt' | 'sentAt' | 'lastErrorMessage' | 'attempts'>) => {
  return await db.update(`
    UPDATE mail_outbox SET status = ?, lastErrorAt = ?, sentAt = ?, lastErrorMessage = ?, attempts = ?  WHERE id = ?
  `, [status, lastErrorAt, sentAt, lastErrorMessage, attempts, id])
}

export const getMailTemplate = async (templateKey: string): Promise<MailTemplateRow | undefined> => {
  return await db.getrow('SELECT * FROM mail_templates WHERE templateKey = ?', [templateKey])
}

export const toggleMailTemplate = async (templateKey: string, enabled: boolean) => {
  return await db.update('UPDATE mail_templates SET enabled = ? WHERE templateKey = ?', [enabled ? 1 : 0, templateKey])
}
