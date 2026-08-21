const subject = 'Your {{programName}} Benefit Has Been Rescinded'

const body = `Hello,

Your {{programName}} benefit has been rescinded.

Reason: {{reason}}

Please log in to the {{appName}} to review the current status of your request, along with any updates provided by the reviewer or next steps that may require your attention.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}`

export const applicationRescindedTemplate = {
  subject,
  body,
  description: 'Template for when a previously approved/accepted application is rescinded',
  audience: ['applicant'],
  templateKey: 'application_rescinded',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
