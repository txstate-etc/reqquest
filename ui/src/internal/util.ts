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

export function booleanToWord (bool?: boolean) {
  return bool ? 'Yes' : 'No'
}

export function deepEqual(obj1: any, obj2: any): boolean {  
  if (obj1 === obj2) return true
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) return false
  for (const key of keys1) if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key]))  return false
  return true
}