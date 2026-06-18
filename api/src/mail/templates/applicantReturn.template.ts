const subject = 'Corrections Needed for Your {{applicationName}} Request'

const body = `Hello,

Your {{applicationName}} request has been reviewed and requires additional information or corrections before processing can continue. A final decision has not yet been made.

Please log in to the application to review the requested updates and submit any required corrections or documentation.

<a href="{{loginLink}}">Login</a>

Thank you,
{{department}}`

export const applicantReturnTemplate = {
  subject,
  body,
  description: 'Template for when corrections are needed, gets sent to applicant',
  audience: ['applicant'],
  templateKey: 'applicant_return'
}
