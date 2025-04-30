import { GraphQLScalarType } from 'graphql'
import { isBlank } from 'txstate-utils'

export const JsonData = new GraphQLScalarType({
  name: 'JsonData',
  description: 'Unstructured JSON data.',
  serialize (value: any): any {
    return value
  },
  parseValue (value: any): any {
    return value
  },
  parseLiteral (ast: any): any {
    return ast.value
  }
})

export function safeParse<T = any> (json: string | null | undefined) {
  if (isBlank(json)) return undefined
  try {
    return JSON.parse(json) as T
  } catch (e) {
    return undefined
  }
}
