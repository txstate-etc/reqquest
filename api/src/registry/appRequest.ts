import { FastifyRequest } from 'fastify'
import { AppRequest, RQContext, RQContextClass } from '../internal.js'

export interface AppRequestData {
  [keys: string]: any
  savedAtVersion: string
}

export interface ReqquestUser {
  login: string
  fullname: string
  groups: string[]
  otherInfo?: any
  /**
   * Provide any alternate unique identifiers aside from the user's login. Perhaps they also
   * have an employee ID or a student ID.
   *
   * e.g. { label: 'Employee ID', value: '123456' }
   */
  otherIdentifiers?: { label: string, value: string }[]
}

export interface AppDefinition {
  /**
   * Provide a function that will determine whether applicants are allowed to
   * reopen their applications after they have been cancelled. Basic checks will
   * still be performed if this returns true, like whether the application
   * period has concluded.
   */
  applicantMayReopen?: (appRequest: AppRequest) => boolean | Promise<boolean>
  /**
   * Instead of copying user and group data into the database, reqquest leaves it to the implementing application
   * to provide this data. This is useful for applications that already have a user and group database (e.g. Active Directory).
   *
   * If you do not have an outside database, you can provide migrations to create tables and store it locally.
   */
  userLookups: {
    /**
     * Provide a function that will return a list of users and their groups, given a list of logins.
     *
     * The function should return a map of logins to user objects, where the user object contains the login,
     * fullname, and groups the user belongs to.
     *
     * The applicableGroups parameter is a list of groups that reqquest is interested in. If you prefer, you can
     * limit your query to only return those groups, but returning extra groups is also acceptable.
     */
    byLogins: (logins: string[], applicableGroups: string[]) => Promise<ReqquestUser[]>
  }
  /**
   * Authentication scopes. Provide a full list of scopes that might show up
   * on a valid JWT for this application. For instance, if your application has
   * a method to log a student's parent in with the 'parent' scope, you should
   * include that scope here.
   *
   * The list will be used to populate the dropdown when administrators are creating
   * roles. Each scope must have its own set of roles.
   */
  scopes?: string[]
}

export const appConfig = {
  getCtx (req: FastifyRequest) {
    return new appConfig.customContext(req)
  }
} as AppDefinition & { customContext: RQContextClass, getCtx: (req: FastifyRequest) => RQContext }
