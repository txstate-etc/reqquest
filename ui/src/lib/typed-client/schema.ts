// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Boolean: boolean,
    DateTime: string,
    ID: string,
    JsonData: Record<string, any>,
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
    /** The period this appRequest is associated with. */
    period: Period
    status: AppRequestStatus
    updatedAt: Scalars['DateTime']
    __typename: 'AppRequest'
}


/**
 * 
 *     The status of an appRequest. This status is computed based on the "dbStatus" recorded in
 *     the database and the status of each application.
 *   
 */
export type AppRequestStatus = 'APPROVAL' | 'APPROVED' | 'APPROVED_CLOSED' | 'CANCELLED' | 'DISQUALIFIED' | 'DISQUALIFIED_CLOSED' | 'PREAPPROVAL' | 'READY_TO_SUBMIT' | 'STARTED' | 'WITHDRAWN'


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
export type ApplicationStatus = 'ACCEPTED' | 'APPROVAL' | 'APPROVED' | 'CANCELLED' | 'FAILED_PREQUAL' | 'FAILED_QUALIFICATION' | 'NOT_ACCEPTED' | 'NOT_APPROVED' | 'PREAPPROVAL' | 'PREQUAL' | 'QUALIFICATION' | 'READY_TO_SUBMIT' | 'WITHDRAWN'

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

export interface Mutation {
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
    archiveAt: (Scalars['DateTime'] | null)
    /** Date that this period closes for applications. */
    closeDate: Scalars['DateTime']
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
    update: Scalars['Boolean']
    view: Scalars['Boolean']
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
    periods: Period[]
    programGroups: ProgramGroup[]
    programs: Program[]
    roles: AccessRole[]
    /** This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant. */
    subjectTypes: AccessSubjectType[]
    __typename: 'Query'
}


/** A RequestPrompt is an instance of a Prompt on a particular request. Once the user has answered the prompt, it contains the answer and the prompt status on that request. */
export interface RequirementPrompt {
    /** Whether the prompt has been answered on this request. */
    answered: Scalars['Boolean']
    /** For convenience, this is true if either askedInEarlierRequirement or askedInEarlierApplication is true. */
    askedEarlier: Scalars['Boolean']
    /** When true, means that this prompt should be hidden from navigation due to being asked in an earlier application. If a screen were reviewing the details of a single application, this prompt's information might re-appear in that context. */
    askedInEarlierApplication: Scalars['Boolean']
    /** When true, means that this prompt should be hidden from navigation due to being asked in an earlier requirement in the same application. If a screen were reviewing the details of a single requirement, this prompt's information might re-appear in that context. */
    askedInEarlierRequirement: Scalars['Boolean']
    /** The configuration data for this prompt in the app request's period. */
    configurationData: Scalars['JsonData']
    /** The data that has been gathered from the user in response to this prompt. The schema is controlled by the question's implementation. */
    data: (Scalars['JsonData'] | null)
    /** A brief description of the prompt. This should be shown to administrators to help explain the full meaning of the prompt while assigning permissions or editing its configuration. */
    description: (Scalars['String'] | null)
    /** Any data that the API needs to provide to the UI to display the prompt properly. For instance, if the prompt text is in the database and able to be modified by admins, the UI can't hardcode the prompt text and needs it from the API. Could also be used to pull reference information from an external system, e.g. a student's course schedule, for display in the prompt dialog. */
    fetchedData: (Scalars['JsonData'] | null)
    /** For convenience, this is true if the prompt is not reachable or has been asked earlier. */
    hiddenInNavigation: Scalars['Boolean']
    id: Scalars['ID']
    /** When true, this prompt has been invalidated by the answer to another prompt. The `answered` field should remain false until the user specifically answers this prompt again, regardless of the output of the definition's `complete` method. */
    invalidated: Scalars['Boolean']
    /** A human and machine readable identifier for the prompt. Will be used to match prompt data with UI and API code that handles it. */
    key: Scalars['String']
    /** A human readable title for the prompt in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used. */
    navTitle: Scalars['String']
    /** Preload data that has been generated according to the prompt definition. For example, a prompt might query the database for answers given in previous requests or query an external API to learn facts about the user. */
    preloadData: (Scalars['JsonData'] | null)
    /** When true, means that the prompt has not been made moot by an earlier requirement failing. It may still need to be hidden from navigation based on askedInEarlierRequirement or askedInEarlierApplication. */
    reachable: Scalars['Boolean']
    /** A human readable title for the prompt. This is what will be shown to users. */
    title: Scalars['String']
    __typename: 'RequirementPrompt'
}

export type RequirementStatus = 'DISQUALIFYING' | 'MET' | 'NOT_APPLICABLE' | 'PENDING' | 'WARNING'

export type RequirementType = 'APPROVAL' | 'PREAPPROVAL' | 'PREQUAL' | 'QUALIFICATION'

