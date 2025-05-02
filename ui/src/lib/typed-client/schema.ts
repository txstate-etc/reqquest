// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Boolean: boolean,
    DateTime: any,
    ID: string,
    JsonData: any,
    String: string,
}

export interface Access {
    createPeriod: Scalars['Boolean']
    /** Current user is permitted to create new roles in the role management UI. */
    createRole: Scalars['Boolean']
    viewApplicantInterface: Scalars['Boolean']
    viewDefinitionManagement: Scalars['Boolean']
    viewPeriodManagement: Scalars['Boolean']
    viewReviewerInterface: Scalars['Boolean']
    /** Current user is permitted to view the role management UI. */
    viewRoleManagement: Scalars['Boolean']
    __typename: 'Access'
}

export interface AccessControl {
    description: Scalars['String']
    name: Scalars['String']
    tagType: AccessSearchType
    /** A list of all possible tags for the control. Null if tagging is not supported for the control. */
    tags: (AccessTag[] | null)
    __typename: 'AccessControl'
}

export interface AccessRole {
    actions: RoleActions
    grants: AccessRoleGrant[]
    groups: Scalars['String'][]
    id: Scalars['ID']
    name: Scalars['String']
    scope: (Scalars['String'] | null)
    __typename: 'AccessRole'
}

export interface AccessRoleGrant {
    /**
     * 
     *     If true, this grant allows the action specified by the selected controls. If false, it removes
     *     the controls.
     * 
     *     Removing a control only happens within the context of a single role. If another role grants the
     *     same control, the action is allowed. This is more of an exception system than a denial
     *     system. So you can do something like add the "view" control to the "movie" subject type in one
     *     grant, and then in a second grant in the same role, remove it from "The Princess Bride". Now you
     *     have a role that grants "view" on all movies _except_ The Princess Bride. If the user has another role
     *     that grants "view" on The Princess Bride (or on all movies), they can view it based on that other role.
     *   
     */
    allow: Scalars['Boolean']
    id: Scalars['ID']
    /**
     * 
     *     The specific subject instance this grant applies to, e.g. if subjectType is "movie",
     *     subject might be "The Princess Bride", and the grant applies to that movie. If null,
     *     the grant applies to all movies. It's a little more complicated than that when we consider
     *     the "allow" setting, see that description for more details.
     *   
     */
    subject: (Scalars['String'] | null)
    /** The type of subject this grant applies to, e.g. "movie". */
    subjectType: Scalars['String']
    __typename: 'AccessRoleGrant'
}

export interface AccessRoleValidatedResponse {
    accessRole: (AccessRole | null)
    messages: MutationMessage[]
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success: Scalars['Boolean']
    __typename: 'AccessRoleValidatedResponse'
}


/** The way that this list should be interacted with. */
export type AccessSearchType = 'NONE' | 'SEARCH' | 'SELECT'

export interface AccessSubjectInstance {
    id: Scalars['ID']
    name: Scalars['String']
    __typename: 'AccessSubjectInstance'
}

export interface AccessSubjectType {
    /** A list of all possible controls for this subjectType. Use this to populate the control dropdown when creating a grant. */
    controls: AccessControl[]
    name: Scalars['String']
    /** The way that subject instances are added to the grant. */
    subjectSearchType: AccessSearchType
    /** A list of all possible instances of this subjectType. Use this to populate the subject dropdown when creating a grant. */
    subjects: AccessSubjectInstance[]
    __typename: 'AccessSubjectType'
}

export interface AccessTag {
    category: (Scalars['String'] | null)
    categoryLabel: (Scalars['String'] | null)
    name: Scalars['String']
    tag: Scalars['String']
    __typename: 'AccessTag'
}


/** A user that has or once had access to the system. */
export interface AccessUser {
    groups: Scalars['String'][]
    login: Scalars['ID']
    otherIdentifiers: AccessUserIdentifier[]
    /** A JSON object containing any information about the user that the implementing application wants to store. Could be useful for constructing personalized UI. */
    otherInfo: (Scalars['JsonData'] | null)
    roles: AccessRole
    __typename: 'AccessUser'
}


