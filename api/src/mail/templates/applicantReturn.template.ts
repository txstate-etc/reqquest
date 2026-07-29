const subject = 'Corrections Needed for Your {{appName}} Request'

const body = `Hello,

Your {{appName}} request has been reviewed and requires additional information or corrections before processing can continue. A final decision has not yet been made.

Please log in to the application to review the requested updates and submit any required corrections or documentation.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}`

export const appRequestReturnTemplate = {
  subject,
  body,
  description: 'Template for when corrections are needed, app request gets sent to applicant',
  audience: ['applicant'],
  templateKey: 'app_request_return',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
