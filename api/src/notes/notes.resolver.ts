import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql'
import { AccessUser, AccessUserService, AppRequest, AppRequestService, Note, NoteActions, NoteService, RQContext, ValidatedAppRequestResponse } from '../internal.js'

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

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Add a note to the app request.' })
  async addNote (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('content', type => String, { description: 'The content of the note. HTML is expected.' }) content: string) {
    return await ctx.svc(NoteService).addNote(appRequest, content)
  }

  @Mutation(returns => Note, { description: 'Update the content of an existing note.' })
  async updateNote (@Ctx() ctx: RQContext, @Arg('noteId', type => String) noteId: string, @Arg('content', type => String) content: string) {
    return await ctx.svc(NoteService).updateNote(noteId, content)
  }

  @Mutation(returns => Boolean, { description: 'Delete an existing note.' })
  async deleteNote (@Ctx() ctx: RQContext, @Arg('noteId', type => String) noteId: string) {
    return await ctx.svc(NoteService).deleteNote(noteId)
  }
}

@Resolver(of => NoteActions)
export class NoteActionsResolver {
  @FieldResolver(type => Boolean)
  update (@Ctx() ctx: RQContext, @Root() note: Note) {
    return ctx.svc(NoteService).mayUpdate(note)
  }

  @FieldResolver(type => Boolean)
  delete (@Ctx() ctx: RQContext, @Root() note: Note) {
    return ctx.svc(NoteService).mayDelete(note)
  }
}
