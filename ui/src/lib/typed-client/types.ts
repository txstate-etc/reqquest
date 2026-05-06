export default {
    "scalars": [
        28,
        31,
        32,
        35,
        37,
        38,
        44,
        45,
        46,
        49,
        50,
        51,
        54,
        71,
        76,
        77,
        79
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                38
            ],
            "createAppRequestSelf": [
                38
            ],
            "createPeriod": [
                38
            ],
            "createRole": [
                38
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                38
            ],
            "viewApplicantDashboard": [
                38
            ],
            "viewPeriodManagement": [
                38
            ],
            "viewReviewerInterface": [
                38
            ],
            "viewRoleManagement": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "AccessControl": {
            "description": [
                79
            ],
            "name": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                79
            ],
            "name": [
                79
            ],
            "tags": [
                15
            ],
            "title": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessGrantTag": {
            "category": [
                79
            ],
            "categoryLabel": [
                79
            ],
            "label": [
                79
            ],
            "tag": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessRole": {
            "actions": [
                78
            ],
            "description": [
                79
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                46
            ],
            "name": [
                79
            ],
            "scope": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                79
            ],
            "ids": [
                46
            ],
            "names": [
                79
            ],
            "scopes": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                38
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                79
            ],
            "id": [
                46
            ],
            "tags": [
                3
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                38
            ],
            "update": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                38
            ],
            "controlGroup": [
                79
            ],
            "controls": [
                79
            ],
            "tags": [
                16
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                38
            ],
            "controlGroup": [
                79
            ],
            "controls": [
                79
            ],
            "tags": [
                16
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                44
            ],
            "dateCreated": [
                44
            ],
            "groupName": [
                79
            ],
            "managers": [
                11
            ],
            "roleId": [
                46
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                79
            ],
            "fullname": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleInput": {
            "description": [
                79
            ],
            "groups": [
                79
            ],
            "name": [
                79
            ],
            "scope": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                53
            ],
            "success": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "AccessTag": {
            "label": [
                79
            ],
            "value": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessTagCategory": {
            "category": [
                79
            ],
            "description": [
                79
            ],
            "label": [
                79
            ],
            "listable": [
                38
            ],
            "tags": [
                14
            ],
            "__typename": [
                79
            ]
        },
        "AccessTagInput": {
            "category": [
                79
            ],
            "tag": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessUser": {
            "fullname": [
                79
            ],
            "groups": [
                79
            ],
            "login": [
                46
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                51
            ],
            "roles": [
                4
            ],
            "stillValid": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                46
            ],
            "tags": [
                46
            ],
            "__typename": [
                79
            ]
        },
        "AccessUserFilter": {
            "logins": [
                46
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                79
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                79
            ],
            "search": [
                79
            ],
            "self": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                46
            ],
            "label": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                46
            ],
            "label": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AppRequest": {
            "actions": [
                23
            ],
            "applicant": [
                17
            ],
            "applications": [
                33
            ],
            "closedAt": [
                44
            ],
            "createdAt": [
                44
            ],
            "data": [
                51,
                {
                    "schemaVersion": [
                        79
                    ]
                }
            ],
            "dataVersion": [
                50
            ],
            "id": [
                46
            ],
            "indexCategories": [
                27,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "notes": [
                55,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "otherNotes": [
                55,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "period": [
                60
            ],
            "phase": [
                31
            ],
            "prompt": [
                73,
                {
                    "promptId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "status": [
                32
            ],
            "statusReason": [
                79
            ],
            "submittedAt": [
                44
            ],
            "updatedAt": [
                44
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                38
            ],
            "cancel": [
                38
            ],
            "close": [
                38
            ],
            "completeRequest": [
                38
            ],
            "completeReview": [
                38
            ],
            "createNote": [
                38
            ],
            "createPersistentNote": [
                38
            ],
            "reopen": [
                38
            ],
            "returnToApplicant": [
                38
            ],
            "returnToNonBlocking": [
                38
            ],
            "returnToOffer": [
                38
            ],
            "returnToReview": [
                38
            ],
            "review": [
                38
            ],
            "submit": [
                38
            ],
            "viewAcceptUI": [
                38
            ],
            "viewApplyUI": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestActivity": {
            "action": [
                79
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                44
            ],
            "data": [
                51
            ],
            "description": [
                79
            ],
            "id": [
                46
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                79
            ],
            "appRequestIds": [
                46
            ],
            "happenedAfter": [
                44
            ],
            "happenedBefore": [
                44
            ],
            "impersonated": [
                38
            ],
            "impersonatedBy": [
                46
            ],
            "impersonatedUsers": [
                46
            ],
            "users": [
                46
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestFilter": {
            "closed": [
                38
            ],
            "closedAfter": [
                44
            ],
            "closedBefore": [
                44
            ],
            "complete": [
                38
            ],
            "createdAfter": [
                44
            ],
            "createdBefore": [
                44
            ],
            "ids": [
                46
            ],
            "indexes": [
                29
            ],
            "logins": [
                46
            ],
            "own": [
                38
            ],
            "periodIds": [
                46
            ],
            "reviewStarted": [
                38
            ],
            "search": [
                79
            ],
            "status": [
                32
            ],
            "submittedAfter": [
                44
            ],
            "submittedBefore": [
                44
            ],
            "updatedAfter": [
                44
            ],
            "updatedBefore": [
                44
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                45
            ],
            "applicantDashboardPriority": [
                45
            ],
            "category": [
                79
            ],
            "categoryLabel": [
                79
            ],
            "listFiltersPriority": [
                45
            ],
            "listable": [
                38
            ],
            "reviewerDashboardPriority": [
                45
            ],
            "values": [
                48
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                79
            ],
            "tags": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                46
            ],
            "applicants": [
                79
            ],
            "ids": [
                46
            ],
            "__typename": [
                79
            ]
        },
        "AppRequestPhase": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                34
            ],
            "id": [
                46
            ],
            "ineligiblePhase": [
                49
            ],
            "navTitle": [
                79
            ],
            "nextWorkflowStage": [
                68
            ],
            "phase": [
                35
            ],
            "previousWorkflowStage": [
                68
            ],
            "programKey": [
                79
            ],
            "requirements": [
                36
            ],
            "status": [
                37
            ],
            "statusReason": [
                79
            ],
            "title": [
                79
            ],
            "workflowStage": [
                68
            ],
            "workflowStages": [
                68
            ],
            "__typename": [
                79
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                38
            ],
            "reverseWorkflow": [
                38
            ],
            "viewAsReviewer": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                33
            ],
            "configurationData": [
                51
            ],
            "description": [
                79
            ],
            "id": [
                46
            ],
            "key": [
                79
            ],
            "navTitle": [
                79
            ],
            "prompts": [
                73,
                {
                    "filter": [
                        75
                    ]
                }
            ],
            "smartTitle": [
                79
            ],
            "status": [
                76
            ],
            "statusReason": [
                79
            ],
            "title": [
                79
            ],
            "type": [
                77
            ],
            "workflowStage": [
                68
            ],
            "__typename": [
                79
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                79
            ],
            "label": [
                79
            ],
            "tags": [
                40
            ],
            "useInFilters": [
                38
            ],
            "useInList": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "CategoryTag": {
            "label": [
                79
            ],
            "tag": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "Configuration": {
            "actions": [
                42
            ],
            "data": [
                51
            ],
            "fetchedData": [
                51
            ],
            "key": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "ConfigurationAccess": {
            "update": [
                38
            ],
            "view": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                46
            ],
            "keys": [
                79
            ],
            "periodCodes": [
                79
            ],
            "periodIds": [
                46
            ],
            "__typename": [
                79
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                45
            ],
            "applicantDashboardPriority": [
                45
            ],
            "category": [
                79
            ],
            "categoryLabel": [
                79
            ],
            "listFiltersPriority": [
                45
            ],
            "listable": [
                38
            ],
            "reviewerDashboardPriority": [
                45
            ],
            "values": [
                48,
                {
                    "inUse": [
                        38
                    ],
                    "search": [
                        79
                    ]
                }
            ],
            "__typename": [
                79
            ]
        },
        "IndexValue": {
            "label": [
                79
            ],
            "value": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                82,
                {
                    "content": [
                        79,
                        "String!"
                    ],
                    "persistent": [
                        38
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "advanceWorkflow": [
                80,
                {
                    "applicationId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ],
                    "dataVersion": [
                        50
                    ]
                }
            ],
            "closeAppRequest": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                80,
                {
                    "login": [
                        79,
                        "String!"
                    ],
                    "periodId": [
                        46,
                        "ID!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "createPeriod": [
                83,
                {
                    "copyPeriodId": [
                        79
                    ],
                    "period": [
                        67,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "deleteNote": [
                38,
                {
                    "noteId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "deletePeriod": [
                84,
                {
                    "periodId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                83,
                {
                    "periodId": [
                        46,
                        "ID!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "reopenAppRequest": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToApplicant": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                80,
                {
                    "applicationId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "roleAddGrant": [
                13,
                {
                    "grant": [
                        8,
                        "AccessRoleGrantCreate!"
                    ],
                    "roleId": [
                        46,
                        "ID!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        46
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "roleDelete": [
                84,
                {
                    "roleId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "roleUpdate": [
                13,
                {
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "roleId": [
                        46,
                        "ID!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "roleUpdateGrant": [
                13,
                {
                    "grant": [
                        9,
                        "AccessRoleGrantUpdate!"
                    ],
                    "grantId": [
                        46,
                        "ID!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "stagePrompt": [
                80,
                {
                    "dataVersion": [
                        50
                    ],
                    "promptId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "submitAppRequest": [
                80,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "togglePersistence": [
                82,
                {
                    "noteId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                81,
                {
                    "data": [
                        51,
                        "JsonData!"
                    ],
                    "key": [
                        79,
                        "String!"
                    ],
                    "periodId": [
                        46,
                        "ID!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "updateNote": [
                82,
                {
                    "content": [
                        79,
                        "String!"
                    ],
                    "noteId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "updatePeriod": [
                83,
                {
                    "periodId": [
                        46,
                        "ID!"
                    ],
                    "update": [
                        67,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "updatePeriodRequirement": [
                84,
                {
                    "disabled": [
                        38,
                        "Boolean!"
                    ],
                    "periodId": [
                        79,
                        "String!"
                    ],
                    "requirementKey": [
                        79,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                80,
                {
                    "data": [
                        51,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        50
                    ],
                    "promptId": [
                        46,
                        "ID!"
                    ],
                    "validateOnly": [
                        38
                    ]
                }
            ],
            "__typename": [
                79
            ]
        },
        "MutationMessage": {
            "arg": [
                79
            ],
            "message": [
                79
            ],
            "type": [
                54
            ],
            "__typename": [
                79
            ]
        },
        "MutationMessageType": {},
        "Note": {
            "actions": [
                56
            ],
            "appRequest": [
                22
            ],
            "author": [
                17
            ],
            "content": [
                79
            ],
            "createdAt": [
                44
            ],
            "id": [
                46
            ],
            "persistent": [
                38
            ],
            "updatedAt": [
                44
            ],
            "__typename": [
                79
            ]
        },
        "NoteActions": {
            "delete": [
                38
            ],
            "update": [
                38
            ],
            "updatePersistent": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "Pagination": {
            "page": [
                50
            ],
            "perPage": [
                50
            ],
            "__typename": [
                79
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                39
            ],
            "currentPage": [
                45
            ],
            "hasNextPage": [
                38
            ],
            "perPage": [
                45
            ],
            "totalItems": [
                45
            ],
            "__typename": [
                79
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                58
            ],
            "appRequests": [
                58
            ],
            "appRequestsActivity": [
                58
            ],
            "__typename": [
                79
            ]
        },
        "Period": {
            "actions": [
                61
            ],
            "archiveDate": [
                44
            ],
            "closeDate": [
                44
            ],
            "code": [
                79
            ],
            "configurations": [
                41,
                {
                    "filter": [
                        43
                    ]
                }
            ],
            "id": [
                46
            ],
            "name": [
                79
            ],
            "openDate": [
                44
            ],
            "programs": [
                63
            ],
            "prompts": [
                66
            ],
            "requirements": [
                65
            ],
            "reviewed": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                38
            ],
            "delete": [
                38
            ],
            "update": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                44
            ],
            "archiveBefore": [
                44
            ],
            "closesAfter": [
                44
            ],
            "closesBefore": [
                44
            ],
            "codes": [
                79
            ],
            "ids": [
                46
            ],
            "names": [
                79
            ],
            "openNow": [
                38
            ],
            "opensAfter": [
                44
            ],
            "opensBefore": [
                44
            ],
            "__typename": [
                79
            ]
        },
        "PeriodProgram": {
            "actions": [
                64
            ],
            "enabled": [
                38
            ],
            "key": [
                46
            ],
            "navTitle": [
                79
            ],
            "period": [
                60
            ],
            "requirements": [
                65
            ],
            "title": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                41
            ],
            "description": [
                79
            ],
            "enabled": [
                38
            ],
            "key": [
                79
            ],
            "navTitle": [
                79
            ],
            "prompts": [
                66
            ],
            "title": [
                79
            ],
            "type": [
                77
            ],
            "__typename": [
                79
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                41
            ],
            "description": [
                79
            ],
            "key": [
                79
            ],
            "navTitle": [
                79
            ],
            "periodId": [
                79
            ],
            "title": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                44
            ],
            "closeDate": [
                44
            ],
            "code": [
                79
            ],
            "name": [
                79
            ],
            "openDate": [
                44
            ],
            "__typename": [
                79
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                38
            ],
            "key": [
                79
            ],
            "title": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "Program": {
            "key": [
                46
            ],
            "navTitle": [
                79
            ],
            "title": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "ProgramFilters": {
            "keys": [
                79
            ],
            "__typename": [
                79
            ]
        },
        "PromptVisibility": {},
        "Query": {
            "access": [
                0
            ],
            "accessUsers": [
                17,
                {
                    "filter": [
                        19
                    ],
                    "paged": [
                        57
                    ]
                }
            ],
            "appRequestActivity": [
                24,
                {
                    "filters": [
                        25
                    ],
                    "id": [
                        79,
                        "String!"
                    ],
                    "paged": [
                        57
                    ]
                }
            ],
            "appRequestIndexes": [
                47,
                {
                    "categories": [
                        79,
                        "[String!]"
                    ],
                    "for": [
                        28
                    ]
                }
            ],
            "appRequests": [
                22,
                {
                    "filter": [
                        26
                    ],
                    "paged": [
                        57
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "countAppRequests": [
                50,
                {
                    "filter": [
                        26
                    ]
                }
            ],
            "pageInfo": [
                59
            ],
            "periods": [
                60,
                {
                    "filter": [
                        62
                    ]
                }
            ],
            "programs": [
                69,
                {
                    "filter": [
                        70
                    ]
                }
            ],
            "roles": [
                4,
                {
                    "filter": [
                        5
                    ]
                }
            ],
            "scopes": [
                79
            ],
            "userIndexes": [
                47,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "__typename": [
                79
            ]
        },
        "RequirementPrompt": {
            "actions": [
                74
            ],
            "answered": [
                38
            ],
            "configurationData": [
                51
            ],
            "data": [
                51,
                {
                    "schemaVersion": [
                        79
                    ]
                }
            ],
            "description": [
                79
            ],
            "fetchedData": [
                51,
                {
                    "schemaVersion": [
                        79
                    ]
                }
            ],
            "gatheredConfigData": [
                51
            ],
            "id": [
                46
            ],
            "invalidated": [
                38
            ],
            "invalidatedReason": [
                79
            ],
            "key": [
                79
            ],
            "moot": [
                38
            ],
            "navTitle": [
                79
            ],
            "preloadData": [
                51,
                {
                    "schemaVersion": [
                        79
                    ]
                }
            ],
            "prestage": [
                38
            ],
            "requirement": [
                36
            ],
            "title": [
                79
            ],
            "visibility": [
                71
            ],
            "__typename": [
                79
            ]
        },
        "RequirementPromptActions": {
            "update": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "RequirementPromptFilter": {
            "answered": [
                38
            ],
            "appRequestIds": [
                46
            ],
            "applicationIds": [
                46
            ],
            "ids": [
                46
            ],
            "promptKeys": [
                79
            ],
            "reachable": [
                38
            ],
            "requirementIds": [
                46
            ],
            "__typename": [
                79
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                38
            ],
            "update": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                53
            ],
            "success": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                41
            ],
            "messages": [
                53
            ],
            "success": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "ValidatedNoteResponse": {
            "messages": [
                53
            ],
            "note": [
                55
            ],
            "success": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                53
            ],
            "period": [
                60
            ],
            "success": [
                38
            ],
            "__typename": [
                79
            ]
        },
        "ValidatedResponse": {
            "messages": [
                53
            ],
            "success": [
                38
            ],
            "__typename": [
                79
            ]
        }
    }
}