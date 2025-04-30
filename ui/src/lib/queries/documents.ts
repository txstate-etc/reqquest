export const DOCUMENT_FIELDS = `
  id
  pageCount
`

export const GET_DOCUMENTS = `
  query getDocuments ($aid:String!, $docType:String!) {
    bdmDocQuery (aid:$aid, docType:$docType) {
      ${DOCUMENT_FIELDS}
    }
  }
`
export class DocResponse {
  constructor (item: any) {
    this.ID = item.ID
    this.PageCount = item.PageCount
    this.WorkingCopy = item.IsWorkingCopy
    this.Attributes = item.Attributes
  }

  ID: number
  PageCount: number
  WorkingCopy: boolean
  Attributes?: Record<string, string | number | boolean>
}
