import type { Feedback } from '@txstate-mws/svelte-forms'
import type { StatusReason } from './types.js'

/**
 * Requirement status -> svelte-forms Feedback type. A status missing from this map is never surfaced as a
 * notification, so this is the one place to narrow which statuses show.
 */
const statusFeedbackType: Record<string, Feedback['type']> = {
  PENDING: 'info',
  WARNING: 'warning',
  DISQUALIFYING: 'error',
  MET: 'success',
  NOT_APPLICABLE: 'info'
}

/**
 * Turn a prompt's `statusReasons` into the `Feedback` objects `FormInlineNotification` renders, so a
 * requirement's reason looks exactly like a svelte-forms validation message.
 *
 * Entries with no reason text are dropped. Identical type+message pairs (the same requirement reached
 * through several programs) collapse into one notification; when the prompt's entries span more than one
 * program, each notification is titled with the program(s) it came from.
 *
 * `blamedOnly` keeps only entries whose requirement explicitly named this prompt in `blame`, which is what
 * the framework's own edit forms pass.
 */
export function statusReasonsToFeedback (statusReasons?: StatusReason[] | null, opts?: { blamedOnly?: boolean }): Feedback[] {
  const entries = (statusReasons ?? []).filter(r => !opts?.blamedOnly || r.blamed)
  const programs = new Set(entries.map(r => r.programName))
  const grouped = new Map<string, { type: Feedback['type'], message: string, programs: Set<string> }>()
  for (const r of entries) {
    const type = statusFeedbackType[r.status]
    const message = r.statusReason?.trim()
    if (!type || !message) continue
    const key = `${type}\u0000${message}`
    const entry = grouped.get(key) ?? { type, message, programs: new Set<string>() }
    entry.programs.add(r.programName)
    grouped.set(key, entry)
  }
  return [...grouped.values()].map(e => ({
    type: e.type,
    message: e.message,
    extra: programs.size > 1 ? { title: [...e.programs].join(', ') } : undefined
  }))
}