/** A label and ID pair for an external user unique ID. For example, { label: "Student ID", id: "123456" } */
export interface AccessUserIdentifier {
    /** The unique ID for this identifier, e.g. "123456". */
    id: Scalars['ID']
    /** The label for this identifier, e.g. "Student ID". */
    label: Scalars['String']
    __typename: 'AccessUserIdentifier'
}


/** Represents a group of applications all being applied for at the same time. As part of the request, multiple applications will be created and either eliminated as ineligible or submitted for approval. */
export interface AppRequest {
    applications: Application[]
    /** Date that this request was considered closed and no longer editable. If active or re-opened, will be null. If closed again, will be the second closure date. */
    closedAt: (Scalars['DateTime'] | null)
    createdAt: Scalars['DateTime']
    /** All data that has been gathered from the user for this request. It is a Record whose properties are the prompt keys and values are the data gathered by the corresponding prompt dialog. */
    data: Scalars['JsonData']
    id: Scalars['ID']
    status: AppRequestStatus
    submitEligible: Scalars['Boolean']
    updatedAt: Scalars['DateTime']
    __typename: 'AppRequest'
}


/**
 * 
 *     The status of an appRequest. This status is computed based on the status recorded in
 *     the database and of the requirements for all applications. The possible statuses for each
 *     database status are as follows:
 * 
 *     STARTED: PREQUAL or QUALIFICATION depending on requirement statuses.
 *     SUBMITTED: PREAPPROVAL or APPROVAL depending on requirement statuses.
 *     CLOSED: CLOSED.
 *     CANCELLED: CANCELLED.
 *   
 */
export type AppRequestStatus = 'APPROVAL' | 'CANCELLED' | 'CLOSED' | 'PREAPPROVAL' | 'PREQUAL' | 'QUALIFICATION'


/** An application represents the applicant applying to a specific program. Each appRequest has multiple applications - one per program defined in the system. Some applications are mutually exclusive and/or will be eliminated early based on PREQUAL requirements, but they all technically exist in the data model - there is no concept of picking one application over another, just two applications where one dies and the other survives. */
export interface Application {
    id: Scalars['ID']
    status: ApplicationStatus
    /** When one of the application's requirements is failing or throwing a warning, its reason will be copied here for convenience. If there is a warning and then later a failure, the failure reason will win. */
    statusReason: (Scalars['String'] | null)
    __typename: 'Application'
}


/**
 * 
 *     The status of an application. This is usually a computed field, not stored in the database. The status
 *     is computed based on the status of the appRequest and of the requirements for the program. If
 *     the appRequest is CLOSED, the status should permanently match the ApplicationStatusDB instead of being
 *     computed. If the appRequest is CANCELLED, all applications should be CANCELLED as well.
 *   
 */
export type ApplicationStatus = 'ACCEPTED' | 'APPROVAL' | 'APPROVED' | 'CANCELLED' | 'FAILED_PREQUAL' | 'FAILED_QUALIFICATION' | 'NOT_ACCEPTED' | 'NOT_APPROVED' | 'PREAPPROVAL' | 'PREQUAL' | 'QUALIFICATION' | 'WITHDRAWN'

export interface Mutation {
    roleAddGrant: AccessRoleValidatedResponse
    roleCreate: AccessRoleValidatedResponse
    roleDelete: ValidatedResponse
    roleDeleteGrant: AccessRoleValidatedResponse
    roleUpdate: AccessRoleValidatedResponse
    roleUpdateGrant: AccessRoleValidatedResponse
    __typename: 'Mutation'
}

export interface MutationMessage {
    /** The path to the arg that produced the error. Dot-separated (lodash.get compatible) if it is deep inside an input type. Null if no particular arg can be blamed for the error. */
    arg: (Scalars['String'] | null)
    /** An error message to be shown to the end user, with the context of the given arg. */
    message: Scalars['String']
    /** The type of error message. See the enum descriptions for more detail. */
    type: MutationMessageType
    __typename: 'MutationMessage'
}

export type MutationMessageType = 'error' | 'success' | 'warning'

export interface Program {
    key: Scalars['ID']
    navTitle: Scalars['String']
    title: Scalars['String']
    __typename: 'Program'
}

