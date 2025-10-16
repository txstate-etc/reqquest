import { ObjectType, Field, InputType, Int } from 'type-graphql'

@InputType()
export class Pagination {
  @Field(type => Int, { nullable: true, description: 'The page number to retrieve. If not provided, will default to 1.' })
  page?: number

  @Field(type => Int, { nullable: true })
  perPage?: number
}

@InputType()
export class PaginationWithCursor extends Pagination {
  @Field({ nullable: true })
  cursor?: string
}

@ObjectType()
export class Groupings {
  @Field({ description: 'Label is the name of the grouping. Groupings are indexed to allow for quick filtering of a list of items. i.e. institutionalRoles' })
  label!: string

  @Field({ description: 'Displayed Label for grouping. i.e. Institutional Roles' })
  displayLabel?: string

  @Field(type => [String], { description: 'IDs are the unique values that may be used to group an items. Multiple IDs may be assigned to an item. i.e. ["Staff", "Faculty", "Student"]' })
  ids!: string[]

  @Field({ nullable: true, description: 'Set this to true should be displayed as a column in the User list view.' })
  useInList?: boolean

  @Field({ nullable: true, description: 'Set this to true should be available as a filter in the User list view.' })
  useInFilters?: boolean
}

@ObjectType()
export class PaginationInfoShared {
  @Field({ nullable: true, description: 'The number of items per page. Null if pagination was not requested/forced because results per page is unlimited.' })
  perPage?: number

  @Field({ description: 'Indicates whether requesting the next page would provide more results. Especially useful for models that cannot provide total item count for practical reasons. Note that over time, more results can appear and make this answer wrong, so in some circumstances it makes sense to request another page anyway.' })
  hasNextPage!: boolean

  @Field(type => [Groupings], { nullable: true, description: 'List of indexed grouping data related to items within a page. Often used for filtering items.' })
  groupings?: Groupings[]
}

@ObjectType()
export class PaginationInfo extends PaginationInfoShared {
  constructor (page?: number) {
    super()
    this.currentPage = page ?? 1
  }

  @Field({ description: 'The current page number, starting at 1. This is always provided - if pagination was not requested, will return 1.' })
  currentPage: number
}

@ObjectType()
export class PaginationInfoWithTotalItems extends PaginationInfo {
  @Field({ nullable: true, description: 'If possible, the total number of results will be provided. The API may return null if calculating the total is impractical. If pagination was not requested/forced, will equal the result count.' })
  totalItems?: number
}

@ObjectType()
export class PaginationInfoWithCursor extends PaginationInfoShared {
  @Field({ nullable: false, description: 'The current page number, starting at 1. If pagination was not requested, will return 1. If a cursor was requested, will return null.' })
  currentPage?: number

  @Field({ description: 'A cursor that may be provided to select the next set of results. Using a cursor is generally preferable when you want to keep adding more results to an existing display and you don\'t want to accidentally skip over an entry or show one twice if the list is altered between fetching of page sets. Null if pagination was not requested/enforced.' })
  cursor?: string
}

@ObjectType()
export class PaginationInfoWithCursorAndTotalItems extends PaginationInfo {
  @Field({ nullable: true, description: 'If possible, the total number of results will be provided. The API may return null if calculating the total is impractical. If pagination was not requested/forced, will equal the result count.' })
  totalItems?: number
}

@ObjectType()
export class PaginationResponse {}
