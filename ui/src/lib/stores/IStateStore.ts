interface IStateStore<T> {
  isUpdating: boolean
  lastUpdate: Date
  data: T[]
}
