import { DateTime } from 'luxon'

// Date Formatting Functions

export function longDateTime (dt: DateTime | string) {
  const dateTime = typeof dt === 'string' ? DateTime.fromISO(dt) : dt
  return dateTime.toFormat("MMMM d, yyyy '@' H:mm a")
}

export function longNumericTime (dt: DateTime | string) {
  const dateTime = typeof dt === 'string' ? DateTime.fromISO(dt) : dt
  return dateTime.toFormat('MM/dd/yyyy h:mm a')
}

export function machineDateTime (dt: DateTime | string) {
  const dateTime = typeof dt === 'string' ? DateTime.fromISO(dt) : dt
  return dateTime.toISO({ suppressMilliseconds: true })
}
