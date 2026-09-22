const subject = 'Reminder: Your {{appName}} Request Closes {{closeDate}}'

const body = `Hello,

A {{appName}} request for {{periodName}} was started but has not yet been submitted. The application period closes on {{closeDate}}, {{daysUntilClose}} day(s) from now. Requests that are not submitted by then cannot be considered.

Please log in to finish and submit your request.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}`

export const periodClosingReminderTemplate = {
  subject,
  body,
  description: 'Reminder sent to applicants who have started but not submitted a request as the period close date approaches. Cadence is set by emailConfig.periodClosing.daysBefore and emailConfig.periodClosing.reminderDays.',
  audience: ['applicant'],
  templateKey: 'period_closing_reminder',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
