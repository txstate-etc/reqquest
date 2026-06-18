const subject = 'Your {{applicationName}} Request Review Is Complete'

const body = `Hello,

The review of your request is complete.

Please log in to the {{applicationName}} to review the current status of your request and any updates provided by the reviewer or next steps that may require your attention.

<a href="{{loginLink}}">Login</a>

Thank you,
{{department}}
`

export const reviewCompleteTemplate = {
  subject,
  body,
  description: 'Template for when review is complete',
  audience: ['applicant'],
  templateKey: 'review_complete'
}

// const applicationName = (applicationName: string) => `Your ${applicationName} Request Review Is Complete`

// const body = ({ applicationName, loginLink, department }: { applicationName: string, loginLink: string, department: string }) => `Hello,

// The review of your request is complete.

// Please log in to the ${applicationName} to review the current status of your request and any updates provided by the reviewer or next steps that may require your attention.

// ${loginLink}

// Thank you,
// ${department}

// `
