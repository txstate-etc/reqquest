import { MutationMessageType, ValidatedResponse } from '@txstate-mws/graphql-server'
import { isBlank, isNotBlank } from 'txstate-utils'
import { Announcement, AnnouncementFilters, AnnouncementUpdate, AuthService, cleanHTML, createAnnouncement, deleteAnnouncement, getAnnouncements, setAnnouncementEnabled, updateAnnouncement, ValidatedAnnouncementResponse, validateHTML } from '../internal.js'

export class AnnouncementService extends AuthService<Announcement> {
  async find (filter?: AnnouncementFilters) {
    return await getAnnouncements(filter)
  }

  async findByID (id: string) {
    const announcements = await this.find({ ids: [id] })
    return announcements[0]
  }
  /**
   * The announcements that should be displaying right now. Everyone may see these, since the whole
   * point of an announcement is to be shown to every user of the system.
   */
  async findActive () {
    return await this.find({ active: true })
  }

  mayView (announcement: Announcement) {
    return this.hasControl('Announcement', 'view')
  }

  mayCreate () {
    return this.hasControl('Announcement', 'create')
  }

  mayUpdate () {
    return this.hasControl('Announcement', 'update')
  }

  mayDelete () {
    return this.hasControl('Announcement', 'delete')
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
      if (update.start == null) {
        response.addMessage('Start date is required', 'start')
      } else if (update.end == null) {
        response.addMessage('End date is required', 'end')
      } else if (update.end <= update.start) {
        response.addMessage('End date must be after the start date.', 'end')
      }
    }
    return response
  }

  async create (update: AnnouncementUpdate, validateOnly?: boolean) {
    if (!this.mayCreate()) throw new Error('You are not allowed to create an announcement.')
    const exists = await this.find()
    if (exists.length) throw new Error('An announcement already exists')
    const response = this.validate(update)
    if (validateOnly || response.hasErrors()) return response
    const id = await createAnnouncement({ 
      ...update,
      body: cleanHTML(update.body ?? ''),
      subject: cleanHTML(update.subject ?? ''),
      enabled: update.type === 'date' ? false : update.enabled,
      start: update.type === 'toggle' ? undefined : update.start,
      end: update.type === 'toggle' ? undefined : update.end
    })
    response.announcement = await this.findByID(String(id))
    return response
  }

  async update (id: string, update: AnnouncementUpdate, validateOnly?: boolean) {
    const announcement = await this.findByID(id)
    if (!announcement) throw new Error('Announcement not found.')
    if (!this.mayUpdate()) throw new Error('You are not allowed to update this announcement.')
    const response = this.validate(update)
    if (validateOnly || response.hasErrors()) return response
    await updateAnnouncement(id, { 
      ...update,
      body: cleanHTML(update.body ?? ''),
      subject: cleanHTML(update.subject ?? ''),
      enabled: update.type === 'date' ? false : update.enabled,
      start: update.type === 'toggle' ? undefined : update.start,
      end: update.type === 'toggle' ? undefined : update.end
    })
    response.announcement = await this.findByID(id)
    return response
  }

  async delete (id: string) {
    const announcement = await this.findByID(id)
    if (!announcement) throw new Error('Announcement not found.')
    if (!this.mayDelete()) throw new Error('You are not allowed to delete this announcement.')
    await deleteAnnouncement(id)
    return new ValidatedResponse({ success: true })
  }
}
