import { MutationMessageType, UnimplementedError } from '@txstate-mws/graphql-server'
import { isBlank } from 'txstate-utils'
import { AccessUserService, addAppRequestNote, AppRequest, AppRequestNoteFilters, AppRequestService, AuthService, cleanHTML, deleteAppRequestNote, getAppRequestNotes, Note, RQContext, toggleNotePersistence, updateAppRequestNote, ValidatedAppRequestResponse, ValidatedNoteResponse } from '../internal.js'
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

  async findByInternalId (id: number) {
    return this.findById(String(id))
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
    if (!this.mayView(note)) return false
    if (note.authorId === this.user!.internalId && this.hasControl('Notes', 'edit_own', note.appRequestTags)) return true
    return this.hasControl('Notes', 'edit', note.appRequestTags)
  }

  mayDelete (note: Note) {
    if (!this.mayView(note)) return false
    if (note.authorId === this.user!.internalId && this.hasControl('Notes', 'delete_own', note.appRequestTags)) return true
    return this.hasControl('Notes', 'delete', note.appRequestTags)
  }

  mayAddNote (appRequest: AppRequest) {
    if (!this.svc(AppRequestService).mayViewAsReviewer(appRequest)) return false
    return this.hasControl('Notes', 'create', appRequest.tags)
  }

  mayCreatePersistent (appRequest: AppRequest) {
    return this.hasControl('Notes', 'make_persistent', appRequest.tags) && this.mayAddNote(appRequest)
  }

  mayUpdatePersistent (note: Note) {
    return this.mayView(note) && this.hasControl('Notes', 'make_persistent', note.appRequestTags)
  }

  async addNote (appRequest: AppRequest, content: string, persistent?: boolean, validateOnly?: boolean) {
    if (!this.mayAddNote(appRequest)) throw new Error('You may not add a note to this app request.')
    const response = new ValidatedNoteResponse()
    const cleanContent = cleanHTML(content)
    if (isBlank(cleanContent)) response.addMessage('Message is required.', 'content', MutationMessageType.error)
    if (response.hasErrors() || validateOnly) return response
    const noteId = await addAppRequestNote(appRequest.internalId, this.user!.internalId, cleanContent, persistent)
    await this.svc(AppRequestService).recordActivity(appRequest.internalId, 'Added Note', { description: cleanContent })
    this.loaders.clear()
    response.note = (await this.findByInternalId(noteId))!
    return response
  }

  async updateNote (noteId: string, content: string) {
    const note = await this.findById(noteId)
    if (!note) throw new Error('Note not found.')
    if (!this.mayUpdate(note)) throw new Error('You may not update this note.')
    const response = new ValidatedNoteResponse()
    const cleanContent = cleanHTML(content)
    if (isBlank(cleanContent)) response.addMessage('Note content may not be blank. Delete the note instead.', 'content', MutationMessageType.error)
    if (response.hasErrors()) return response
    const authorLogin = (await this.svc(AccessUserService).findByInternalId(note.authorId))?.login
    await updateAppRequestNote(noteId, cleanContent)
    await this.svc(AppRequestService).recordActivity(note.appRequestId, 'Updated Note', { data: { id: note.id, author: authorLogin, createdAt: note.createdAt.toISO() }, description: cleanContent })
    this.loaders.clear()
    response.note = (await this.findById(note.id))!
    return response
  }

  async togglePersistence (noteId: string) {
    const note = await this.findById(noteId)
    if (!note) throw new Error('Note not found.')
    if (!this.mayUpdatePersistent(note)) throw new Error('You may not update this note\'s persistence.')
    const response = new ValidatedNoteResponse()
    const authorLogin = (await this.svc(AccessUserService).findByInternalId(note.authorId))?.login
    const newPersistence = await toggleNotePersistence(note.id)
    await this.svc(AppRequestService).recordActivity(note.appRequestId, 'Note Persistence', { data: { id: note.id, author: authorLogin, createdAt: note.createdAt }, description: newPersistence ? 'Made note persistent.' : 'Removed note persistence.' })
    this.loaders.clear()
    response.note = (await this.findById(note.id))!
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
