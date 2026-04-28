import { Arg, Ctx, FieldResolver, ID, Mutation, Resolver, Root } from 'type-graphql'
import { AccessUser, AccessUserService, AppRequest, AppRequestService, Note, NoteActions, NoteService, RQContext, ValidatedAppRequestResponse, ValidatedNoteResponse } from '../internal.js'

@Resolver(of => Note)
export class NoteResolver {
  @FieldResolver(type => AccessUser, { description: 'The author of the note.' })
  author (@Ctx() ctx: RQContext, @Root() note: Note) {
    return ctx.svc(AccessUserService).findByInternalId(note.authorId)
  }

  @FieldResolver(type => AppRequest, { description: 'The app request this note is attached to.' })
  appRequest (@Ctx() ctx: RQContext, @Root() note: Note) {
    return ctx.svc(NoteService).svc(AppRequestService).findById(note.appRequestId)
  }

  @FieldResolver(type => NoteActions)
  actions (@Ctx() ctx: RQContext, @Root() note: Note) {
    return note
  }

  @Mutation(returns => ValidatedNoteResponse, { description: 'Add a note to the app request.' })
  async addNote (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('content', type => String, { description: 'The content of the note. HTML is expected.' }) content: string, @Arg('persistent', type => Boolean, { nullable: true }) persistent?: boolean, @Arg('validateOnly', type => Boolean, { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(NoteService).addNote(appRequest, content, validateOnly)
  }

  @Mutation(returns => ValidatedNoteResponse, { description: 'Update the content of an existing note.' })
  async updateNote (@Ctx() ctx: RQContext, @Arg('noteId', type => ID) noteId: string, @Arg('content', type => String) content: string) {
    return await ctx.svc(NoteService).updateNote(noteId, content)
  }

  @Mutation(returns => Boolean, { description: 'Delete an existing note.' })
  async deleteNote (@Ctx() ctx: RQContext, @Arg('noteId', type => ID) noteId: string) {
    return await ctx.svc(NoteService).deleteNote(noteId)
  }

  @Mutation(returns => ValidatedNoteResponse, { description: 'Toggle an existing note\'s persistent status.' })
  async togglePersistence (@Ctx() ctx: RQContext, @Arg('noteId', type => ID) noteId: string) {
    return await ctx.svc(NoteService).togglePersistence(noteId)
  }
}

@Resolver(of => NoteActions)
export class NoteActionsResolver {
  @FieldResolver(type => Boolean)
  update (@Ctx() ctx: RQContext, @Root() note: Note) {
    return ctx.svc(NoteService).mayUpdate(note)
  }

  @FieldResolver(type => Boolean)
  updatePersistent (@Ctx() ctx: RQContext, @Root() note: Note) {
    return ctx.svc(NoteService).mayUpdatePersistent(note)
  }

  @FieldResolver(type => Boolean)
  delete (@Ctx() ctx: RQContext, @Root() note: Note) {
    return ctx.svc(NoteService).mayDelete(note)
  }
}