export interface ProgramGroup {
    key: Scalars['ID']
    /** A human readable title for the program group in the navigation. You may want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle: Scalars['String']
    programs: Program[]
    /** A human readable title for the program group. This will be shown to users. */
    title: Scalars['String']
    __typename: 'ProgramGroup'
}

export interface Query {
    /**
     * 
     *     This is the global access object. Each field represents a global permission
     *     like the ability to view the role management interface.
     *   
     */
    access: Access
    accessUsers: AccessUser[]
    appRequests: AppRequest[]
    programGroups: ProgramGroup[]
    programs: Program[]
    roles: AccessRole[]
    /** This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant. */
    subjectTypes: AccessSubjectType[]
    __typename: 'Query'
}

export interface RoleActions {
    delete: Scalars['Boolean']
    update: Scalars['Boolean']
    view: Scalars['Boolean']
    __typename: 'RoleActions'
}

export interface ValidatedResponse {
    messages: MutationMessage[]
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success: Scalars['Boolean']
    __typename: 'ValidatedResponse'
}

export interface AccessGenqlSelection{
    createPeriod?: boolean | number
    /** Current user is permitted to create new roles in the role management UI. */
    createRole?: boolean | number
    viewApplicantInterface?: boolean | number
    viewDefinitionManagement?: boolean | number
    viewPeriodManagement?: boolean | number
    viewReviewerInterface?: boolean | number
    /** Current user is permitted to view the role management UI. */
    viewRoleManagement?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessControlGenqlSelection{
    description?: boolean | number
    name?: boolean | number
    tagType?: boolean | number
    /** A list of all possible tags for the control. Null if tagging is not supported for the control. */
    tags?: (AccessTagGenqlSelection & { __args?: {search?: (Scalars['String'] | null)} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessControlInput {
/** The action this grant applies to, e.g. "view" or "update". */
control: Scalars['String'],
/** A list of tags to help res */
tags: AccessTagInput[]}

export interface AccessRoleGenqlSelection{
    actions?: RoleActionsGenqlSelection
    grants?: AccessRoleGrantGenqlSelection
    groups?: boolean | number
    id?: boolean | number
    name?: boolean | number
    scope?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessRoleFilter {groups?: (Scalars['String'][] | null),ids?: (Scalars['ID'][] | null),names?: (Scalars['String'][] | null),scopes?: (Scalars['String'][] | null)}

export interface AccessRoleGrantGenqlSelection{
    /**
     * 
     *     If true, this grant allows the action specified by the selected controls. If false, it removes
     *     the controls.
     * 
     *     Removing a control only happens within the context of a single role. If another role grants the
     *     same control, the action is allowed. This is more of an exception system than a denial
     *     system. So you can do something like add the "view" control to the "movie" subject type in one
     *     grant, and then in a second grant in the same role, remove it from "The Princess Bride". Now you
     *     have a role that grants "view" on all movies _except_ The Princess Bride. If the user has another role
     *     that grants "view" on The Princess Bride (or on all movies), they can view it based on that other role.
     *   
     */
    allow?: boolean | number
    id?: boolean | number
    /**
     * 
     *     The specific subject instance this grant applies to, e.g. if subjectType is "movie",
     *     subject might be "The Princess Bride", and the grant applies to that movie. If null,
     *     the grant applies to all movies. It's a little more complicated than that when we consider
     *     the "allow" setting, see that description for more details.
     *   
     */
    subject?: boolean | number
    /** The type of subject this grant applies to, e.g. "movie". */
    subjectType?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessRoleGrantCreate {allow: Scalars['Boolean'],controls: AccessControlInput[],description?: (Scalars['String'] | null),subjectType: Scalars['String'],
/** A list of subject IDs to restrict the grant. */
subjects?: (Scalars['String'][] | null)}

export interface AccessRoleInput {
/** A list of groups this role is associated with. */
groups: Scalars['String'][],name: Scalars['String'],
/** Attach this role to a specific authentication scope, e.g. "parent". */
scope?: (Scalars['String'] | null)}

export interface AccessRoleValidatedResponseGenqlSelection{
    accessRole?: AccessRoleGenqlSelection
    messages?: MutationMessageGenqlSelection
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessSubjectInstanceGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessSubjectTypeGenqlSelection{
    /** A list of all possible controls for this subjectType. Use this to populate the control dropdown when creating a grant. */
    controls?: AccessControlGenqlSelection
    name?: boolean | number
    /** The way that subject instances are added to the grant. */
    subjectSearchType?: boolean | number
    /** A list of all possible instances of this subjectType. Use this to populate the subject dropdown when creating a grant. */
    subjects?: (AccessSubjectInstanceGenqlSelection & { __args?: {
    /** Set this arg to filter the list based on the search. If this subjectType is not marked as searchable, this search will be ignored. If it is marked as searchable, an empty search will probably not return any instances (but it is up to the implementation of the subjectType). */
    search?: (Scalars['String'] | null)} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessTagGenqlSelection{
    category?: boolean | number
    categoryLabel?: boolean | number
    name?: boolean | number
    tag?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessTagInput {
/** The category this tag belongs to, e.g. "State". */
category: Scalars['String'],
/** The tag value, e.g. "TX". */
tag: Scalars['String']}


/** A user that has or once had access to the system. */
export interface AccessUserGenqlSelection{
    groups?: boolean | number
    login?: boolean | number
    otherIdentifiers?: AccessUserIdentifierGenqlSelection
    /** A JSON object containing any information about the user that the implementing application wants to store. Could be useful for constructing personalized UI. */
    otherInfo?: boolean | number
    roles?: AccessRoleGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessUserFilter {logins?: (Scalars['ID'][] | null),otherIdentifersByLabel?: (AccessUserIdentifierInput[] | null),otherIdentifiers?: (Scalars['String'][] | null),search?: (Scalars['String'] | null)}


/** A label and ID pair for an external user unique ID. For example, { label: "Student ID", id: "123456" } */
export interface AccessUserIdentifierGenqlSelection{
    /** The unique ID for this identifier, e.g. "123456". */
    id?: boolean | number
    /** The label for this identifier, e.g. "Student ID". */
    label?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A label and ID pair for an external user unique ID. For example, { label: "Student ID", id: "123456" } */
export interface AccessUserIdentifierInput {id: Scalars['ID'],label: Scalars['String']}


/** Represents a group of applications all being applied for at the same time. As part of the request, multiple applications will be created and either eliminated as ineligible or submitted for approval. */
export interface AppRequestGenqlSelection{
    applications?: ApplicationGenqlSelection
    /** Date that this request was considered closed and no longer editable. If active or re-opened, will be null. If closed again, will be the second closure date. */
    closedAt?: boolean | number
    createdAt?: boolean | number
    /** All data that has been gathered from the user for this request. It is a Record whose properties are the prompt keys and values are the data gathered by the corresponding prompt dialog. */
    data?: { __args: {
    /** Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh. */
    schemaVersion?: (Scalars['String'] | null)} } | boolean | number
    id?: boolean | number
    status?: boolean | number
    submitEligible?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AppRequestFilter {ids?: (Scalars['ID'][] | null),
/** Only return appRequests that are owned by one the given logins. */
logins?: (Scalars['ID'][] | null),
/** Only return appRequests that are owned by the current user. */
own?: (Scalars['Boolean'] | null),periodIds?: (Scalars['ID'][] | null),status?: (AppRequestStatus[] | null)}


/** An application represents the applicant applying to a specific program. Each appRequest has multiple applications - one per program defined in the system. Some applications are mutually exclusive and/or will be eliminated early based on PREQUAL requirements, but they all technically exist in the data model - there is no concept of picking one application over another, just two applications where one dies and the other survives. */
export interface ApplicationGenqlSelection{
    id?: boolean | number
    status?: boolean | number
    /** When one of the application's requirements is failing or throwing a warning, its reason will be copied here for convenience. If there is a warning and then later a failure, the failure reason will win. */
    statusReason?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationGenqlSelection{
    roleAddGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grant: AccessRoleGrantCreate, roleId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    roleCreate?: (AccessRoleValidatedResponseGenqlSelection & { __args: {role: AccessRoleInput, validateOnly?: (Scalars['Boolean'] | null)} })
    roleDelete?: (ValidatedResponseGenqlSelection & { __args: {roleId: Scalars['ID']} })
    roleDeleteGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grantId: Scalars['ID']} })
    roleUpdate?: (AccessRoleValidatedResponseGenqlSelection & { __args: {role: AccessRoleInput, roleId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    roleUpdateGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grant: AccessRoleGrantCreate, grantId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationMessageGenqlSelection{
    /** The path to the arg that produced the error. Dot-separated (lodash.get compatible) if it is deep inside an input type. Null if no particular arg can be blamed for the error. */
    arg?: boolean | number
    /** An error message to be shown to the end user, with the context of the given arg. */
    message?: boolean | number
    /** The type of error message. See the enum descriptions for more detail. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ProgramGenqlSelection{
    key?: boolean | number
    navTitle?: boolean | number
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ProgramFilters {keys?: (Scalars['String'][] | null)}

export interface ProgramGroupGenqlSelection{
    key?: boolean | number
    /** A human readable title for the program group in the navigation. You may want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle?: boolean | number
    programs?: (ProgramGenqlSelection & { __args?: {filter?: (ProgramFilters | null)} })
    /** A human readable title for the program group. This will be shown to users. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ProgramGroupFilter {keys?: (Scalars['ID'][] | null)}

export interface QueryGenqlSelection{
    /**
     * 
     *     This is the global access object. Each field represents a global permission
     *     like the ability to view the role management interface.
     *   
     */
    access?: AccessGenqlSelection
    accessUsers?: (AccessUserGenqlSelection & { __args?: {filter?: (AccessUserFilter | null)} })
    appRequests?: (AppRequestGenqlSelection & { __args?: {filter?: (AppRequestFilter | null)} })
    programGroups?: (ProgramGroupGenqlSelection & { __args?: {filter?: (ProgramGroupFilter | null)} })
    programs?: (ProgramGenqlSelection & { __args?: {filter?: (ProgramFilters | null)} })
    roles?: (AccessRoleGenqlSelection & { __args?: {filter?: (AccessRoleFilter | null)} })
    /** This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant. */
    subjectTypes?: AccessSubjectTypeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RoleActionsGenqlSelection{
    delete?: boolean | number
    update?: boolean | number
    view?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ValidatedResponseGenqlSelection{
    messages?: MutationMessageGenqlSelection
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const Access_possibleTypes: string[] = ['Access']
    export const isAccess = (obj?: { __typename?: any } | null): obj is Access => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccess"')
      return Access_possibleTypes.includes(obj.__typename)
    }
    


    const AccessControl_possibleTypes: string[] = ['AccessControl']
    export const isAccessControl = (obj?: { __typename?: any } | null): obj is AccessControl => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessControl"')
      return AccessControl_possibleTypes.includes(obj.__typename)
    }
    


    const AccessRole_possibleTypes: string[] = ['AccessRole']
    export const isAccessRole = (obj?: { __typename?: any } | null): obj is AccessRole => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessRole"')
      return AccessRole_possibleTypes.includes(obj.__typename)
    }
    


    const AccessRoleGrant_possibleTypes: string[] = ['AccessRoleGrant']
    export const isAccessRoleGrant = (obj?: { __typename?: any } | null): obj is AccessRoleGrant => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessRoleGrant"')
      return AccessRoleGrant_possibleTypes.includes(obj.__typename)
    }
    


    const AccessRoleValidatedResponse_possibleTypes: string[] = ['AccessRoleValidatedResponse']
    export const isAccessRoleValidatedResponse = (obj?: { __typename?: any } | null): obj is AccessRoleValidatedResponse => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessRoleValidatedResponse"')
      return AccessRoleValidatedResponse_possibleTypes.includes(obj.__typename)
    }
    


    const AccessSubjectInstance_possibleTypes: string[] = ['AccessSubjectInstance']
    export const isAccessSubjectInstance = (obj?: { __typename?: any } | null): obj is AccessSubjectInstance => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessSubjectInstance"')
      return AccessSubjectInstance_possibleTypes.includes(obj.__typename)
    }
    


    const AccessSubjectType_possibleTypes: string[] = ['AccessSubjectType']
    export const isAccessSubjectType = (obj?: { __typename?: any } | null): obj is AccessSubjectType => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessSubjectType"')
      return AccessSubjectType_possibleTypes.includes(obj.__typename)
    }
    


    const AccessTag_possibleTypes: string[] = ['AccessTag']
    export const isAccessTag = (obj?: { __typename?: any } | null): obj is AccessTag => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessTag"')
      return AccessTag_possibleTypes.includes(obj.__typename)
    }
    


    const AccessUser_possibleTypes: string[] = ['AccessUser']
    export const isAccessUser = (obj?: { __typename?: any } | null): obj is AccessUser => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessUser"')
      return AccessUser_possibleTypes.includes(obj.__typename)
    }
    


    const AccessUserIdentifier_possibleTypes: string[] = ['AccessUserIdentifier']
    export const isAccessUserIdentifier = (obj?: { __typename?: any } | null): obj is AccessUserIdentifier => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessUserIdentifier"')
      return AccessUserIdentifier_possibleTypes.includes(obj.__typename)
    }
    


    const AppRequest_possibleTypes: string[] = ['AppRequest']
    export const isAppRequest = (obj?: { __typename?: any } | null): obj is AppRequest => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAppRequest"')
      return AppRequest_possibleTypes.includes(obj.__typename)
    }
    


    const Application_possibleTypes: string[] = ['Application']
    export const isApplication = (obj?: { __typename?: any } | null): obj is Application => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isApplication"')
      return Application_possibleTypes.includes(obj.__typename)
    }
    


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const MutationMessage_possibleTypes: string[] = ['MutationMessage']
    export const isMutationMessage = (obj?: { __typename?: any } | null): obj is MutationMessage => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutationMessage"')
      return MutationMessage_possibleTypes.includes(obj.__typename)
    }
    


    const Program_possibleTypes: string[] = ['Program']
    export const isProgram = (obj?: { __typename?: any } | null): obj is Program => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProgram"')
      return Program_possibleTypes.includes(obj.__typename)
    }
    


    const ProgramGroup_possibleTypes: string[] = ['ProgramGroup']
    export const isProgramGroup = (obj?: { __typename?: any } | null): obj is ProgramGroup => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProgramGroup"')
      return ProgramGroup_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const RoleActions_possibleTypes: string[] = ['RoleActions']
    export const isRoleActions = (obj?: { __typename?: any } | null): obj is RoleActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRoleActions"')
      return RoleActions_possibleTypes.includes(obj.__typename)
    }
    


    const ValidatedResponse_possibleTypes: string[] = ['ValidatedResponse']
    export const isValidatedResponse = (obj?: { __typename?: any } | null): obj is ValidatedResponse => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isValidatedResponse"')
      return ValidatedResponse_possibleTypes.includes(obj.__typename)
    }
    

export const enumAccessSearchType = {
   NONE: 'NONE' as const,
   SEARCH: 'SEARCH' as const,
   SELECT: 'SELECT' as const
}

export const enumAppRequestStatus = {
   APPROVAL: 'APPROVAL' as const,
   CANCELLED: 'CANCELLED' as const,
   CLOSED: 'CLOSED' as const,
   PREAPPROVAL: 'PREAPPROVAL' as const,
   PREQUAL: 'PREQUAL' as const,
   QUALIFICATION: 'QUALIFICATION' as const
}

export const enumApplicationStatus = {
   ACCEPTED: 'ACCEPTED' as const,
   APPROVAL: 'APPROVAL' as const,
   APPROVED: 'APPROVED' as const,
   CANCELLED: 'CANCELLED' as const,
   FAILED_PREQUAL: 'FAILED_PREQUAL' as const,
   FAILED_QUALIFICATION: 'FAILED_QUALIFICATION' as const,
   NOT_ACCEPTED: 'NOT_ACCEPTED' as const,
   NOT_APPROVED: 'NOT_APPROVED' as const,
   PREAPPROVAL: 'PREAPPROVAL' as const,
   PREQUAL: 'PREQUAL' as const,
   QUALIFICATION: 'QUALIFICATION' as const,
   WITHDRAWN: 'WITHDRAWN' as const
}

export const enumMutationMessageType = {
   error: 'error' as const,
   success: 'success' as const,
   warning: 'warning' as const
}
