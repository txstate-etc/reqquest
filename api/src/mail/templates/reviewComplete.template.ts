const subject = 'Your {{appName}} Request Review Is Complete'

const body = `Hello,

The review of your request is complete.

Please log in to the {{appName}} to review the current status of your request and any updates provided by the reviewer or next steps that may require your attention.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}
`

export const reviewCompleteTemplate = {
  subject,
  body,
  description: 'Template for when review is complete',
  audience: ['applicant'],
  templateKey: 'review_complete',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
