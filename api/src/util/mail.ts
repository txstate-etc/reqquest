import nodemailer from 'nodemailer'
import util from 'util'
import glob from 'glob'
import handlebars from 'handlebars'
import path from 'path'
import { readFile } from 'fs/promises'
import SMTPPool from 'nodemailer/lib/smtp-pool'
// const util = require('util')
// const { glob } = require('glob')
// const Handlebars = require('handlebars')
// const fsp = require('fs').promises
// const path = require('path')
// const _ = require('txstate-utils')
// const helpers = require('./helpers')

class Mailer {
  transporter: nodemailer.Transporter<SMTPPool.SentMessageInfo, SMTPPool.Options>
  templates: Record<string, any>

  constructor () {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT ?? 25,
      secure: process.env.SMTP_SECURE ?? false,
      ...(process.env.SMTP_SECURE ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, requireTLS: true } : { ignoreTLS: true })
      // pool: true
    })
    this.templates = {}
  }

  // async load () {
  //   const files = await glob('mail/**/*.handlebars')
  //   await Promise.all(files.map(async file => {
  //     const content = await fsp.readFile(file, { encoding: 'utf-8' })
  //     if (/\/partials\//.test(file)) Handlebars.registerPartial(path.basename(file, '.handlebars'), content)
  //     else this.templates[file] = Handlebars.compile(content)
  //   }))
  //   Handlebars.registerHelper('date', function (date) {
  //     return helpers.friendlyDate(date)
  //   })
  //   Handlebars.registerHelper('datetime', function (date) {
  //     return helpers.friendlyDateTime(date)
  //   })
  //   Handlebars.registerHelper('namelist', function (users) {
  //     return users.map((u, idx) => (idx === users.length - 1 && users.length > 1 ? 'and ' : '') + u.fullname).join(', ')
  //   })
  //   Handlebars.registerHelper('ifplural', function (arr, options) {
  //     return arr.length > 1 ? options.fn(this) : options.inverse(this)
  //   })
  //   Handlebars.registerHelper('ifequal', function (o1, o2, options) {
  //     return o1 === o2 ? options.fn(this) : options.inverse(this)
  //   })
  //   Handlebars.registerHelper('ifnotequal', function (o1, o2, options) {
  //     return o1 !== o2 ? options.fn(this) : options.inverse(this)
  //   })
  //   Handlebars.registerHelper('ucfirst', function (str) {
  //     return _.ucfirst(str)
  //   })
  //   Handlebars.registerHelper('join', function (arr, prop, sayand = false) {
  //     return arr.map((itm, idx) => (idx === arr.length - 1 && arr.length > 1 && sayand ? 'and ' : '') + itm[prop]).join(', ')
  //   })
  //   Handlebars.registerHelper('vote', function (vote) {
  //     return vote === 'approve' ? 'approved' : vote === 'deny' ? 'denied' : 'voted not applicable'
  //   })
  // }

  // normalizeobject (obj, target) {
  //   if (Array.isArray(obj)) return obj.map(doc => this.normalizeobject(doc, target))
  //   if (obj.full) return obj.full(target)
  //   if (obj.details) return obj.details(target)
  //   if (obj.toObject) return obj.toObject()
  //   return obj
  // }

  // async sendsingle (from, to, modelName, action, template, document, extra) {
  //   const docfull = this.normalizeobject(document, to)
  //   for (const [key, value] of Object.entries(extra)) {
  //     extra[key] = this.normalizeobject(value, to)
  //   }
  //   const message = template({ ...docfull, ...extra, to: to.details(), from: from.details(), link_base: helpers.absolute() })
  //   const idx = message.indexOf('\n')
  //   const [subject, body] = [message.slice(0, idx), message.slice(idx + 1)]
  //   if (to.valid && !to.valid()) return
  //   try {
  //     await this.transporter.sendMail({
  //       from: 'Change Management <changeman@txstate.edu>',
  //       replyTo: action !== 'approved' && from.emailFormat ? from.emailFormat() : 'Change Management <changeman@txstate.edu>',
  //       to: to.emailFormat(),
  //       subject: subject.trim(),
  //       html: body.trim().replace(/\r?\n/g, '<br>').replace(/(<br>){3,}/ig, '<br><br>')
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // async sendmulti (from, users, modelName, action, document, extra = {}) {
  //   const templatepath = `mail/${modelName}/${action}.handlebars`
  //   const template = this.templates[templatepath]
  //   await Promise.all(
  //     users.map(user => this.sendsingle(from, user, modelName, action, template, document, extra))
  //   )
  // }

  // async send (from, users, modelName, action, document, extra = {}) {
  //   const uniqueusers = _.unique(_.toArray(users), u => u._id).filter(u => u._id !== from._id)
  //   await helpers.populate(uniqueusers, [{ path: 'team' }])
  //   await this.sendmulti(from, uniqueusers, modelName, action, document, extra)
  // }

  // async sendfromsystem ({ to, modelName, action, document = {}, extra = {} }) {
  //   const fakefrom = { details: () => ({}) }
  //   await this.send(fakefrom, to, modelName, action, document, extra)
  // }

  async disconnect () {
    this.transporter.close()
  }
}

export const mailer = new Mailer()
