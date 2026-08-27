import db from 'mysql2-async/db'
import { Announcement, AnnouncementFilters, AnnouncementUpdate } from '../internal.js'

export interface AnnouncementRow {
  id: number
  link: string | null
  linkText: string | null
  subject: string
  body: string
  start: Date | null
  end: Date | null
  enabled: 0 | 1
  type: string
}

function processFilters (filter?: AnnouncementFilters) {
  const where: string[] = []
  const binds: any[] = []

  if (filter?.ids?.length) where.push(`a.id IN (${db.in(binds, filter.ids)})`)
  if (filter?.enabled != null) where.push(`a.enabled = ${filter.enabled ? 1 : 0}`)
  if (filter?.active) {
    // an announcement is active when it is enabled and the current moment falls inside its date range
    where.push('((a.start <= NOW()) AND (a.end > NOW()) OR a.enabled = 1)')
  }

  return { where, binds }
}

export async function getAnnouncements (filter?: AnnouncementFilters) {
  const { where, binds } = processFilters(filter)
  const rows = await db.getall<AnnouncementRow>(`
    SELECT a.*
    FROM announcements a
    ${where.length ? 'WHERE (' + where.join(') AND (') + ')' : ''}
  `, binds)
  return rows.map(row => new Announcement(row))
}

export async function createAnnouncement (update: AnnouncementUpdate) {
  const { link, linkText, subject, body, start, end, enabled, type } = update
  return await db.insert(`
    INSERT INTO announcements (link, linkText, subject, body, start, end, enabled, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [link, linkText, subject, body, start?.toJSDate(), end?.toJSDate(), enabled ? 1 : 0, type])
}

export async function updateAnnouncement (id: string, update: AnnouncementUpdate) {
  const { link, linkText, subject, body, start, end, enabled, type } = update
  await db.update(`
    UPDATE announcements
    SET link = ?, linkText = ?, subject = ?, body = ?, start = ?, end = ?, enabled = ?, type = ?
    WHERE id = ?
  `, [link, linkText, subject, body, start?.toJSDate(), end?.toJSDate(), enabled ? 1 : 0, type, id])
}

export async function setAnnouncementEnabled (id: string, enabled: boolean) {
  await db.update('UPDATE announcements SET enabled = ? WHERE id = ?', [enabled ? 1 : 0, id])
}

export async function deleteAnnouncement (id: string) {
  await db.delete('DELETE FROM announcements WHERE id = ?', [id])
}
