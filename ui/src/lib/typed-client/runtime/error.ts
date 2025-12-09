// @ts-nocheck
export class GenqlError extends Error {
  errors: GraphqlError[] = []
    /**
     * Partial data returned by the server
     */
  data?: any
  constructor (errors: any[], data: any) {
    let message = Array.isArray(errors)
      ? errors.map(x => x?.message || '').join('\n')
      : ''
    if (!message) {
      message = 'GraphQL error'
    }
    super(message)
    this.errors = errors
    this.data = data
  }
}

interface GraphqlError {
  message: string
  locations?: {
    line: number
    column: number
  }[]
  path?: string[]
  extensions?: Record<string, any>
}
