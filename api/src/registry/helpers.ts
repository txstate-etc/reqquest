import { MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import * as cheerio from 'cheerio'

export { MutationMessage } from '@txstate-mws/graphql-server'

// NOTE: Finding that there are so many places where links may reside
// so adding to a list, hopefully this is all of them.
// xlink:href may exist in SVG links
const URL_ATTRS = ['href', 'src', 'action', 'formaction', 'xlink:href']

// Browsers strip ASCII control chars (incl. tab/newline) from URL schemes before parsing,
// so `j\tavascript:` is treated as `javascript:`. Strip those before testing.
function isJavascriptUrl (value: string) {
  return /^\s*javascript:/i.test(value.replace(/[\x00-\x1F\x7F]/g, ''))
}

// Simple sanitization to prevent XSS
// Ensure valid html and closed tags
export function cleanHTML (html: string) {
  const $ = cheerio.load(html)
  // <embed> SVG files may contain executable <script> tags,
  //   which run when the browser parses the embedded document.Data URI Exploitation:
  //   Using data:text/html;base64,... inside the src attribute, which can allow for
  //   direct malicious HTML/JS code injection, rather than linking to a file.
  // <iframe> may include srcdoc attribute which can have script tags;
  // so remove for safety as notes should not have iframes.
  // <object> may act as iframe or embed so remove
  // NOTE: Instead of filtering formaction, we may wish to remove <form> completely.
  $('iframe').remove()
  $('object').remove()
  $('embed, script, style, link[rel="stylesheet"]').remove()
  $('[style]').removeAttr('style')
  $('*').each(function () {
    const attrs = $(this).attr()
    // attrs may be undefined, so do not try to iterate over.
    if (!attrs) return
    for (const attrName in attrs) {
      if (attrName.startsWith('on')) $(this).removeAttr(attrName)
    }
  })
  for (const attr of URL_ATTRS) {
    $(`[${attr}]`).each(function () {
      const value = $(this).attr(attr)
      if (value != null && isJavascriptUrl(value)) $(this).removeAttr(attr)
    })
  }
  return $('body').html() ?? ''
}

export function validateHTML (html: string, arg: string) {
  const warnings: MutationMessage[] = []
  const $ = cheerio.load(html)
  if ($('iframe').length > 0) warnings.push({ type: MutationMessageType.warning, message: '<iframe> tags will be removed.', arg })
  if ($('embed').length > 0) warnings.push({ type: MutationMessageType.warning, message: '<embed> tags will be removed.', arg })
  if ($('object').length > 0) warnings.push({ type: MutationMessageType.warning, message: '<object> tags will be removed.', arg })
  if ($('script').length > 0) warnings.push({ type: MutationMessageType.warning, message: '<script> tags will be removed.', arg })
  if ($('style').length > 0) warnings.push({ type: MutationMessageType.warning, message: '<style> tags will be removed.', arg })
  if ($('link[rel="stylesheet"]').length > 0) warnings.push({ type: MutationMessageType.warning, message: 'Stylesheet <link> tags will be removed.', arg })
  if ($('[style]').length > 0) warnings.push({ type: MutationMessageType.warning, message: 'Inline style attributes will be removed.', arg })
  let hasEventHandler = false
  $('*').each(function () {
    const attrs = $(this).attr()
    if (!attrs) return
    for (const attrName in attrs) {
      if (attrName.startsWith('on')) {
        hasEventHandler = true
        return false
      }
    }
  })
  if (hasEventHandler) warnings.push({ type: MutationMessageType.warning, message: 'Inline event handlers (e.g. onclick) will be removed.', arg })
  let hasJavascriptUrl = false
  for (const attr of URL_ATTRS) {
    $(`[${attr}]`).each(function () {
      const value = $(this).attr(attr)
      if (value != null && isJavascriptUrl(value)) {
        hasJavascriptUrl = true
        return false
      }
    })
    if (hasJavascriptUrl) break
  }
  if (hasJavascriptUrl) warnings.push({ type: MutationMessageType.warning, message: 'javascript: URLs will be removed.', arg })
  return warnings
}
