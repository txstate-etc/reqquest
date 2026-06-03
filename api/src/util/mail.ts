import { createTransport, Transporter } from 'nodemailer'
import Handlebars from 'handlebars'
import path from 'path'
import { readFile } from 'fs/promises'
import SMTPPool from 'nodemailer/lib/smtp-pool'
import { ucfirst, unique } from 'txstate-utils'
import { glob } from 'glob'

class Mailer {
  transporter: Transporter<SMTPPool.SentMessageInfo, SMTPPool.Options>
  templates: Record<string, any>

  constructor () {
    this.transporter = createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT ?? 25,
      secure: process.env.SMTP_SECURE ?? false,
      ...(process.env.SMTP_SECURE ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, requireTLS: true } : { ignoreTLS: true })
      // pool: true
    } as SMTPPool.Options)
    this.templates = {}
  }

  async load () {
    const files = await glob('/usr/app/api/src/mail/**/*.handlebars')
    await Promise.all(files.map(async file => {
      const content = await readFile(file, { encoding: 'utf-8' })
      if (/\/partials\//.test(file)) Handlebars.registerPartial(path.basename(file, '.handlebars'), content)
      else this.templates[file] = Handlebars.compile(content)
    }))
  }

  async sendsingle ({ from, to, template }: { from?: string, to: string, template: any }) {
    const message = template({ to, from, link_base: 'helpers.absolute()' })
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

  async sendmulti ({ from, users, modelName, action }: { from?: string, users: string[], modelName: string, action: string }) {
    const templatepath = `mail/${modelName}/${action}.handlebars`
    const template = this.templates[templatepath]
    await Promise.all(
      users.map(to => this.sendsingle({ from, to, template }))
    )
  }

  async send ({ from, users, modelName, action }: { from?: string, users: string[], modelName: string, action: string }) {
    const uniqueusers = unique(users).filter(u => u !== from)
    await this.sendmulti({ from, users: uniqueusers, modelName, action })
  }

  async sendfromsystem (to: string, modelName: string, action: string) {
    await this.send({ users: [to], modelName, action })
  }

  async disconnect () {
    this.transporter.close()
  }
}

export const mailer = new Mailer()
