// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Boolean: boolean,
    DateTime: string,
    Float: number,
    ID: string,
    JsonData: Record<string, any>,
    String: string,
}

export interface Access {
    /** Current user may create a new app request, either for themselves or on behalf of another user. */
    createAppRequest: Scalars['Boolean']
    /** Current user is permitted to create new periods in the period management UI. */
    createPeriod: Scalars['Boolean']
    /** Current user is permitted to create new roles in the role management UI. */
    createRole: Scalars['Boolean']
    /** Current user is permitted to view the app request list. */
    viewAppRequestList: Scalars['Boolean']
    /** Current user is permitted to view the applicant dashboard. */
    viewApplicantDashboard: Scalars['Boolean']
    /** Current user is permitted to view the period management UI. */
    viewPeriodManagement: Scalars['Boolean']
    /** Current user is permitted to view the reviewer dashboard. */
    viewReviewerInterface: Scalars['Boolean']
    /** Current user is permitted to view the role management UI. */
    viewRoleManagement: Scalars['Boolean']
    __typename: 'Access'
}

export interface AccessControl {
    description: Scalars['String']
    name: Scalars['String']
    __typename: 'AccessControl'
}

export interface AccessGrantTag {
    category: Scalars['String']
    categoryLabel: Scalars['String']
    label: Scalars['String']
    tag: Scalars['String']
    __typename: 'AccessGrantTag'
}

export interface AccessRole {
    actions: RoleActions
    /** A description of the grant. This is not used for anything, but can be useful for admins to understand what the grant was trying to do. */
    description: (Scalars['String'] | null)
    grants: AccessRoleGrant[]
    groups: Scalars['String'][]
    id: Scalars['ID']
    name: Scalars['String']
    scope: (Scalars['String'] | null)
    __typename: 'AccessRole'
}

export interface AccessRoleGrant {
    actions: AccessRoleGrantActions
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
    controls: Scalars['String'][]
    id: Scalars['ID']
    /** The type of subject this grant applies to, e.g. "movie". */
    subjectType: AccessSubjectType
    tags: AccessGrantTag[]
    __typename: 'AccessRoleGrant'
}

export interface AccessRoleGrantActions {
    delete: Scalars['Boolean']
    update: Scalars['Boolean']
    __typename: 'AccessRoleGrantActions'
}

export interface AccessRoleValidatedResponse {
    accessRole: (AccessRole | null)
    messages: MutationMessage[]
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success: Scalars['Boolean']
    __typename: 'AccessRoleValidatedResponse'
}

export interface AccessSubjectType {
    /** A list of all possible controls for this subjectType. Use this to populate the control dropdown when creating a grant. */
    controls: AccessControl[]
    /** A longer explanation of the subject type for display in the role management interface. */
    description: (Scalars['String'] | null)
    name: Scalars['String']
    tags: AccessTagCategory[]
    /** A slightly longer version of the subject type's name, for display in the role management interface. */
    title: Scalars['String']
    __typename: 'AccessSubjectType'
}

export interface AccessTag {
    label: Scalars['String']
    value: Scalars['String']
    __typename: 'AccessTag'
}

export interface AccessTagCategory {
    category: Scalars['String']
    description: (Scalars['String'] | null)
    label: Scalars['String']
    listable: Scalars['Boolean']
    /** A list of all possible tags for this category. Use this to populate the tag dropdown when creating a grant. */
    tags: AccessTag[]
    __typename: 'AccessTagCategory'
}


/** A user that has or once had access to the system. */
export interface AccessUser {
    fullname: Scalars['String']
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
    /** Actions the user can take on this app request. */
    actions: AppRequestActions
    /** The activity log for this app request. This is a list of actions taken on the app request, such as submission, updating prompts, make an offer, add a note, etc. It will be sorted by the date of the activity in descending order. */
    activity: AppRequestActivity[]
    applicant: AccessUser
    applications: Application[]
    /** Date that this request was considered closed and no longer editable. If active or re-opened, will be null. If closed again, will be the second closure date. */
    closedAt: (Scalars['DateTime'] | null)
    createdAt: Scalars['DateTime']
    /** All data that has been gathered from the user for this request. It is a Record whose properties are the prompt keys and values are the data gathered by the corresponding prompt dialog. */
    data: Scalars['JsonData']
    id: Scalars['ID']
    /** Indexes associated with the App Request. These are pieces of data extracted from the App Request by individual prompts in the ReqQuest project. They have several uses such as filtering App Requests and enriching list views. */
    indexCategories: AppRequestIndexCategory[]
    /** The period this appRequest is associated with. */
    period: Period
    /** Retrieve a specific prompt by its ID. This is useful for the UI to get the full prompt data and configuration when trying to edit an individual prompt. We don't want to be downloading all the config data for everything up front. */
    prompt: RequirementPrompt
    status: AppRequestStatus
    /** The most pertinent status reason for this app request. The logic is complicated and depends on the AppRequest's status. */
    statusReason: (Scalars['String'] | null)
    updatedAt: Scalars['DateTime']
    __typename: 'AppRequest'
}

export interface AppRequestActions {
    /** User may cancel this app request as the owner. Separate from closing as a reviewer/admin. */
    cancel: Scalars['Boolean']
    /** User may close this app request as a reviewer/admin. Separate from cancelling as the app request owner. */
    close: Scalars['Boolean']
    /** User may make an offer on this app request. */
    offer: Scalars['Boolean']
    /** User may reopen this app request, whether as the owner or as a reviewer/admin. */
    reopen: Scalars['Boolean']
    /** User may return this app request to the applicant phase. */
    return: Scalars['Boolean']
    /** Whether the user can view this app request as a reviewer. */
    review: Scalars['Boolean']
    /** User may submit this app request either as or on behalf of the owner. */
    submit: Scalars['Boolean']
    __typename: 'AppRequestActions'
}

export interface AppRequestActivity {
    action: Scalars['String']
    /** The app request this activity is associated with. */
    appRequest: AppRequest
    /** The date and time when the action occurred. */
    createdAt: Scalars['DateTime']
    /** A JSON object containing additional data about the activity. This could be filtered but different actions would place different data here so it is not strongly typed. */
    data: (Scalars['JsonData'] | null)
    /** A detailed description of the activity. This is not meant to be filtered and could contain specific details about the action. */
    description: (Scalars['String'] | null)
    id: Scalars['ID']
    /** If this activity was performed by an impersonated user, this will be the user that did the impersonation. */
    impersonatedBy: (AccessUser | null)
    /** The user that performed the activity. */
    user: AccessUser
    __typename: 'AppRequestActivity'
}


/** This represents an index category attached to an app request. Its tagStrings property contains the tag values that have been extracted from the app request data. */
export interface AppRequestIndexCategory {
    /** If this is > 0, the index values should be shown on the main app request list page, sorted by this priority in descending order. */
    appRequestListPriority: (Scalars['Float'] | null)
    /** If this is > 0, the index values should be shown on the applicant dashboard, sorted by this priority in descending order. */
    applicantDashboardPriority: (Scalars['Float'] | null)
    category: Scalars['String']
    categoryLabel: Scalars['String']
    /** If this is > 0, the index values should be shown on the list filters, sorted by this priority in descending order. */
    listFiltersPriority: (Scalars['Float'] | null)
    listable: Scalars['Boolean']
    /** If this is > 0, the index values should be shown on the reviewer dashboard, sorted by this priority in descending order. */
    reviewerDashboardPriority: (Scalars['Float'] | null)
    values: IndexValue[]
    __typename: 'AppRequestIndexCategory'
}