export interface RoleActions {
    delete: Scalars['Boolean']
    update: Scalars['Boolean']
    view: Scalars['Boolean']
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
    /** The period this appRequest is associated with. */
    period?: PeriodGenqlSelection
    status?: boolean | number
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

export interface MutationGenqlSelection{
    roleAddGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grant: AccessRoleGrantCreate, roleId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    roleCreate?: (AccessRoleValidatedResponseGenqlSelection & { __args: {role: AccessRoleInput, validateOnly?: (Scalars['Boolean'] | null)} })
    roleDelete?: (ValidatedResponseGenqlSelection & { __args: {roleId: Scalars['ID']} })
    roleDeleteGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grantId: Scalars['ID']} })
    roleUpdate?: (AccessRoleValidatedResponseGenqlSelection & { __args: {role: AccessRoleInput, roleId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    roleUpdateGrant?: (AccessRoleValidatedResponseGenqlSelection & { __args: {grant: AccessRoleGrantCreate, grantId: Scalars['ID'], validateOnly?: (Scalars['Boolean'] | null)} })
    /** Submit the app request. */
    submitAppRequest?: (ValidatedAppRequestResponseGenqlSelection & { __args: {appRequestId: Scalars['ID']} })
    updateConfiguration?: (ValidatedConfigurationResponseGenqlSelection & { __args: {data: Scalars['JsonData'], key: Scalars['String'], periodId: Scalars['String'], validateOnly?: (Scalars['Boolean'] | null)} })
    updatePeriod?: (ValidatedPeriodResponseGenqlSelection & { __args: {id: Scalars['String'], update: PeriodUpdate, validateOnly?: (Scalars['Boolean'] | null)} })
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
    archiveAt?: boolean | number
    /** Date that this period closes for applications. */
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
    update?: boolean | number
    view?: boolean | number
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

export interface PeriodUpdate {archiveAt?: (Scalars['DateTime'] | null),closeDate?: (Scalars['DateTime'] | null),code?: (Scalars['String'] | null),name?: (Scalars['String'] | null),openDate?: (Scalars['DateTime'] | null)}

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
    periods?: (PeriodGenqlSelection & { __args?: {filter?: (PeriodFilters | null)} })
    programGroups?: (ProgramGroupGenqlSelection & { __args?: {filter?: (ProgramGroupFilter | null)} })
    programs?: (ProgramGenqlSelection & { __args?: {filter?: (ProgramFilters | null)} })
    roles?: (AccessRoleGenqlSelection & { __args?: {filter?: (AccessRoleFilter | null)} })
    /** This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant. */
    subjectTypes?: AccessSubjectTypeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A RequestPrompt is an instance of a Prompt on a particular request. Once the user has answered the prompt, it contains the answer and the prompt status on that request. */
export interface RequirementPromptGenqlSelection{
    /** Whether the prompt has been answered on this request. */
    answered?: boolean | number
    /** For convenience, this is true if either askedInEarlierRequirement or askedInEarlierApplication is true. */
    askedEarlier?: boolean | number
    /** When true, means that this prompt should be hidden from navigation due to being asked in an earlier application. If a screen were reviewing the details of a single application, this prompt's information might re-appear in that context. */
    askedInEarlierApplication?: boolean | number
    /** When true, means that this prompt should be hidden from navigation due to being asked in an earlier requirement in the same application. If a screen were reviewing the details of a single requirement, this prompt's information might re-appear in that context. */
    askedInEarlierRequirement?: boolean | number
    /** The configuration data for this prompt in the app request's period. */
    configurationData?: boolean | number
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
    /** For convenience, this is true if the prompt is not reachable or has been asked earlier. */
    hiddenInNavigation?: boolean | number
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
    /** When true, means that the prompt has not been made moot by an earlier requirement failing. It may still need to be hidden from navigation based on askedInEarlierRequirement or askedInEarlierApplication. */
    reachable?: boolean | number
    /** A human readable title for the prompt. This is what will be shown to users. */
    title?: boolean | number
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
    

export const enumAccessSearchType = {
   NONE: 'NONE' as const,
   SEARCH: 'SEARCH' as const,
   SELECT: 'SELECT' as const
}

export const enumAppRequestStatus = {
   APPROVAL: 'APPROVAL' as const,
   APPROVED: 'APPROVED' as const,
   APPROVED_CLOSED: 'APPROVED_CLOSED' as const,
   CANCELLED: 'CANCELLED' as const,
   DISQUALIFIED: 'DISQUALIFIED' as const,
   DISQUALIFIED_CLOSED: 'DISQUALIFIED_CLOSED' as const,
   PREAPPROVAL: 'PREAPPROVAL' as const,
   READY_TO_SUBMIT: 'READY_TO_SUBMIT' as const,
   STARTED: 'STARTED' as const,
   WITHDRAWN: 'WITHDRAWN' as const
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
   READY_TO_SUBMIT: 'READY_TO_SUBMIT' as const,
   WITHDRAWN: 'WITHDRAWN' as const
}

export const enumMutationMessageType = {
   error: 'error' as const,
   success: 'success' as const,
   warning: 'warning' as const
}

export const enumRequirementStatus = {
   DISQUALIFYING: 'DISQUALIFYING' as const,
   MET: 'MET' as const,
   NOT_APPLICABLE: 'NOT_APPLICABLE' as const,
   PENDING: 'PENDING' as const,
   WARNING: 'WARNING' as const
}

export const enumRequirementType = {
   APPROVAL: 'APPROVAL' as const,
   PREAPPROVAL: 'PREAPPROVAL' as const,
   PREQUAL: 'PREQUAL' as const,
   QUALIFICATION: 'QUALIFICATION' as const
}
