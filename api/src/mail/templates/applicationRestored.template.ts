const subject = 'Your {{programName}} Benefit Has Been Restored'

const body = `Hello,

Your {{programName}} benefit, which had previously been rescinded, has been restored.

Reason: {{reason}}

Please log in to the {{appName}} to review the current status of your request, along with any updates provided by the reviewer or next steps that may require your attention.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}`

export const applicationRestoredTemplate = {
  subject,
  body,
  description: 'Template for when a rescinded application is restored to its prior state',
  audience: ['applicant'],
  templateKey: 'application_restored',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