/** This is used to indicate where the index values should be displayed. */
export type AppRequestIndexDestination = 'APPLICANT_DASHBOARD' | 'APP_REQUEST_LIST' | 'LIST_FILTERS' | 'REVIEWER_DASHBOARD'


/**
 * 
 *     The status of an appRequest. This status is computed based on the "dbStatus" recorded in
 *     the database and the status of each application.
 *   
 */
export type AppRequestStatus = 'ACCEPTANCE' | 'ACCEPTED' | 'APPROVAL' | 'APPROVED' | 'CANCELLED' | 'DISQUALIFIED' | 'NOT_ACCEPTED' | 'NOT_APPROVED' | 'PREAPPROVAL' | 'READY_TO_SUBMIT' | 'STARTED' | 'WITHDRAWN'


/** An application represents the applicant applying to a specific program. Each appRequest has multiple applications - one per program defined in the system. Some applications are mutually exclusive and/or will be eliminated early based on PREQUAL requirements, but they all technically exist in the data model - there is no concept of picking one application over another, just two applications where one dies and the other survives. */
export interface Application {
    actions: ApplicationActions
    id: Scalars['ID']
    /** The navigation title of the program this application is for. */
    navTitle: Scalars['String']
    requirements: ApplicationRequirement[]
    status: ApplicationStatus
    /** When one of the application's requirements is failing or throwing a warning, its reason will be copied here for convenience. If there is a warning and then later a failure, the failure reason will win. */
    statusReason: (Scalars['String'] | null)
    /** The title of the program this application is for. */
    title: Scalars['String']
    __typename: 'Application'
}

export interface ApplicationActions {
    viewAsReviewer: Scalars['Boolean']
    __typename: 'ApplicationActions'
}


/** The specific instance of a requirement on a particular application. Stores the status of the requirement, e.g. being satisfied or not. */
export interface ApplicationRequirement {
    application: Application
    /** The configuration data for this requirement in the app request's period. */
    configurationData: (Scalars['JsonData'] | null)
    /** An internal description of the requirement. Probably not shown to users. */
    description: Scalars['String']
    id: Scalars['ID']
    /** A human and machine readable unique and stable identifier that we can use to add javascript logic to the evaluation of whether a requirement is satisfied. For example: "gi_ch33_must_be_post911" */
    key: Scalars['String']
    /** A human readable title for the requirement in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle: Scalars['String']
    prompts: RequirementPrompt[]
    /** When true, means that the requirement has not been made moot by an earlier requirement failing. It may still need to be hidden from navigation based on evaluatedInEarlierApplication. */
    reachable: Scalars['Boolean']
    /** The smart title for this requirement in the app request's period. For instance, might be "Applicant must have GPA over 3.4" instead of the regular title "Applicant must meet GPA requirement". Will fall back to the regular title for any requirement that does not provide a smart title. */
    smartTitle: Scalars['String']
    /** The status of the requirement. This is what will be shown to users. */
    status: RequirementStatus
    /** The reason why the requirement is in the status it is in. This will be shown to the applicant. */
    statusReason: (Scalars['String'] | null)
    /** A human readable title for the requirement. This is what will be shown to users. */
    title: Scalars['String']
    /** The type of requirement. This determines when the requirement is evaluated and who can see the requirement. */
    type: RequirementType
    __typename: 'ApplicationRequirement'
}


/**
 * 
 *     The status of an application. This is usually a computed field, not stored in the database. The status
 *     is computed based on the status of the appRequest and of the requirements for the program. If
 *     the appRequest is CLOSED, the status should permanently match the ApplicationStatusDB instead of being
 *     computed. If the appRequest is CANCELLED, all applications should be CANCELLED as well.
 *   
 */
export type ApplicationStatus = 'ACCEPTANCE' | 'ACCEPTED' | 'APPROVAL' | 'APPROVED' | 'CANCELLED' | 'FAILED_PREQUAL' | 'FAILED_QUALIFICATION' | 'NOT_ACCEPTED' | 'NOT_APPROVED' | 'PREAPPROVAL' | 'PREQUAL' | 'QUALIFICATION' | 'READY_TO_SUBMIT' | 'WITHDRAWN'

export interface Configuration {
    actions: ConfigurationAccess
    data: Scalars['JsonData']
    /** The key being configured. Could be a requirement or prompt key. */
    key: Scalars['String']
    __typename: 'Configuration'
}

export interface ConfigurationAccess {
    update: Scalars['Boolean']
    view: Scalars['Boolean']
    __typename: 'ConfigurationAccess'
}


/** This represents an index as registered by one of the project's prompt definitions. */
export interface IndexCategory {
    /** If this is > 0, the index values should be shown on the main app request list page, sorted by this priority in descending order. */
    appRequestListPriority: (Scalars['Float'] | null)
    /** If this is > 0, the index values should be shown on the applicant dashboard, sorted by this priority in descending order. */
    applicantDashboardPriority: (Scalars['Float'] | null)
    category: Scalars['String']
    categoryLabel: Scalars['String']
    /** If this is > 0, the index values should be shown on the list filters, sorted by this priority in descending order. */
    listFiltersPriority: (Scalars['Float'] | null)
    listable: Scalars['Boolean']
    /** If this is > 0, the index values should be shown on the reviewer dashboard, sorted by this priority in descending order. */
    reviewerDashboardPriority: (Scalars['Float'] | null)
    values: IndexValue[]
    __typename: 'IndexCategory'
}

export interface IndexValue {
    label: Scalars['String']
    value: Scalars['String']
    __typename: 'IndexValue'
}

