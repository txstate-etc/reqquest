import { GraphQLScalarType, Kind, type ValueNode } from 'graphql'

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

const URLScalar = new GraphQLScalarType({
  name: 'URL',
  description: 'A valid URL string',
  serialize (value: string): string {
    // Serialize the value to send to the client
    return value
  },
  parseValue (value: unknown): string {
    // Parse the value received from the client
    if (typeof value !== 'string' || !urlRegex.test(value)) {
      throw new Error('Invalid URL value')
    }
    return value
  },
  parseLiteral (ast: ValueNode): string {
    // Parse the value from an inline argument
    if (ast.kind === Kind.STRING && urlRegex.test(ast.value)) {
      return ast.value
    }
    throw new Error('Invalid URL literal')
  }
})
