import type { DateTime } from 'luxon'

export function longDateTime (dt: DateTime) {
  return dt.toFormat("MMMM d, yyyy '@' H:mm a")
}
