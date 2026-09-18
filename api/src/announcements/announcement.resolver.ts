import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'
import { ValidatedResponse } from '@txstate-mws/graphql-server'
import { Announcement, AnnouncementFilters, AnnouncementService, AnnouncementUpdate, RQContext, ValidatedAnnouncementResponse } from '../internal.js'

@Resolver(of => Announcement)
export class AnnouncementResolver {
  @Query(returns => [Announcement], { description: 'Retrieve site-wide announcements. Any authenticated user may retrieve any announcement, including ones that are disabled or outside their date range; pass filter.active to limit the result to the announcements that should be displaying right now.' })
  async announcements (
    @Ctx() ctx: RQContext,
    @Arg('filter', type => AnnouncementFilters, { nullable: true }) filter?: AnnouncementFilters) {
    return await ctx.svc(AnnouncementService).find(filter)
  }

  @Mutation(returns => ValidatedAnnouncementResponse, { description: 'Create a new site-wide announcement.' })
  async createAnnouncement (
    @Ctx() ctx: RQContext,
    @Arg('announcement', type => AnnouncementUpdate) announcement: AnnouncementUpdate,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(AnnouncementService).create(announcement, validateOnly)
  }

  @Mutation(returns => ValidatedAnnouncementResponse, { description: 'Update an existing site-wide announcement.' })
  async updateAnnouncement (
    @Ctx() ctx: RQContext,
    @Arg('announcementId', type => ID) announcementId: string,
    @Arg('announcement', type => AnnouncementUpdate) announcement: AnnouncementUpdate,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(AnnouncementService).update(announcementId, announcement, validateOnly)
  }

  @Mutation(returns => ValidatedResponse, { description: 'Delete an existing site-wide announcement.' })
  async deleteAnnouncement (@Ctx() ctx: RQContext, @Arg('announcementId', type => ID) announcementId: string) {
    return await ctx.svc(AnnouncementService).delete(announcementId)
  }
}
