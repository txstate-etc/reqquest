import db from 'mysql2-async/db'
import { AppRequestNoteFilters, cleanHTML, Note } from '../internal.js'

export interface NoteRow {
  id: number
  appRequestId: number
  authorId: number
  content: string
  createdAt: Date
  updatedAt: Date
  applicantId: number
  login?: string
}

function processFilters (filter: AppRequestNoteFilters) {
  const selects: string[] = []
  const where: string[] = []
  const joins = new Map<string, string>()
  const binds: any[] = []

  if (filter.ids?.length) where.push(`arn.id IN (${db.in(binds, filter.ids)})`)
  if (filter.appRequestIds?.length) where.push(`arn.appRequestId IN (${db.in(binds, filter.appRequestIds)})`)
  if (filter.applicants?.length) {
    selects.push('applicant.login')
    joins.set('applicant', 'INNER JOIN accessUsers applicant ON ar.userId = applicant.id')
    where.push(`applicant.login IN (${db.in(binds, filter.applicants)})`)
  }
  if (filter.applicantInternalIds?.length) {
    where.push(`ar.userId IN (${db.in(binds, filter.applicantInternalIds)})`)
  }

  return { selects, where, joins, binds }
}

export async function getAppRequestNotes (filter: AppRequestNoteFilters) {
  const { selects, where, joins, binds } = processFilters(filter)

  const rows = await db.getall<NoteRow>(`
    SELECT arn.*, ar.userId AS applicantId${selects.length ? ', ' + selects.join(', ') : ''}
    FROM app_request_notes arn
    INNER JOIN app_requests ar ON arn.appRequestId = ar.id
    ${Array.from(joins.values()).join('\n')}
    ${where.length ? 'WHERE (' + where.join(') AND (') + ')' : ''}
    ORDER BY arn.createdAt DESC
  `, binds)
  return rows.map(row => new Note(row))
}

export async function addAppRequestNote (appRequestId: number, authorInternalId: number, note: string) {
  return await db.insert(`
    INSERT INTO app_request_notes (appRequestId, authorId, content)
    VALUES (?, ?, ?)
  `, [appRequestId, authorInternalId, cleanHTML(note)])
}

export async function updateAppRequestNote (noteId: string, content: string) {
  return await db.update('UPDATE app_request_notes SET content = ? WHERE id = ?', [cleanHTML(content), noteId])
}

export async function deleteAppRequestNote (noteId: string) {
  return await db.delete('DELETE FROM app_request_notes WHERE id = ?', [noteId])
}