export interface Mutation {
    /** Add a note to the app request. */
    addNote: ValidatedAppRequestResponse
    createPeriod: ValidatedPeriodResponse
    deletePeriod: ValidatedResponse
    /** Make an offer on the app request. */
    offerAppRequest: ValidatedAppRequestResponse
    roleAddGrant: AccessRoleValidatedResponse
    roleCreate: AccessRoleValidatedResponse
    roleDelete: ValidatedResponse
    roleDeleteGrant: AccessRoleValidatedResponse
    roleUpdate: AccessRoleValidatedResponse
    roleUpdateGrant: AccessRoleValidatedResponse
    /** Submit the app request. */
    submitAppRequest: ValidatedAppRequestResponse
    updateConfiguration: ValidatedConfigurationResponse
    updatePeriod: ValidatedPeriodResponse
    /** Update the data for a prompt in this app request. */
    updatePrompt: ValidatedAppRequestResponse
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

export interface Period {
    actions: PeriodActions
    /** This is useful for filtering out periods that are no longer useful. For instance, a window might close applications after 2 weeks but the reviewers could be working. */
    archiveDate: (Scalars['DateTime'] | null)
    /** Date that this period closes for applications. Some periods do not set a close date. */
    closeDate: (Scalars['DateTime'] | null)
    /** Unique identifier for this period that references an external system. Ideally human readable. */
    code: (Scalars['String'] | null)
    configurations: Configuration[]
    id: Scalars['ID']
    /** Name for this period. Will be displayed to applicants if they create an App Request while two periods are simultaneously open. */
    name: Scalars['String']
    /** Date that this period opens for applications. */
    openDate: Scalars['DateTime']
    programs: PeriodProgram[]
    prompts: PeriodPrompt[]
    requirements: PeriodProgramRequirement[]
    __typename: 'Period'
}

export interface PeriodActions {
    delete: Scalars['Boolean']
    update: Scalars['Boolean']
    __typename: 'PeriodActions'
}

export interface PeriodProgram {
    actions: PeriodProgramActions
    /** Whether the program is enabled in this period. This is set by the system administrator. */
    enabled: Scalars['Boolean']
    group: PeriodProgramActions
    key: Scalars['ID']
    navTitle: Scalars['String']
    period: Period
    requirements: PeriodProgramRequirement[]
    title: Scalars['String']
    __typename: 'PeriodProgram'
}

export interface PeriodProgramActions {
    configure: Scalars['Boolean']
    __typename: 'PeriodProgramActions'
}

export interface PeriodProgramRequirement {
    /** The configuration for this requirement in the period. */
    configuration: Configuration
    /** An internal description of the requirement. Probably not shown to users. */
    description: Scalars['String']
    /** Whether the requirement is enabled in this period. This is set by the system administrator. */
    enabled: Scalars['Boolean']
    /** A human and machine readable unique and stable identifier that we can use to add javascript logic to the evaluation of whether a requirement is satisfied. For example: "gi_ch33_must_be_post911" */
    key: Scalars['String']
    /** A human readable title for the requirement in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle: Scalars['String']
    prompts: PeriodPrompt[]
    /** A human readable title for the requirement. This is what will be shown to users. */
    title: Scalars['String']
    /** The type of requirement. This determines when the requirement is evaluated and who can see the requirement. */
    type: RequirementType
    __typename: 'PeriodProgramRequirement'
}

export interface PeriodPrompt {
    /** The configuration for this prompt in the given period. */
    configuration: Configuration
    /** A brief description of the prompt. This should be shown to administrators to help explain the full meaning of the prompt while assigning permissions or editing its configuration. */
    description: (Scalars['String'] | null)
    /** A human and machine readable identifier for the prompt. Will be used to match prompt data with UI and API code that handles it. */
    key: Scalars['String']
    /** A human readable title for the prompt in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle: Scalars['String']
    periodId: Scalars['String']
    /** A human readable title for the prompt. This is what will be shown to users. */
    title: Scalars['String']
    __typename: 'PeriodPrompt'
}

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


/** The visibility of a prompt on a request. This is used to determine whether the prompt should be shown to the user in the UI. */
export type PromptVisibility = 'APPLICATION_DUPE' | 'AUTOMATION' | 'AVAILABLE' | 'REQUEST_DUPE' | 'UNREACHABLE'

export interface Query {
    /**
     * 
     *     This is the global access object. Each field represents a global permission
     *     like the ability to view the role management interface.
     *   
     */
    access: Access
    accessUsers: AccessUser[]
    appRequestIndexes: IndexCategory[]
    appRequests: AppRequest[]
    periods: Period[]
    programGroups: ProgramGroup[]
    programs: Program[]
    roles: AccessRole[]
    /** A list of all possible scopes. Scopes are used to limit users when they are accessing the system through an alternate UI or login method. For instance, if you generate an authentication token to give to a third party, it may have a scope identifying that third party and limiting their access even though they are acting as you. Roles must match the token scope in order to apply permissions. */
    scopes: Scalars['String'][]
    /** This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant. */
    subjectTypes: AccessSubjectType[]
    __typename: 'Query'
}


/** A RequestPrompt is an instance of a Prompt on a particular request. Once the user has answered the prompt, it contains the answer and the prompt status on that request. */
export interface RequirementPrompt {
    /** Actions that the user can take on this prompt. */
    actions: RequirementPromptActions
    /** Whether the prompt has been answered on this request. */
    answered: Scalars['Boolean']
    /** The configuration data for this prompt in the app request's period. */
    configurationData: Scalars['JsonData']
    /** All the configuration data that could be relevant for this prompt. This includes its own config, and also the config data for any requirements and programs that are related to it. */
    configurationRelatedData: Scalars['JsonData']
    /** The data that has been gathered from the user in response to this prompt. The schema is controlled by the question's implementation. */
    data: (Scalars['JsonData'] | null)
    /** A brief description of the prompt. This should be shown to administrators to help explain the full meaning of the prompt while assigning permissions or editing its configuration. */
    description: (Scalars['String'] | null)
    /** Any data that the API needs to provide to the UI to display the prompt properly. For instance, if the prompt text is in the database and able to be modified by admins, the UI can't hardcode the prompt text and needs it from the API. Could also be used to pull reference information from an external system, e.g. a student's course schedule, for display in the prompt dialog. */
    fetchedData: (Scalars['JsonData'] | null)
    id: Scalars['ID']
    /** When true, this prompt has been invalidated by the answer to another prompt. The `answered` field should remain false until the user specifically answers this prompt again, regardless of the output of the definition's `complete` method. */
    invalidated: Scalars['Boolean']
    /** A human and machine readable identifier for the prompt. Will be used to match prompt data with UI and API code that handles it. */
    key: Scalars['String']
    /** A human readable title for the prompt in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle: Scalars['String']
    /** Preload data that has been generated according to the prompt definition. For example, a prompt might query the database for answers given in previous requests or query an external API to learn facts about the user. */
    preloadData: (Scalars['JsonData'] | null)
    /** The requirement that this prompt is associated with. */
    requirement: ApplicationRequirement
    /** A human readable title for the prompt. This is what will be shown to users. */
    title: Scalars['String']
    /** The visibility of the prompt on the request. This is used to determine whether the prompt should be shown to the user in the UI. */
    visibility: PromptVisibility
    __typename: 'RequirementPrompt'
}

export interface RequirementPromptActions {
    update: Scalars['Boolean']
    __typename: 'RequirementPromptActions'
}

export type RequirementStatus = 'DISQUALIFYING' | 'MET' | 'NOT_APPLICABLE' | 'PENDING' | 'WARNING'

export type RequirementType = 'ACCEPTANCE' | 'APPROVAL' | 'POSTQUAL' | 'PREAPPROVAL' | 'PREQUAL' | 'QUALIFICATION'

export interface RoleActions {
    delete: Scalars['Boolean']
    update: Scalars['Boolean']
    __typename: 'RoleActions'
}

export interface ValidatedAppRequestResponse {
    appRequest: AppRequest
    messages: MutationMessage[]
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success: Scalars['Boolean']
    __typename: 'ValidatedAppRequestResponse'
}

export interface ValidatedConfigurationResponse {
    configuration: (Configuration | null)
    messages: MutationMessage[]
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success: Scalars['Boolean']
    __typename: 'ValidatedConfigurationResponse'
}

export interface ValidatedPeriodResponse {
    messages: MutationMessage[]
    period: (Period | null)
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success: Scalars['Boolean']
    __typename: 'ValidatedPeriodResponse'
}

export interface ValidatedResponse {
    messages: MutationMessage[]
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success: Scalars['Boolean']
    __typename: 'ValidatedResponse'
}

export interface AccessGenqlSelection{
    /** Current user may create a new app request, either for themselves or on behalf of another user. */
    createAppRequest?: boolean | number
    /** Current user is permitted to create new periods in the period management UI. */
    createPeriod?: boolean | number
    /** Current user is permitted to create new roles in the role management UI. */
    createRole?: boolean | number
    /** Current user is permitted to view the app request list. */
    viewAppRequestList?: boolean | number
    /** Current user is permitted to view the applicant dashboard. */
    viewApplicantDashboard?: boolean | number
    /** Current user is permitted to view the period management UI. */
    viewPeriodManagement?: boolean | number
    /** Current user is permitted to view the reviewer dashboard. */
    viewReviewerInterface?: boolean | number
    /** Current user is permitted to view the role management UI. */
    viewRoleManagement?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessControlGenqlSelection{
    description?: boolean | number
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessGrantTagGenqlSelection{
    category?: boolean | number
    categoryLabel?: boolean | number
    label?: boolean | number
    tag?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessRoleGenqlSelection{
    actions?: RoleActionsGenqlSelection
    /** A description of the grant. This is not used for anything, but can be useful for admins to understand what the grant was trying to do. */
    description?: boolean | number
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
    actions?: AccessRoleGrantActionsGenqlSelection
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
    controls?: boolean | number
    id?: boolean | number
    /** The type of subject this grant applies to, e.g. "movie". */
    subjectType?: AccessSubjectTypeGenqlSelection
    tags?: AccessGrantTagGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessRoleGrantActionsGenqlSelection{
    delete?: boolean | number
    update?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessRoleGrantCreate {allow: Scalars['Boolean'],
/** A list of controls that are allowed or denied by this grant. Each subjectType has a list of available controls, available under Query.subjectTypes. */
controls?: (Scalars['String'][] | null),subjectType?: (Scalars['String'] | null),
/** A list of tags to restrict a grant. For instance, if this is added to a grant on PromptAnswer-update, each tag refers to a subset of App Requests. */
tags?: (AccessTagInput[] | null)}

export interface AccessRoleGrantUpdate {allow: Scalars['Boolean'],
/** A list of controls that are allowed or denied by this grant. Each subjectType has a list of available controls, available under Query.subjectTypes. */
controls?: (Scalars['String'][] | null),subjectType?: (Scalars['String'] | null),
/** A list of tags to restrict a grant. For instance, if this is added to a grant on PromptAnswer-update, each tag refers to a subset of App Requests. */
tags?: (AccessTagInput[] | null)}

export interface AccessRoleInput {
/** A description of the role. This is not used for anything, but can be useful for admins to understand what the role is trying to do. */
description?: (Scalars['String'] | null),
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

export interface AccessSubjectTypeGenqlSelection{
    /** A list of all possible controls for this subjectType. Use this to populate the control dropdown when creating a grant. */
    controls?: AccessControlGenqlSelection
    /** A longer explanation of the subject type for display in the role management interface. */
    description?: boolean | number
    name?: boolean | number
    tags?: AccessTagCategoryGenqlSelection
    /** A slightly longer version of the subject type's name, for display in the role management interface. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessTagGenqlSelection{
    label?: boolean | number
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessTagCategoryGenqlSelection{
    category?: boolean | number
    description?: boolean | number
    label?: boolean | number
    listable?: boolean | number
    /** A list of all possible tags for this category. Use this to populate the tag dropdown when creating a grant. */
    tags?: AccessTagGenqlSelection
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
    fullname?: boolean | number
    groups?: boolean | number
    login?: boolean | number
    otherIdentifiers?: AccessUserIdentifierGenqlSelection
    /** A JSON object containing any information about the user that the implementing application wants to store. Could be useful for constructing personalized UI. */
    otherInfo?: boolean | number
    roles?: AccessRoleGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AccessUserFilter {logins?: (Scalars['ID'][] | null),
/** Filter by identifiers aside from username, like an Employee ID. */
otherIdentifiers?: (Scalars['String'][] | null),otherIdentifiersByLabel?: (AccessUserIdentifierInput[] | null),search?: (Scalars['String'] | null),
/** If true, only return the user that is currently logged in. */
self?: (Scalars['Boolean'] | null)}


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
    /** Actions the user can take on this app request. */
    actions?: AppRequestActionsGenqlSelection
    /** The activity log for this app request. This is a list of actions taken on the app request, such as submission, updating prompts, make an offer, add a note, etc. It will be sorted by the date of the activity in descending order. */
    activity?: (AppRequestActivityGenqlSelection & { __args?: {
    /** Filters to apply to the activity log. This can be used to filter by action type, date range, etc. */
    filters?: (AppRequestActivityFilters | null)} })
    applicant?: AccessUserGenqlSelection
    applications?: ApplicationGenqlSelection
    /** Date that this request was considered closed and no longer editable. If active or re-opened, will be null. If closed again, will be the second closure date. */
    closedAt?: boolean | number
    createdAt?: boolean | number
    /** All data that has been gathered from the user for this request. It is a Record whose properties are the prompt keys and values are the data gathered by the corresponding prompt dialog. */
    data?: { __args: {
    /** Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh. */
    schemaVersion?: (Scalars['String'] | null)} } | boolean | number
    id?: boolean | number
    /** Indexes associated with the App Request. These are pieces of data extracted from the App Request by individual prompts in the ReqQuest project. They have several uses such as filtering App Requests and enriching list views. */
    indexCategories?: (AppRequestIndexCategoryGenqlSelection & { __args?: {
    /** Returns indexes that are flagged to appear in this destination. Also sorts for this destination. */
    for?: (AppRequestIndexDestination | null)} })
    /** The period this appRequest is associated with. */
    period?: PeriodGenqlSelection
    /** Retrieve a specific prompt by its ID. This is useful for the UI to get the full prompt data and configuration when trying to edit an individual prompt. We don't want to be downloading all the config data for everything up front. */
    prompt?: (RequirementPromptGenqlSelection & { __args: {promptId: Scalars['ID']} })
    status?: boolean | number
    /** The most pertinent status reason for this app request. The logic is complicated and depends on the AppRequest's status. */
    statusReason?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AppRequestActionsGenqlSelection{
    /** User may cancel this app request as the owner. Separate from closing as a reviewer/admin. */
    cancel?: boolean | number
    /** User may close this app request as a reviewer/admin. Separate from cancelling as the app request owner. */
    close?: boolean | number
    /** User may make an offer on this app request. */
    offer?: boolean | number
    /** User may reopen this app request, whether as the owner or as a reviewer/admin. */
    reopen?: boolean | number
    /** User may return this app request to the applicant phase. */
    return?: boolean | number
    /** Whether the user can view this app request as a reviewer. */
    review?: boolean | number
    /** User may submit this app request either as or on behalf of the owner. */
    submit?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AppRequestActivityGenqlSelection{
    action?: boolean | number
    /** The app request this activity is associated with. */
    appRequest?: AppRequestGenqlSelection
    /** The date and time when the action occurred. */
    createdAt?: boolean | number
    /** A JSON object containing additional data about the activity. This could be filtered but different actions would place different data here so it is not strongly typed. */
    data?: boolean | number
    /** A detailed description of the activity. This is not meant to be filtered and could contain specific details about the action. */
    description?: boolean | number
    id?: boolean | number
    /** If this activity was performed by an impersonated user, this will be the user that did the impersonation. */
    impersonatedBy?: AccessUserGenqlSelection
    /** The user that performed the activity. */
    user?: AccessUserGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** This is used to filter a list of activities. */
export interface AppRequestActivityFilters {
/** Filter activities by action. This is a list of action names that should be matched. There are many potential action names, they are untyped. */
actions?: (Scalars['String'][] | null),appRequestIds?: (Scalars['ID'][] | null),
/** Return activities that happened after this date. */
happenedAfter?: (Scalars['DateTime'] | null),
/** Return activities that happened before this date. */
happenedBefore?: (Scalars['DateTime'] | null),
/** true -> Return activities that were performed while a user was impersonating another user. false -> Return activities that were not impersonated. */
impersonated?: (Scalars['Boolean'] | null),
/** Return activities that were performed while one of the given logins was impersonating another user. */
impersonatedBy?: (Scalars['ID'][] | null),
/** Return activities that were performed while one of the given logins was being impersonated by someone else. */
impersonatedUsers?: (Scalars['ID'][] | null),
/** Return activities that were performed by one of the given logins. Also returns activities that were performed while one of the given logins was impersonating someone else. */
users?: (Scalars['ID'][] | null)}

export interface AppRequestFilter {
/** true -> only return appRequests that are closed. false -> only return appRequests that are open. null -> return all appRequests. */
closed?: (Scalars['Boolean'] | null),ids?: (Scalars['ID'][] | null),
/** Only return appRequests that are owned by one the given logins. */
logins?: (Scalars['ID'][] | null),
/** Only return appRequests that are owned by the current user. */
own?: (Scalars['Boolean'] | null),periodIds?: (Scalars['ID'][] | null),status?: (AppRequestStatus[] | null)}


/** This represents an index category attached to an app request. Its tagStrings property contains the tag values that have been extracted from the app request data. */
export interface AppRequestIndexCategoryGenqlSelection{
    /** If this is > 0, the index values should be shown on the main app request list page, sorted by this priority in descending order. */
    appRequestListPriority?: boolean | number
    /** If this is > 0, the index values should be shown on the applicant dashboard, sorted by this priority in descending order. */
    applicantDashboardPriority?: boolean | number
    category?: boolean | number
    categoryLabel?: boolean | number
    /** If this is > 0, the index values should be shown on the list filters, sorted by this priority in descending order. */
    listFiltersPriority?: boolean | number
    listable?: boolean | number
    /** If this is > 0, the index values should be shown on the reviewer dashboard, sorted by this priority in descending order. */
    reviewerDashboardPriority?: boolean | number
    values?: IndexValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An application represents the applicant applying to a specific program. Each appRequest has multiple applications - one per program defined in the system. Some applications are mutually exclusive and/or will be eliminated early based on PREQUAL requirements, but they all technically exist in the data model - there is no concept of picking one application over another, just two applications where one dies and the other survives. */
export interface ApplicationGenqlSelection{
    actions?: ApplicationActionsGenqlSelection
    id?: boolean | number
    /** The navigation title of the program this application is for. */
    navTitle?: boolean | number
    requirements?: ApplicationRequirementGenqlSelection
    status?: boolean | number
    /** When one of the application's requirements is failing or throwing a warning, its reason will be copied here for convenience. If there is a warning and then later a failure, the failure reason will win. */
    statusReason?: boolean | number
    /** The title of the program this application is for. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ApplicationActionsGenqlSelection{
    viewAsReviewer?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** The specific instance of a requirement on a particular application. Stores the status of the requirement, e.g. being satisfied or not. */
export interface ApplicationRequirementGenqlSelection{
    application?: ApplicationGenqlSelection
    /** The configuration data for this requirement in the app request's period. */
    configurationData?: boolean | number
    /** An internal description of the requirement. Probably not shown to users. */
    description?: boolean | number
    id?: boolean | number
    /** A human and machine readable unique and stable identifier that we can use to add javascript logic to the evaluation of whether a requirement is satisfied. For example: "gi_ch33_must_be_post911" */
    key?: boolean | number
    /** A human readable title for the requirement in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle?: boolean | number
    prompts?: RequirementPromptGenqlSelection
    /** When true, means that the requirement has not been made moot by an earlier requirement failing. It may still need to be hidden from navigation based on evaluatedInEarlierApplication. */
    reachable?: boolean | number
    /** The smart title for this requirement in the app request's period. For instance, might be "Applicant must have GPA over 3.4" instead of the regular title "Applicant must meet GPA requirement". Will fall back to the regular title for any requirement that does not provide a smart title. */
    smartTitle?: boolean | number
    /** The status of the requirement. This is what will be shown to users. */
    status?: boolean | number
    /** The reason why the requirement is in the status it is in. This will be shown to the applicant. */
    statusReason?: boolean | number
    /** A human readable title for the requirement. This is what will be shown to users. */
    title?: boolean | number
    /** The type of requirement. This determines when the requirement is evaluated and who can see the requirement. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ConfigurationGenqlSelection{
    actions?: ConfigurationAccessGenqlSelection
    data?: boolean | number
    /** The key being configured. Could be a requirement or prompt key. */
    key?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ConfigurationAccessGenqlSelection{
    update?: boolean | number
    view?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ConfigurationFilters {
/** Return specific configurations. */
ids?: (Scalars['ID'][] | null),
/** Return configurations for these keys. */
keys?: (Scalars['String'][] | null),
/** Return configurations for these period codes. */
periodCodes?: (Scalars['String'][] | null),
/** Return configurations for these period IDs. */
periodIds?: (Scalars['ID'][] | null)}


/** This represents an index as registered by one of the project's prompt definitions. */
export interface IndexCategoryGenqlSelection{
    /** If this is > 0, the index values should be shown on the main app request list page, sorted by this priority in descending order. */
    appRequestListPriority?: boolean | number
    /** If this is > 0, the index values should be shown on the applicant dashboard, sorted by this priority in descending order. */
    applicantDashboardPriority?: boolean | number
    category?: boolean | number
    categoryLabel?: boolean | number
    /** If this is > 0, the index values should be shown on the list filters, sorted by this priority in descending order. */
    listFiltersPriority?: boolean | number
    listable?: boolean | number
    /** If this is > 0, the index values should be shown on the reviewer dashboard, sorted by this priority in descending order. */
    reviewerDashboardPriority?: boolean | number
    values?: (IndexValueGenqlSelection & { __args?: {
    /** If true, only return tags that are currently in use by app requests. This is useful for only presenting useful filters. */
    inUse?: (Scalars['Boolean'] | null), search?: (Scalars['String'] | null)} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface IndexValueGenqlSelection{
    label?: boolean | number
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationGenqlSelection{
    /** Add a note to the app request. */
    addNote?: (ValidatedAppRequestResponseGenqlSelection & { __args: {content: Scalars['String'], 
    /** If true, the note will be marked as internal and only visible to reviewers. */
    internal: Scalars['Boolean']} })
    createPeriod?: (ValidatedPeriodResponseGenqlSelection & { __args: {period: PeriodUpdate, validateOnly?: (Scalars['Boolean'] | null)} })
    deletePeriod?: (ValidatedResponseGenqlSelection & { __args: {periodId: Scalars['ID']} })
    /** Make an offer on the app request. */
    offerAppRequest?: (ValidatedAppRequestResponseGenqlSelection & { __args: {appRequestId: Scalars['ID']} })
    roleAddGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grant: AccessRoleGrantCreate, roleId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    roleCreate?: (AccessRoleValidatedResponseGenqlSelection & { __args: {role: AccessRoleInput, validateOnly?: (Scalars['Boolean'] | null)} })
    roleDelete?: (ValidatedResponseGenqlSelection & { __args: {roleId: Scalars['ID']} })
    roleDeleteGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grantId: Scalars['ID']} })
    roleUpdate?: (AccessRoleValidatedResponseGenqlSelection & { __args: {role: AccessRoleInput, roleId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    roleUpdateGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grant: AccessRoleGrantUpdate, grantId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    /** Submit the app request. */
    submitAppRequest?: (ValidatedAppRequestResponseGenqlSelection & { __args: {appRequestId: Scalars['ID']} })
    updateConfiguration?: (ValidatedConfigurationResponseGenqlSelection & { __args: {data: Scalars['JsonData'], key: Scalars['String'], periodId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    updatePeriod?: (ValidatedPeriodResponseGenqlSelection & { __args: {periodId: Scalars['ID'], update: PeriodUpdate, validateOnly?: (Scalars['Boolean'] | null)} })
    /** Update the data for a prompt in this app request. */
    updatePrompt?: (ValidatedAppRequestResponseGenqlSelection & { __args: {data: Scalars['JsonData'], promptId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
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

export interface PeriodGenqlSelection{
    actions?: PeriodActionsGenqlSelection
    /** This is useful for filtering out periods that are no longer useful. For instance, a window might close applications after 2 weeks but the reviewers could be working. */
    archiveDate?: boolean | number
    /** Date that this period closes for applications. Some periods do not set a close date. */
    closeDate?: boolean | number
    /** Unique identifier for this period that references an external system. Ideally human readable. */
    code?: boolean | number
    configurations?: (ConfigurationGenqlSelection & { __args?: {filter?: (ConfigurationFilters | null)} })
    id?: boolean | number
    /** Name for this period. Will be displayed to applicants if they create an App Request while two periods are simultaneously open. */
    name?: boolean | number
    /** Date that this period opens for applications. */
    openDate?: boolean | number
    programs?: PeriodProgramGenqlSelection
    prompts?: PeriodPromptGenqlSelection
    requirements?: PeriodProgramRequirementGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PeriodActionsGenqlSelection{
    delete?: boolean | number
    update?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PeriodFilters {
/** Return periods that will be archived after this date. */
archiveAfter?: (Scalars['DateTime'] | null),
/** Return periods that were archived before this date. */
archiveBefore?: (Scalars['DateTime'] | null),
/** Return periods that are open at this date or will be open after it. */
closesAfter?: (Scalars['DateTime'] | null),
/** Return periods that closed before this date, not including that date's active period(s). */
closesBefore?: (Scalars['DateTime'] | null),
/** Return periods that have any of these codes. */
codes?: (Scalars['String'][] | null),
/** Return periods that have any of these IDs. */
ids?: (Scalars['ID'][] | null),
/** true -> open periods. false -> closed periods. null -> all periods. */
openNow?: (Scalars['Boolean'] | null),
/** Return periods that open after this date, not including that date's active period(s). */
opensAfter?: (Scalars['DateTime'] | null),
/** Return periods that are open at this date or have been open before it. */
opensBefore?: (Scalars['DateTime'] | null)}

export interface PeriodProgramGenqlSelection{
    actions?: PeriodProgramActionsGenqlSelection
    /** Whether the program is enabled in this period. This is set by the system administrator. */
    enabled?: boolean | number
    group?: PeriodProgramActionsGenqlSelection
    key?: boolean | number
    navTitle?: boolean | number
    period?: PeriodGenqlSelection
    requirements?: PeriodProgramRequirementGenqlSelection
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PeriodProgramActionsGenqlSelection{
    configure?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PeriodProgramRequirementGenqlSelection{
    /** The configuration for this requirement in the period. */
    configuration?: ConfigurationGenqlSelection
    /** An internal description of the requirement. Probably not shown to users. */
    description?: boolean | number
    /** Whether the requirement is enabled in this period. This is set by the system administrator. */
    enabled?: boolean | number
    /** A human and machine readable unique and stable identifier that we can use to add javascript logic to the evaluation of whether a requirement is satisfied. For example: "gi_ch33_must_be_post911" */
    key?: boolean | number
    /** A human readable title for the requirement in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle?: boolean | number
    prompts?: PeriodPromptGenqlSelection
    /** A human readable title for the requirement. This is what will be shown to users. */
    title?: boolean | number
    /** The type of requirement. This determines when the requirement is evaluated and who can see the requirement. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PeriodPromptGenqlSelection{
    /** The configuration for this prompt in the given period. */
    configuration?: ConfigurationGenqlSelection
    /** A brief description of the prompt. This should be shown to administrators to help explain the full meaning of the prompt while assigning permissions or editing its configuration. */
    description?: boolean | number
    /** A human and machine readable identifier for the prompt. Will be used to match prompt data with UI and API code that handles it. */
    key?: boolean | number
    /** A human readable title for the prompt in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle?: boolean | number
    periodId?: boolean | number
    /** A human readable title for the prompt. This is what will be shown to users. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PeriodUpdate {archiveDate?: (Scalars['DateTime'] | null),closeDate?: (Scalars['DateTime'] | null),code?: (Scalars['String'] | null),name: Scalars['String'],openDate: Scalars['DateTime']}

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
    appRequestIndexes?: (IndexCategoryGenqlSelection & { __args?: {categories?: (Scalars['String'][] | null), 
    /** Returns indexes that are flagged to appear in this destination. Also sorts for this destination. */
    for?: (AppRequestIndexDestination | null)} })
    appRequests?: (AppRequestGenqlSelection & { __args?: {filter?: (AppRequestFilter | null)} })
    periods?: (PeriodGenqlSelection & { __args?: {filter?: (PeriodFilters | null)} })
    programGroups?: (ProgramGroupGenqlSelection & { __args?: {filter?: (ProgramGroupFilter | null)} })
    programs?: (ProgramGenqlSelection & { __args?: {filter?: (ProgramFilters | null)} })
    roles?: (AccessRoleGenqlSelection & { __args?: {filter?: (AccessRoleFilter | null)} })
    /** A list of all possible scopes. Scopes are used to limit users when they are accessing the system through an alternate UI or login method. For instance, if you generate an authentication token to give to a third party, it may have a scope identifying that third party and limiting their access even though they are acting as you. Roles must match the token scope in order to apply permissions. */
    scopes?: boolean | number
    /** This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant. */
    subjectTypes?: AccessSubjectTypeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A RequestPrompt is an instance of a Prompt on a particular request. Once the user has answered the prompt, it contains the answer and the prompt status on that request. */
export interface RequirementPromptGenqlSelection{
    /** Actions that the user can take on this prompt. */
    actions?: RequirementPromptActionsGenqlSelection
    /** Whether the prompt has been answered on this request. */
    answered?: boolean | number
    /** The configuration data for this prompt in the app request's period. */
    configurationData?: boolean | number
    /** All the configuration data that could be relevant for this prompt. This includes its own config, and also the config data for any requirements and programs that are related to it. */
    configurationRelatedData?: boolean | number
    /** The data that has been gathered from the user in response to this prompt. The schema is controlled by the question's implementation. */
    data?: { __args: {
    /** Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh. */
    schemaVersion?: (Scalars['String'] | null)} } | boolean | number
    /** A brief description of the prompt. This should be shown to administrators to help explain the full meaning of the prompt while assigning permissions or editing its configuration. */
    description?: boolean | number
    /** Any data that the API needs to provide to the UI to display the prompt properly. For instance, if the prompt text is in the database and able to be modified by admins, the UI can't hardcode the prompt text and needs it from the API. Could also be used to pull reference information from an external system, e.g. a student's course schedule, for display in the prompt dialog. */
    fetchedData?: { __args: {
    /** Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh. */
    schemaVersion?: (Scalars['String'] | null)} } | boolean | number
    id?: boolean | number
    /** When true, this prompt has been invalidated by the answer to another prompt. The `answered` field should remain false until the user specifically answers this prompt again, regardless of the output of the definition's `complete` method. */
    invalidated?: boolean | number
    /** A human and machine readable identifier for the prompt. Will be used to match prompt data with UI and API code that handles it. */
    key?: boolean | number
    /** A human readable title for the prompt in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle?: boolean | number
    /** Preload data that has been generated according to the prompt definition. For example, a prompt might query the database for answers given in previous requests or query an external API to learn facts about the user. */
    preloadData?: { __args: {
    /** Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh. */
    schemaVersion?: (Scalars['String'] | null)} } | boolean | number
    /** The requirement that this prompt is associated with. */
    requirement?: ApplicationRequirementGenqlSelection
    /** A human readable title for the prompt. This is what will be shown to users. */
    title?: boolean | number
    /** The visibility of the prompt on the request. This is used to determine whether the prompt should be shown to the user in the UI. */
    visibility?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RequirementPromptActionsGenqlSelection{
    update?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RoleActionsGenqlSelection{
    delete?: boolean | number
    update?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ValidatedAppRequestResponseGenqlSelection{
    appRequest?: AppRequestGenqlSelection
    messages?: MutationMessageGenqlSelection
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ValidatedConfigurationResponseGenqlSelection{
    configuration?: ConfigurationGenqlSelection
    messages?: MutationMessageGenqlSelection
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ValidatedPeriodResponseGenqlSelection{
    messages?: MutationMessageGenqlSelection
    period?: PeriodGenqlSelection
    /** True if the mutation succeeded (e.g. saved data or passed validation), even if there were warnings. */
    success?: boolean | number
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
    


    const AccessGrantTag_possibleTypes: string[] = ['AccessGrantTag']
    export const isAccessGrantTag = (obj?: { __typename?: any } | null): obj is AccessGrantTag => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessGrantTag"')
      return AccessGrantTag_possibleTypes.includes(obj.__typename)
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
    


    const AccessRoleGrantActions_possibleTypes: string[] = ['AccessRoleGrantActions']
    export const isAccessRoleGrantActions = (obj?: { __typename?: any } | null): obj is AccessRoleGrantActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessRoleGrantActions"')
      return AccessRoleGrantActions_possibleTypes.includes(obj.__typename)
    }
    


    const AccessRoleValidatedResponse_possibleTypes: string[] = ['AccessRoleValidatedResponse']
    export const isAccessRoleValidatedResponse = (obj?: { __typename?: any } | null): obj is AccessRoleValidatedResponse => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessRoleValidatedResponse"')
      return AccessRoleValidatedResponse_possibleTypes.includes(obj.__typename)
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
    


    const AccessTagCategory_possibleTypes: string[] = ['AccessTagCategory']
    export const isAccessTagCategory = (obj?: { __typename?: any } | null): obj is AccessTagCategory => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAccessTagCategory"')
      return AccessTagCategory_possibleTypes.includes(obj.__typename)
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
    


    const AppRequestActions_possibleTypes: string[] = ['AppRequestActions']
    export const isAppRequestActions = (obj?: { __typename?: any } | null): obj is AppRequestActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAppRequestActions"')
      return AppRequestActions_possibleTypes.includes(obj.__typename)
    }
    


    const AppRequestActivity_possibleTypes: string[] = ['AppRequestActivity']
    export const isAppRequestActivity = (obj?: { __typename?: any } | null): obj is AppRequestActivity => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAppRequestActivity"')
      return AppRequestActivity_possibleTypes.includes(obj.__typename)
    }
    


    const AppRequestIndexCategory_possibleTypes: string[] = ['AppRequestIndexCategory']
    export const isAppRequestIndexCategory = (obj?: { __typename?: any } | null): obj is AppRequestIndexCategory => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAppRequestIndexCategory"')
      return AppRequestIndexCategory_possibleTypes.includes(obj.__typename)
    }
    


    const Application_possibleTypes: string[] = ['Application']
    export const isApplication = (obj?: { __typename?: any } | null): obj is Application => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isApplication"')
      return Application_possibleTypes.includes(obj.__typename)
    }
    


    const ApplicationActions_possibleTypes: string[] = ['ApplicationActions']
    export const isApplicationActions = (obj?: { __typename?: any } | null): obj is ApplicationActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isApplicationActions"')
      return ApplicationActions_possibleTypes.includes(obj.__typename)
    }
    


    const ApplicationRequirement_possibleTypes: string[] = ['ApplicationRequirement']
    export const isApplicationRequirement = (obj?: { __typename?: any } | null): obj is ApplicationRequirement => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isApplicationRequirement"')
      return ApplicationRequirement_possibleTypes.includes(obj.__typename)
    }
    


    const Configuration_possibleTypes: string[] = ['Configuration']
    export const isConfiguration = (obj?: { __typename?: any } | null): obj is Configuration => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfiguration"')
      return Configuration_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurationAccess_possibleTypes: string[] = ['ConfigurationAccess']
    export const isConfigurationAccess = (obj?: { __typename?: any } | null): obj is ConfigurationAccess => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurationAccess"')
      return ConfigurationAccess_possibleTypes.includes(obj.__typename)
    }
    


    const IndexCategory_possibleTypes: string[] = ['IndexCategory']
    export const isIndexCategory = (obj?: { __typename?: any } | null): obj is IndexCategory => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isIndexCategory"')
      return IndexCategory_possibleTypes.includes(obj.__typename)
    }
    


    const IndexValue_possibleTypes: string[] = ['IndexValue']
    export const isIndexValue = (obj?: { __typename?: any } | null): obj is IndexValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isIndexValue"')
      return IndexValue_possibleTypes.includes(obj.__typename)
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
    


    const Period_possibleTypes: string[] = ['Period']
    export const isPeriod = (obj?: { __typename?: any } | null): obj is Period => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPeriod"')
      return Period_possibleTypes.includes(obj.__typename)
    }
    


    const PeriodActions_possibleTypes: string[] = ['PeriodActions']
    export const isPeriodActions = (obj?: { __typename?: any } | null): obj is PeriodActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPeriodActions"')
      return PeriodActions_possibleTypes.includes(obj.__typename)
    }
    


    const PeriodProgram_possibleTypes: string[] = ['PeriodProgram']
    export const isPeriodProgram = (obj?: { __typename?: any } | null): obj is PeriodProgram => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPeriodProgram"')
      return PeriodProgram_possibleTypes.includes(obj.__typename)
    }
    


    const PeriodProgramActions_possibleTypes: string[] = ['PeriodProgramActions']
    export const isPeriodProgramActions = (obj?: { __typename?: any } | null): obj is PeriodProgramActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPeriodProgramActions"')
      return PeriodProgramActions_possibleTypes.includes(obj.__typename)
    }
    


    const PeriodProgramRequirement_possibleTypes: string[] = ['PeriodProgramRequirement']
    export const isPeriodProgramRequirement = (obj?: { __typename?: any } | null): obj is PeriodProgramRequirement => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPeriodProgramRequirement"')
      return PeriodProgramRequirement_possibleTypes.includes(obj.__typename)
    }
    


    const PeriodPrompt_possibleTypes: string[] = ['PeriodPrompt']
    export const isPeriodPrompt = (obj?: { __typename?: any } | null): obj is PeriodPrompt => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPeriodPrompt"')
      return PeriodPrompt_possibleTypes.includes(obj.__typename)
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
    


    const RequirementPrompt_possibleTypes: string[] = ['RequirementPrompt']
    export const isRequirementPrompt = (obj?: { __typename?: any } | null): obj is RequirementPrompt => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRequirementPrompt"')
      return RequirementPrompt_possibleTypes.includes(obj.__typename)
    }
    


    const RequirementPromptActions_possibleTypes: string[] = ['RequirementPromptActions']
    export const isRequirementPromptActions = (obj?: { __typename?: any } | null): obj is RequirementPromptActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRequirementPromptActions"')
      return RequirementPromptActions_possibleTypes.includes(obj.__typename)
    }
    


    const RoleActions_possibleTypes: string[] = ['RoleActions']
    export const isRoleActions = (obj?: { __typename?: any } | null): obj is RoleActions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRoleActions"')
      return RoleActions_possibleTypes.includes(obj.__typename)
    }
    


    const ValidatedAppRequestResponse_possibleTypes: string[] = ['ValidatedAppRequestResponse']
    export const isValidatedAppRequestResponse = (obj?: { __typename?: any } | null): obj is ValidatedAppRequestResponse => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isValidatedAppRequestResponse"')
      return ValidatedAppRequestResponse_possibleTypes.includes(obj.__typename)
    }
    


    const ValidatedConfigurationResponse_possibleTypes: string[] = ['ValidatedConfigurationResponse']
    export const isValidatedConfigurationResponse = (obj?: { __typename?: any } | null): obj is ValidatedConfigurationResponse => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isValidatedConfigurationResponse"')
      return ValidatedConfigurationResponse_possibleTypes.includes(obj.__typename)
    }
    


    const ValidatedPeriodResponse_possibleTypes: string[] = ['ValidatedPeriodResponse']
    export const isValidatedPeriodResponse = (obj?: { __typename?: any } | null): obj is ValidatedPeriodResponse => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isValidatedPeriodResponse"')
      return ValidatedPeriodResponse_possibleTypes.includes(obj.__typename)
    }
    


    const ValidatedResponse_possibleTypes: string[] = ['ValidatedResponse']
    export const isValidatedResponse = (obj?: { __typename?: any } | null): obj is ValidatedResponse => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isValidatedResponse"')
      return ValidatedResponse_possibleTypes.includes(obj.__typename)
    }
    

export const enumAppRequestIndexDestination = {
   APPLICANT_DASHBOARD: 'APPLICANT_DASHBOARD' as const,
   APP_REQUEST_LIST: 'APP_REQUEST_LIST' as const,
   LIST_FILTERS: 'LIST_FILTERS' as const,
   REVIEWER_DASHBOARD: 'REVIEWER_DASHBOARD' as const
}

export const enumAppRequestStatus = {
   ACCEPTANCE: 'ACCEPTANCE' as const,
   ACCEPTED: 'ACCEPTED' as const,
   APPROVAL: 'APPROVAL' as const,
   APPROVED: 'APPROVED' as const,
   CANCELLED: 'CANCELLED' as const,
   DISQUALIFIED: 'DISQUALIFIED' as const,
   NOT_ACCEPTED: 'NOT_ACCEPTED' as const,
   NOT_APPROVED: 'NOT_APPROVED' as const,
   PREAPPROVAL: 'PREAPPROVAL' as const,
   READY_TO_SUBMIT: 'READY_TO_SUBMIT' as const,
   STARTED: 'STARTED' as const,
   WITHDRAWN: 'WITHDRAWN' as const
}

export const enumApplicationStatus = {
   ACCEPTANCE: 'ACCEPTANCE' as const,
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
   READY_TO_SUBMIT: 'READY_TO_SUBMIT' as const,
   WITHDRAWN: 'WITHDRAWN' as const
}

export const enumMutationMessageType = {
   error: 'error' as const,
   success: 'success' as const,
   warning: 'warning' as const
}

export const enumPromptVisibility = {
   APPLICATION_DUPE: 'APPLICATION_DUPE' as const,
   AUTOMATION: 'AUTOMATION' as const,
   AVAILABLE: 'AVAILABLE' as const,
   REQUEST_DUPE: 'REQUEST_DUPE' as const,
   UNREACHABLE: 'UNREACHABLE' as const
}

export const enumRequirementStatus = {
   DISQUALIFYING: 'DISQUALIFYING' as const,
   MET: 'MET' as const,
   NOT_APPLICABLE: 'NOT_APPLICABLE' as const,
   PENDING: 'PENDING' as const,
   WARNING: 'WARNING' as const
}

export const enumRequirementType = {
   ACCEPTANCE: 'ACCEPTANCE' as const,
   APPROVAL: 'APPROVAL' as const,
   POSTQUAL: 'POSTQUAL' as const,
   PREAPPROVAL: 'PREAPPROVAL' as const,
   PREQUAL: 'PREQUAL' as const,
   QUALIFICATION: 'QUALIFICATION' as const
}
