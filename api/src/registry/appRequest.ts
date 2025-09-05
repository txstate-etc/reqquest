import { FastifyRequest } from 'fastify'
import { ApplicationPhase, AppRequest, AppRequestStatus, RQContext, RQContextClass } from '../internal.js'
import { DateTime } from 'luxon'

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
   * Configure whether this system allows multiple app requests for the same user in the same period.
   */
  multipleRequestsPerPeriod?: boolean
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
    /**
     * Provide a function that will return a list of users and their groups, given a search query string.
     *
     * The function should return the search results of user objects, where the user object contains the login,
     * fullname, and groups the user belongs to. The list of users objects may be retrieved locally or from an
     * outside database or system such as LDAP.
     *
     * The searchQuery parameter may be a set of keywords or substrings of the account that reqquest is
     * interested in.
     */
    searchUsers: (searchQuery: string) => Promise<ReqquestUser[]>
  }
  /**
   * Provide a function that will return a list of group properties, given a list of group names.
   *
   * The function should return a map of group names to group information, where the group information contains
   * the group name, manager (with firstname, lastname, and email), and dateAdded.
   */
  groups: (groupnames: string[]) => Promise<{ name: string, manager: { fullname: string, email: string }, dateAdded: DateTime }[]>
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

  hooks?: {
    /**
     * Code that should run any time the status of an app request changes. Useful for
     * sending emails or other notifications, or triggering automations.
     *
     * oldPhase should only be null on creation.
     */
    appRequestStatus?: (ctx: RQContext, appRequest: AppRequest, oldStatus?: AppRequestStatus) => void | Promise<void>
    /**
     * Code that should run any time an app request is closed. Useful for
     * sending emails or other notifications, or triggering automations.
     */
    closeAppRequest?: (ctx: RQContext, appRequest: AppRequest) => void | Promise<void>
    /**
     * Code that should run any time the application phase changes. Useful for
     * triggering automations or email notifications, especially workflow notifications.
     *
     * This hook will not fire on app request creation, use `appRequestStatus` instead.
     */
    applicationPhase?: (ctx: RQContext, appRequest: AppRequest, programKey: string, oldPhase: ApplicationPhase) => void | Promise<void>
    /**
     * Code that should run any time a prompt for an app request is updated. Useful for
     * triggering automations or email notifications. Will only be called if the old data
     * is different from the new data.
     */
    updatePrompt?: (ctx: RQContext, appRequest: AppRequest, appRequestData: AppRequestData, promptKey: string, oldData: any) => void | Promise<void>
  }
}

export const appConfig = {
  getCtx (req: FastifyRequest) {
    return new appConfig.customContext(req)
  }
} as AppDefinition & { customContext: RQContextClass, getCtx: (req: FastifyRequest) => RQContext }
