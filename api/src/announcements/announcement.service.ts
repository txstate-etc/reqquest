import { MutationMessageType, ValidatedResponse } from '@txstate-mws/graphql-server'
import { isBlank, isNotBlank } from 'txstate-utils'
import { Announcement, AnnouncementFilters, AnnouncementUpdate, AuthService, cleanHTML, createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement, ValidatedAnnouncementResponse, validateHTML } from '../internal.js'

export class AnnouncementService extends AuthService<Announcement> {
  async find (filter?: AnnouncementFilters) {
    return await getAnnouncements(filter)
  }

  async findByID (id: string) {
    const announcements = await this.find({ ids: [id] })
    return announcements[0]
  }

  mayManage () {
    return this.hasControl('Announcement', 'manage')
  }

  /**
   * Deliberately not named `mayView`: AuthorizedServiceSync declares a protected `mayView(obj)`
   * that removeUnauthorized() uses as a per-row filter, and this is a page-level right.
   */
  mayViewAnnouncementManagement () {
    return this.hasControl('Announcement', 'view') || this.mayManage()
  }

  validate (update: AnnouncementUpdate) {
    const response = new ValidatedAnnouncementResponse({ success: true })
    if (isBlank(update.subject)) response.addMessage('Subject is required.', 'subject')

    if (isBlank(update.body)) response.addMessage('Body is required.', 'body')
    else for (const m of validateHTML(update.body, 'body')) response.addMessage(m.message, m.arg, m.type)

    if (isNotBlank(update.link)) {
      const canParse = URL.canParse(update.link)
      if (!canParse) response.addMessage('Invalid URL', 'link')
      if (isBlank(update.linkText)) response.addMessage('Link text is required when a link is provided.', 'linkText')
    } else if (isNotBlank(update.linkText)) {
      response.addMessage('Link text needs url', 'linkText', MutationMessageType.error)
    }

    if (update.type === 'date') {
      if (update.start == null && update.end == null) {
        response.addMessage('Provide a start date, an end date, or both.', 'start')
      } else if (update.start != null && update.end != null && update.end <= update.start) {
        response.addMessage('End date must be after the start date.', 'end')
      }
    }
    return response
  }

  async create (update: AnnouncementUpdate, validateOnly?: boolean) {
    if (!this.mayManage()) throw new Error('You are not allowed to create an announcement.')
    const exists = await this.find()
    if (exists.length) throw new Error('An announcement already exists')
    const response = this.validate(update)
    if (validateOnly || response.hasErrors()) return response
    const id = await createAnnouncement({
      ...update,
      body: cleanHTML(update.body ?? ''),
      subject: cleanHTML(update.subject ?? ''),
      enabled: update.type === 'date' ? true : update.enabled,
      start: update.type === 'toggle' ? undefined : update.start,
      end: update.type === 'toggle' ? undefined : update.end
    })
    response.announcement = await this.findByID(String(id))
    return response
  }

  async update (id: string, update: AnnouncementUpdate, validateOnly?: boolean) {
    if (!this.mayManage()) throw new Error('You are not allowed to update this announcement.')
    const announcement = await this.findByID(id)
    if (!announcement) throw new Error('Announcement not found.')
    const response = this.validate(update)
    if (validateOnly || response.hasErrors()) return response
    await updateAnnouncement(id, {
      ...update,
      body: cleanHTML(update.body ?? ''),
      subject: cleanHTML(update.subject ?? ''),
      enabled: update.type === 'date' ? true : update.enabled,
      start: update.type === 'toggle' ? undefined : update.start,
      end: update.type === 'toggle' ? undefined : update.end
    })
    response.announcement = await this.findByID(id)
    return response
  }

  async delete (id: string) {
    if (!this.mayManage()) throw new Error('You are not allowed to delete this announcement.')
    const announcement = await this.findByID(id)
    if (!announcement) throw new Error('Announcement not found.')
    await deleteAnnouncement(id)
    return new ValidatedResponse({ success: true })
  }
}
