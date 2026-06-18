import { BaseService } from '@txstate-mws/graphql-server'
import { AccessUserService, createMailOutbox, getMailTemplate } from '../internal.js'

export class MailService extends BaseService {
  async sendmulti ({ from, userIds, templateKey, extra }: { from?: string, userIds: number[], templateKey: string, extra?: Record<string, any> }) {
    const templateRow = await getMailTemplate(templateKey)

    if (!templateRow) throw new Error('No mail template found')
    if (!templateRow?.enabled) return

    await Promise.all(userIds.map(async id => {
      const user = await this.svc(AccessUserService).findByInternalId(id)
      if (!user || !user.email) return
      await createMailOutbox({ templateKey, emailTo: `${user.fullname} <${user.email}>`, replyTo: from, variables: JSON.stringify(extra), status: 'pending' })
    }))
  }
}
