import { GraphQLError, GraphQLScalarType } from 'graphql'
import { Readable } from 'stream'

export const GraphQLDownload = new GraphQLScalarType({
  name: 'Download',
  description: 'The `Download` scalar type represents a file download.',
  parseValue (value: any) {
    if (value instanceof Readable) return value
  },
  parseLiteral (node) {
    throw new GraphQLError('Download literal unsupported.', node)
  },
  serialize (value: Readable) {
    return value
  }
})
