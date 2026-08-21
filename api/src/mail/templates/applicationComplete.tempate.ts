const subject = 'Your {{programName}} Benefit Determination Is Available'

const body = `Hello,

A determination has been made for your {{programName}} benefit request.

Please log in to the {{appName}} to review your determination, along with any updates provided by the reviewer or next steps that may require your attention.

If you applied for multiple benefit programs, reviews for your remaining requests may still be in progress. You will receive additional notifications as those determinations become available.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}`

export const applicationComplete = {
  subject,
  body,
  description: 'Template for when single application is complete',
  audience: ['applicant'],
  templateKey: 'application_complete',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
