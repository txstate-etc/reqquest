import { GraphQLScalarType, Kind } from 'graphql'

export function makeSnakeCase (str: string) {
  return str.normalize('NFKD').toLocaleLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_/, '').replace(/_$/, '')
}

export class SnakeCaseString extends String {}

export const SnakeCaseStringScalar = new GraphQLScalarType({
  name: 'SnakeCaseString',
  description: 'This string must only contain URL-safe and lower-case characters.',
  serialize (value: string): string {
    return value
  },
  parseValue (value: string): string {
    if (typeof value !== 'string') {
      throw new Error('SnakeCaseString must be a string')
    }
    return makeSnakeCase(value)
  },
  parseLiteral (ast: any): string {
    if (ast.kind !== Kind.STRING) {
      throw new Error('SnakeCaseString must be a string')
    }
    return makeSnakeCase(ast.value)
  }
})
