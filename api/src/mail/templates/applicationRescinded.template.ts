const subject = 'Update Regarding Your {{appName}} Request'

const body = `Hello,

A status change has occurred regarding your request for {{appName}}. Your previously granted approval for {{programName}} has been rescinded.

The following rationale has been provided:

{{reason}}

Please log in to your account to review specific status details for your application and check for any required next steps.

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
