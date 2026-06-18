import { BaseService } from '@txstate-mws/graphql-server'
import { createMailOutbox, getMailTemplate } from '../internal.js'

export class MailService extends BaseService {
  async sendmulti ({ from, users, templateKey, extra }: { from?: string, users: string[], templateKey: string, extra?: Record<string, any> }) {
    const templateRow = await getMailTemplate(templateKey)

    if (!templateRow) throw new Error('No mail template found')
    if (!templateRow?.enabled) return

    for (const to of users) {
      await createMailOutbox({ templateKey, emailTo: to, replyTo: from, variables: JSON.stringify(extra), status: 'pending' })
    }
  }
}
