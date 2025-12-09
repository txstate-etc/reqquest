// @ts-nocheck

export interface ExecutionResult<TData = Record<string, any>> {
  errors?: Error[]
  data?: TData | null
}

export type ArgMap<keyType = number> = Record<string, [keyType, string] | [keyType] | undefined>

export type CompressedField<keyType = number> = [
    type: keyType,
    args?: ArgMap<keyType>
]

export type CompressedFieldMap<keyType = number> = Record<string, CompressedField<keyType> | undefined>

export type CompressedType<keyType = number> = CompressedFieldMap<keyType>

export interface CompressedTypeMap<keyType = number> {
  scalars: keyType[]
  types: Record<string, CompressedType<keyType> | undefined>
}

// normal types
export interface Field<keyType = number> {
  type: keyType
  args?: ArgMap<keyType>
}

export type FieldMap<keyType = number> = Record<string, Field<keyType> | undefined>

export type Type<keyType = number> = FieldMap<keyType>

export interface TypeMap<keyType = number> {
  scalars: keyType[]
  types: Record<string, Type<keyType> | undefined>
}

export type LinkedArgMap = Record<string, [LinkedType, string] | undefined>
export interface LinkedField {
  type: LinkedType
  args?: LinkedArgMap
}

export type LinkedFieldMap = Record<string, LinkedField | undefined>

export interface LinkedType {
  name: string
  fields?: LinkedFieldMap
  scalar?: string[]
}

export type LinkedTypeMap = Record<string, LinkedType | undefined>
