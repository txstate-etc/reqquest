import { MutationMessageType, UnimplementedError } from '@txstate-mws/graphql-server'
import { isBlank } from 'txstate-utils'
import { AccessUserService, addAppRequestNote, AppRequest, AppRequestNoteFilters, AppRequestService, AuthService, cleanHTML, deleteAppRequestNote, getAppRequestNotes, Note, RQContext, updateAppRequestNote, ValidatedAppRequestResponse } from '../internal.js'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'

const notesById = new PrimaryKeyLoader({
  fetch: async (ids: string[], ctx: RQContext) => {
    const notes = await getAppRequestNotes({ ids })
    await ctx.svc(NoteService).prep(notes)
    return notes
  }
})

const notesByAppRequestId = new OneToManyLoader({
  fetch: async (appRequestIds: string[], filter: AppRequestNoteFilters | undefined, ctx: RQContext) => {
    const notes = await getAppRequestNotes({ ...filter, appRequestIds })
    await ctx.svc(NoteService).prep(notes)
    return notes
  },
  extractKey: note => note.appRequestId
})

const notesByApplicantLogin = new OneToManyLoader({
  fetch: async (applicants: string[], filter: AppRequestNoteFilters | undefined, ctx: RQContext) => {
    const notes = await getAppRequestNotes({ ...filter, applicants })
    await ctx.svc(NoteService).prep(notes)
    return notes
  },
  extractKey: note => note.applicantLogin!
})

const notesByApplicantInternalId = new OneToManyLoader({
  fetch: async (applicantInternalIds: number[], filter: AppRequestNoteFilters | undefined, ctx: RQContext) => {
    const notes = await getAppRequestNotes({ ...filter, applicantInternalIds })
    await ctx.svc(NoteService).prep(notes)
    return notes
  },
  extractKey: note => note.applicantId
})

export class NoteService extends AuthService<Note> {
  async prep (notes: Note[]) {
    await Promise.all(notes.map(async note => {
      note.appRequestTags = await this.svc(AppRequestService).getTags(note.appRequestId)
    }))
  }

  async find (filter: AppRequestNoteFilters) {
    const notes = await getAppRequestNotes(filter)
    await this.prep(notes)
    for (const note of notes) {
      this.loaders.prime(notesById, note)
    }
    return this.removeUnauthorized(notes)
  }

  async findById (id: string) {
    const note = await this.loaders.get(notesById).load(id)
    return this.removeUnauthorized(note)
  }

  async findByAppRequestId (appRequestId: string, filter?: AppRequestNoteFilters) {
    const notes = await this.loaders.get(notesByAppRequestId, filter).load(appRequestId)
    for (const note of notes) this.loaders.prime(notesById, note)
    return this.removeUnauthorized(notes)
  }

  async findByApplicantLogin (applicantLogin: string, filter?: AppRequestNoteFilters) {
    const notes = await this.loaders.get(notesByApplicantLogin, filter).load(applicantLogin)
    for (const note of notes) this.loaders.prime(notesById, note)
    return this.removeUnauthorized(notes)
  }

  async findByApplicantInternalId (applicantInternalId: number, filter?: AppRequestNoteFilters) {
    const notes = await this.loaders.get(notesByApplicantInternalId, filter).load(applicantInternalId)
    for (const note of notes) this.loaders.prime(notesById, note)
    return this.removeUnauthorized(notes)
  }

  mayView (note: Note) {
    if (note.applicantId === this.user!.internalId && !this.hasControl('AppRequest', 'review_own', note.appRequestTags)) return false
    return this.hasControl('AppRequest', 'review', note.appRequestTags)
  }

  mayUpdate (note: Note) {
    return false // no editing for now
  }

  mayDelete (note: Note) {
    return false // no deleting for now
  }

  mayAddNote (appRequest: AppRequest) {
    return this.svc(AppRequestService).mayViewAsReviewer(appRequest)
  }

  async addNote (appRequest: AppRequest, note: string) {
    if (!this.mayAddNote(appRequest)) throw new Error('You may not add a note to this app request.')
    const response = new ValidatedAppRequestResponse()
    if (isBlank(note)) response.addMessage('Message is required.', 'note', MutationMessageType.error)
    if (response.hasErrors()) return response
    await addAppRequestNote(appRequest.internalId, this.user!.internalId, note)
    await this.svc(AppRequestService).recordActivity(appRequest.internalId, 'Added Note', { description: cleanHTML(note) })
    this.loaders.clear()
    response.appRequest = (await this.svc(AppRequestService).findById(appRequest.id))!
    return response
  }

  async updateNote (noteId: string, content: string) {
    const note = await this.findById(noteId)
    if (!note) throw new Error('Note not found.')
    if (!this.mayUpdate(note)) throw new Error('You may not update this note.')
    const response = new ValidatedAppRequestResponse()
    if (isBlank(content)) response.addMessage('Note content may not be blank. Delete the note instead.', 'content', MutationMessageType.error)
    if (response.hasErrors()) return response
    const authorLogin = (await this.svc(AccessUserService).findByInternalId(note.authorId))?.login
    await updateAppRequestNote(noteId, content)
    await this.svc(AppRequestService).recordActivity(note.appRequestId, 'Updated Note', { data: { id: note.id, author: authorLogin, createdAt: note.createdAt.toISO() }, description: cleanHTML(content) })
    this.loaders.clear()
    response.appRequest = (await this.svc(AppRequestService).findById(note.appRequestId))!
    return response
  }

  async deleteNote (noteId: string) {
    const note = await this.findById(noteId)
    if (!note) throw new Error('Note not found.')
    if (!this.mayDelete(note)) throw new Error('You may not delete this note.')
    const authorLogin = (await this.svc(AccessUserService).findByInternalId(note.authorId))?.login
    await deleteAppRequestNote(noteId)
    await this.svc(AppRequestService).recordActivity(note.appRequestId, 'Deleted Note', { description: cleanHTML(note.content), data: { id: note.id, author: authorLogin, createdAt: note.createdAt.toISO() } })
    this.loaders.clear()
  }
}
