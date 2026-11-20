import type { SchemaObject } from '@txstate-mws/fastify-shared'

/**
 * What a `PromptActionButton` from `@reqquest/ui` writes into prompt data when it is clicked. Each
 * click gets a fresh random `clickId`, so a save whose `clickId` differs from the previous save's is
 * a click, and a save carrying the same `clickId` again (every autosave after the click) is not.
 *
 * `at` is when the user clicked, by their browser's clock - good enough to show "Sent on Nov 19",
 * not good enough for an audit trail (the activity log has the server's time for that). `snapshot`
 * is whatever the form component passed the button to remember, usually the text that was acted
 * on, so the form can tell the user when it has been edited since.
 */
export interface PromptActionRecord<SnapshotType = unknown> {
  clickId: string
  at: string
  snapshot?: SnapshotType
}

/**
 * Put this in your prompt's JSON schema at the path you give the `PromptActionButton`. Your schema
 * probably says `additionalProperties: false`, and without this the save will be rejected.
 *
 * ```ts
 * properties: {
 *   note: { type: 'string' },
 *   sendNote: promptActionSchema
 * }
 * ```
 */
export const promptActionSchema = {
  type: 'object',
  properties: {
    clickId: { type: 'string' },
    at: { type: 'string' },
    snapshot: {}
  },
  required: ['clickId', 'at'],
  additionalProperties: false
} as const satisfies SchemaObject

/**
 * For a prompt's `afterUpdate`: returns the action record if the user clicked the button since the
 * last save, otherwise undefined. Pass the same path from `data` and `oldData`.
 *
 * Use the returned record's `clickId` in a `dedupKey` when you send mail, so the one click cannot
 * turn into two emails no matter what retries happen underneath you.
 */
export function promptActionFired<T extends PromptActionRecord<any>> (current: T | undefined | null, previous: T | undefined | null): T | undefined {
  if (current?.clickId == null) return undefined
  if (current.clickId === previous?.clickId) return undefined
  return current
}
