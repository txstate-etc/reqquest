import { createMailTemplate } from '../internal.js'
import * as mailTemplates from './templates/index.js'

export async function seedMailTemplates () {
  await Promise.all(Object.values(mailTemplates).map(async ({ subject, body, description, audience, templateKey }) => {
    await createMailTemplate({
      templateKey,
      description,
      audience: audience.join(', '),
      subject,
      body,
      variables: JSON.stringify({
        department: 'string',
        applicationName: 'string',
        loginLink: 'string'
      })
    })
  }))
}
