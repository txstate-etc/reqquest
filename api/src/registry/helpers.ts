import { MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'

export { MutationMessage } from '@txstate-mws/graphql-server'

export function cleanHTML (html: string) {
  // Simple sanitization to prevent XSS, may replace this later
  return html.replace(/<script.*?>.*?<\/script>/gi, '') // Remove script tags
    .replace(/on\w+=".*?"/gi, '') // Remove inline event handlers
    .replace(/"javascript:/gi, '"') // Remove javascript: URLs
}

export function validateHTML (html: string, arg: string) {
  const errors: MutationMessage[] = []
  // Simple validation to prevent XSS, may replace this later
  if (/<script.*?>/i.test(html)) errors.push({ type: MutationMessageType.error, message: 'May not contain <script> tags.', arg })
  if (/on\w+=/i.test(html)) errors.push({ type: MutationMessageType.error, message: 'May not contain inline event handlers (e.g. onclick).', arg })
  if (/javascript:/i.test(html)) errors.push({ type: MutationMessageType.error, message: 'May not contain javascript: URLs.', arg })
  return errors
}
