import { createTransport, Transporter } from 'nodemailer'
import Handlebars from 'handlebars'
import SMTPPool from 'nodemailer/lib/smtp-pool'
import { BaseService, Context } from '@txstate-mws/graphql-server'
import { createMailOutbox, getMailTemplate, updateMailOutbox } from '../internal.js'
import { DateTime } from 'luxon'

export class MailService extends BaseService {
  transporter: Transporter<SMTPPool.SentMessageInfo, SMTPPool.Options>

  constructor (ctx: Context<any>) {
    super(ctx)
    this.transporter = createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT ?? 25,
      secure: process.env.SMTP_SECURE ?? false,
      ...(process.env.SMTP_SECURE ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, requireTLS: true } : { ignoreTLS: true })
      // pool: true
    } as SMTPPool.Options)
  }

  private async sendsingle ({ from, to, template, extra }: { from?: string, to: string, template: any, extra?: Record<string, any> }) {
    const message = template({ to, from, link_base: 'helpers.absolute()', ...extra })
    const idx = message.indexOf('\n')
    const [subject, body] = [message.slice(0, idx), message.slice(idx + 1)]
    try {
      await this.transporter.sendMail({
        from: 'Reqquest <reqquest@txstate.edu>',
        replyTo: from ?? 'Reqquest <reqquest@txstate.edu>',
        to,
        subject: subject.trim(),
        html: body.trim().replace(/\r?\n/g, '<br>').replace(/(<br>){3,}/ig, '<br><br>')
      })
    } catch (e) {
      console.log(e)
    }
  }

  async sendmulti ({ from, users, templateKey, extra }: { from?: string, users: string[], templateKey: string, extra?: Record<string, any> }) {
    const templateRow = await getMailTemplate(templateKey)

    if (!templateRow) throw new Error('No mail template found')
    const template = Handlebars.compile(templateRow.subject + '\n' + templateRow.body)

    for await (const to of users) {
      const outbox = await createMailOutbox({ templateKey, recipients: to, variables: JSON.stringify(extra), status: 'sent' })
      try {
        await this.sendsingle({ from, to, template, extra })
        await updateMailOutbox(outbox, { status: 'delivered' })
      } catch (e) {
        await updateMailOutbox(outbox, { status: 'error', lastError: DateTime.now().toJSDate() })
      }
    }
  }

  async disconnect () {
    this.transporter.close()
  }
}
