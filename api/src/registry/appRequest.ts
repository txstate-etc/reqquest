import { FastifyRequest } from 'fastify'
import { AccessRoleGroup, AccessUser, AccessUserGroupingInput, AccessUserIdentifierInput, ApplicationPhase, AppRequest, AppRequestStatus, RQContext, RQContextClass } from '../internal.js'
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

export interface RemoteGroup {
  groupName: string
  managers?: { fullname: string, email?: string }[]
  dateCreated?: DateTime
}

export interface SearchUsersFilter {
  users?: AccessUser[]
  identifiers?: AccessUserIdentifierInput[]
  groups?: string[]
  groupings?: AccessUserGroupingInput[]
}

/**
 * The UserIndexDefinition is used to create the Admin User list columns and create
 * indexes to group users. The data will be generated and updated upon each user login\
 * and saved in the database.
 *
 * NOTE: As category keys and values are indexes the distinct values for each category
 * may be quickly be pulled directly from the database. For example an institutional
 * list of roles including Faculty, Staff and Students would only return Staff and Students
 * if there are only Staff and Students within the database during the time of the query.
 * If the list is empty then the User list should skip displaying the Label as a column.
 * The filter should also exclude the category as that would just return an empty set if
 * any role was used as a filter value.
 */
export interface UserIndexDefinition<DataType = any> {
  /**
   * A unique, case-insensitive, stable key for the index. This will be used to namespace
   * grouping values for a label.
   */
  label: string
  /**
   * Used to display the grouping label name and does not need to be Unique, nor is required
   * as the label value may be used to display when this field is left absent.
   */
  displayLabel?: string
  /**
   * Set this to true should be displayed as a column in the User list view.
   */
  useInList?: boolean
  /**
   * Set this to true should be available as a filter in the User list view.
   * The two or three of the first available filters will be used as quick filters,
   * the rest will be in the filter UI popout. Note that if Filter will only be available
   * should there be more then one value to filter on.
   */
  useInFilters?: boolean
  /**
   * Convert all existing distinct DataType/ids associate with the label
   * into an array of strings to be saved and indexed into the database.
   * If already an array of strings then may be optional.
   */
  save?: (data: DataType) => string[]
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
     *
     * groupings data will included within the otherData field and utilized by the login to filter through
     * the retrieved UserIndexDefinition(s) and update the local database with the remote data that was
     * retrieved.
     */
    byLogins: (logins: string[], applicableGroups: string[]) => Promise<ReqquestUser[]>
    /**
     * Provide a function that will return a list of users, given a search query users,
     * identifiers, groups, or other indexed grouping information.
     *
     * The function should return the search results of user objects, where the user object contains the login,
     * fullname, and (application) groups, or other groupings (such as Institution Roles) the user belongs to.
     * The list of users objects may be retrieved locally or from an outside database or system such as LDAP.
     * Upon login the data will be retrieved per user and updated and saved within the database.
     *
     */
    searchUsers?: (query: SearchUsersFilter) => Promise<AccessUser[]>
    /**
     * List of grouping categories to index, ordered by how they are displayed in the user listing columns.
     */
    indexes?: UserIndexDefinition[]
  }
  /**
   * Provide a function that will return a list of group properties, given a list of group names.
   *
   * The function should return a map of group names to group information, where the group information contains
   * the group name, manager (with firstname, lastname, and email), and dateAdded.
   */
  groups?: (groupnames: string[]) => Promise<RemoteGroup[]>
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
  async getCtx (req: FastifyRequest) {
    const ctx = new appConfig.customContext(req)
    await ctx.waitForAuth()
    return ctx
  }
} as AppDefinition & { customContext: RQContextClass, getCtx: (req: FastifyRequest) => Promise<RQContext> }
