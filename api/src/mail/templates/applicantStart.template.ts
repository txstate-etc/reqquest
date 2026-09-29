const subject = 'Your {{appName}} Request Has Been Started'

const body = `Hello,

A {{appName}} request has been started under your account. Please note that your request cannot be processed until all required sections are finalized and submitted.

Please log in to finish your entries and submit your request.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}`

export const appRequestStartTemplate = {
  subject,
  body,
  description: 'Template for when a new application request has been started, by the applicant or on their behalf',
  audience: ['applicant'],
  templateKey: 'app_request_start',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
