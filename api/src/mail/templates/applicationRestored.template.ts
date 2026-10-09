const subject = 'Update Regarding Your {{appName}} Request'

const body = `Hello,

A status change has occurred regarding your request for {{appName}}. Your {{programName}} has been restored and is now approved.

The following rationale has been provided:

{{reason}}

Please log in to your account to review specific status details for your application and check for any required next steps.

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
