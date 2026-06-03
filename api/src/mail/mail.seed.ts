import { readFile } from 'fs/promises'
import { glob } from 'glob'
import { createMailTemplate } from '../internal.js'

export async function seedMailTemplates () {
  const files = await glob('/usr/app/api/src/mail/**/*.handlebars')
  await Promise.all(files.map(async file => {
    const content = await readFile(file, { encoding: 'utf-8' })
    if (/\/partials\//.test(file)) {
      // Handlebars.registerPartial(path.basename(file, '.handlebars'), content)
    } else {
      const idx = content.indexOf('\n')
      const [subject, body] = [content.slice(0, idx), content.slice(idx + 1)]
      createMailTemplate({
        templateKey: file.split('/').pop()?.split('.')[0] ?? '',
        description: 'description',
        audience: 'applicants',
        subject,
        body,
        variables: JSON.stringify({
          department: 'string',
          applicationName: 'string',
          loginLink: 'string'
        })
      })
      content
    }
  }))
}
