import { BaseService } from '@txstate-mws/graphql-server'
import { AccessUserService, createMailOutbox, getMailTemplate } from '../internal.js'

export class MailService extends BaseService {
  /**
   * Queue one email per user. Does nothing when the template's `enabled` flag is off in `mail_templates`.
   *
   * `dedupKey` makes the call idempotent per recipient: a second call producing the same key
   * for the same user is silently dropped. Prevent email the same person twice for the same event.
   */
  async sendmulti ({ from, userIds, templateKey, extra, dedupKey }: { from?: string, userIds: number[], templateKey: string, extra?: Record<string, any>, dedupKey?: (userInternalId: number) => string }) {
    const templateRow = await getMailTemplate(templateKey)

    if (!templateRow) throw new Error('No mail template found')
    if (!templateRow?.enabled) return

    await Promise.all(userIds.map(async id => {
      const user = await this.svc(AccessUserService).findByInternalId(id)
      if (!user || !user.email) return
      await createMailOutbox({ templateKey, emailTo: `${user.fullname} <${user.email}>`, replyTo: from, variables: JSON.stringify(extra), status: 'pending', dedupKey: dedupKey?.(id) })
    }))
  }
}
