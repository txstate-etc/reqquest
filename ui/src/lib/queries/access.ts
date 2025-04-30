export interface IAccessItem {
  description?: string
  allow: boolean
}
export interface IAccess {
  global: {
    mayViewOwnDashboard: IAccessItem
  }
  application: {
    mayViewOwn: IAccessItem
    mayView: IAccessItem
    mayCreateOwn: IAccessItem
    mayCreate: IAccessItem
  }
}

export interface IAccessResponse {
  access: IAccessItem
}

export const GET_ACCESS = `
  query GetAccess {
    access {
      global{
        mayViewOwnDashboard{
          allow
        }
        mayViewApplicantDashboard{
          allow
        }
      }
      application{
        mayViewOwn{
          allow
        }
        mayView{
          allow
        }
        mayCreateOwn{
          allow
        }
        mayCreate{
          allow
        }
      }
    }
  }
`
