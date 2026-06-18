import * as cheerio from 'cheerio'
import { type AnyNode, isTag, isText } from 'domhandler'
import { createTransport, Transporter } from 'nodemailer'
import Handlebars from 'handlebars'
import SMTPPool from 'nodemailer/lib/smtp-pool'
import { getMailTemplate, getPendingMail, updateMailOutbox } from '../internal.js'
import { DateTime } from 'luxon'

class Mail {
  transporter: Transporter<SMTPPool.SentMessageInfo, SMTPPool.Options>

  constructor () {
    this.transporter = createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT ?? 25,
      secure: !!process.env.SMTP_SECURE,
      ...(process.env.SMTP_SECURE ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, requireTLS: true } : { ignoreTLS: true }),
      pool: true
    } as SMTPPool.Options)
  }

  async sendsingle ({ replyTo, to, subject, body, extra }: { replyTo?: string, to: string, subject: any, body: any, extra?: Record<string, any> }) {
    const compiledSubject = subject({ to, replyTo, link_base: process.env.PUBLISHED_BASEURL, ...extra })
    const compiledBody = body({ to, replyTo, link_base: process.env.PUBLISHED_BASEURL, ...extra })
    await this.transporter.sendMail({
      from: 'Reqquest <reqquest@txstate.edu>',
      replyTo: replyTo ?? 'Reqquest <reqquest@txstate.edu>',
      to,
      subject: compiledSubject.trim(),
      html: compiledBody,
      text: this.htmlToText(compiledBody)
    })
  }

  async syncRows () {
    const outbox = await getPendingMail()

    await Promise.all(outbox.map(async ({ id, templateKey, emailTo, variables, replyTo, attempts }) => {
      const templateRow = await getMailTemplate(templateKey)
      if (!templateRow) return await updateMailOutbox(id, { status: 'error', lastErrorAt: DateTime.now().toJSDate(), lastErrorMessage: 'No template found', attempts: attempts += 1 })
      const subject = Handlebars.compile(templateRow.subject, { noEscape: true })
      const body = Handlebars.compile(templateRow.body)
      try {
        await mail.sendsingle({ to: emailTo, replyTo, subject, body, extra: {
          ...JSON.parse(templateRow?.variables ?? '{}'),
          ...JSON.parse(variables ?? '{}')
        } })
        await updateMailOutbox(id, { status: 'delivered', sentAt: DateTime.now().toJSDate(), attempts: attempts += 1 })
      } catch (e: any) {
        console.log(e)
        await updateMailOutbox(id, { status: 'error', lastErrorAt: DateTime.now().toJSDate(), lastErrorMessage: e?.message ?? 'unknown error', attempts: attempts += 1 })
      }
    }))
  }

  nodeToText = (node: AnyNode): string => {
    const blockTags = new Set(['address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'tbody', 'tfoot', 'thead', 'tr', 'ul'])
  // these are blocks too, but a single line break between them reads better than a blank line
    const singleBreakTags = new Set(['dt', 'dd'])
    if (isText(node)) return node.data.replace(/\s+/g, ' ')
    if (!isTag(node)) return ''
    const tag = node.name.toLowerCase()
    if (tag === 'script' || tag === 'style' || tag === 'template') return ''
    if (tag === 'br') return '\n'
    const inner = node.children.map(this.nodeToText).join('')
    if (tag === 'a') {
      const href = node.attribs.href
      const text = inner.trim()
      if (!href || href === text) return inner
      if (!text) return href
      return `[${text}](${href})`
    }
    if (tag === 'li') return `- ${inner.trim()}\n`
    if (singleBreakTags.has(tag)) return `${inner.trim()}\n`
    if (blockTags.has(tag)) return `\n${inner.trim()}\n`
    return inner
  }

/**
 * Convert an HTML snippet to plain text, separating block elements with
 * line breaks and rewriting links as markdown.
 */
  htmlToText (html: string) {
    const $ = cheerio.load(html, null, false)
    return $.root().contents().get().map(this.nodeToText).join('')
      .replace(/[ \t]*\n[ \t]*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  async disconnect () {
    this.transporter.close()
  }
}

export const mail = new Mail()
