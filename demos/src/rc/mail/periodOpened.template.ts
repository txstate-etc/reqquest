const subject = '{{periodName}} Is Now Open for {{appName}} Requests'

const body = `Hello,

{{periodName}} opened for {{appName}} requests on {{openDate}}. You submitted a request in the previous period, so we wanted to let you know a new one is available.
{{#if closeDate}}
This period closes on {{closeDate}}.
{{/if}}
If you would like to apply again, please log in to start your request.

<a href="{{loginLink}}">Login</a>

Thank you,
{{signature}}`

/**
 * rc-owned mail template. Downstream projects own their templates the same way the platform owns
 * its built-in ones: a plain object like this, inserted by a migration with `createMailTemplate`.
 */
export const periodOpenedTemplate = {
  subject,
  body,
  description: 'Sent to applicants who submitted a request in the previous period when a new period opens. Queued by the rc demo\'s period_opened_notification scheduled hook.',
  audience: ['applicant'],
  templateKey: 'period_opened',
  variables: {
    loginLink: process.env.PUBLISHED_BASE_URL
  }
}
