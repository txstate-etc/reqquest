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
        75,
        76,
        78
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
                78
            ]
        },
        "AccessControl": {
            "description": [
                78
            ],
            "name": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                78
            ],
            "name": [
                78
            ],
            "tags": [
                15
            ],
            "title": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessGrantTag": {
            "category": [
                78
            ],
            "categoryLabel": [
                78
            ],
            "label": [
                78
            ],
            "tag": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessRole": {
            "actions": [
                77
            ],
            "description": [
                78
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
                78
            ],
            "scope": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                78
            ],
            "ids": [
                46
            ],
            "names": [
                78
            ],
            "scopes": [
                78
            ],
            "__typename": [
                78
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
                78
            ],
            "id": [
                46
            ],
            "tags": [
                3
            ],
            "__typename": [
                78
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
                78
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                38
            ],
            "controlGroup": [
                78
            ],
            "controls": [
                78
            ],
            "tags": [
                16
            ],
            "__typename": [
                78
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                38
            ],
            "controlGroup": [
                78
            ],
            "controls": [
                78
            ],
            "tags": [
                16
            ],
            "__typename": [
                78
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
                78
            ],
            "managers": [
                11
            ],
            "roleId": [
                46
            ],
            "__typename": [
                78
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                78
            ],
            "fullname": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessRoleInput": {
            "description": [
                78
            ],
            "groups": [
                78
            ],
            "name": [
                78
            ],
            "scope": [
                78
            ],
            "__typename": [
                78
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
                78
            ]
        },
        "AccessTag": {
            "label": [
                78
            ],
            "value": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessTagCategory": {
            "category": [
                78
            ],
            "description": [
                78
            ],
            "label": [
                78
            ],
            "listable": [
                38
            ],
            "tags": [
                14
            ],
            "__typename": [
                78
            ]
        },
        "AccessTagInput": {
            "category": [
                78
            ],
            "tag": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessUser": {
            "fullname": [
                78
            ],
            "groups": [
                78
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
                78
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
                78
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
                78
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                78
            ],
            "search": [
                78
            ],
            "self": [
                38
            ],
            "__typename": [
                78
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                46
            ],
            "label": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                46
            ],
            "label": [
                78
            ],
            "__typename": [
                78
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
                        78
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
                78
            ],
            "submittedAt": [
                44
            ],
            "updatedAt": [
                44
            ],
            "__typename": [
                78
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
                78
            ]
        },
        "AppRequestActivity": {
            "action": [
                78
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
                78
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
                78
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                78
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
                78
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
                78
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
                78
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
                78
            ],
            "categoryLabel": [
                78
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
                78
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                78
            ],
            "tags": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                46
            ],
            "applicants": [
                78
            ],
            "ids": [
                46
            ],
            "__typename": [
                78
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
                78
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
                78
            ],
            "requirements": [
                36
            ],
            "status": [
                37
            ],
            "statusReason": [
                78
            ],
            "title": [
                78
            ],
            "workflowStage": [
                68
            ],
            "workflowStages": [
                68
            ],
            "__typename": [
                78
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
                78
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
                78
            ],
            "id": [
                46
            ],
            "key": [
                78
            ],
            "navTitle": [
                78
            ],
            "prompts": [
                73
            ],
            "smartTitle": [
                78
            ],
            "status": [
                75
            ],
            "statusReason": [
                78
            ],
            "title": [
                78
            ],
            "type": [
                76
            ],
            "workflowStage": [
                68
            ],
            "__typename": [
                78
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                78
            ],
            "label": [
                78
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
                78
            ]
        },
        "CategoryTag": {
            "label": [
                78
            ],
            "tag": [
                78
            ],
            "__typename": [
                78
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
                78
            ],
            "__typename": [
                78
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
                78
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                46
            ],
            "keys": [
                78
            ],
            "periodCodes": [
                78
            ],
            "periodIds": [
                46
            ],
            "__typename": [
                78
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
                78
            ],
            "categoryLabel": [
                78
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
                        78
                    ]
                }
            ],
            "__typename": [
                78
            ]
        },
        "IndexValue": {
            "label": [
                78
            ],
            "value": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                79,
                {
                    "content": [
                        78,
                        "String!"
                    ]
                }
            ],
            "advanceWorkflow": [
                79,
                {
                    "applicationId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                79,
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
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                79,
                {
                    "login": [
                        78,
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
                81,
                {
                    "copyPeriodId": [
                        78
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
                        78,
                        "String!"
                    ]
                }
            ],
            "deletePeriod": [
                82,
                {
                    "periodId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                81,
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
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToApplicant": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                79,
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
                82,
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
            "submitAppRequest": [
                79,
                {
                    "appRequestId": [
                        46,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                80,
                {
                    "data": [
                        51,
                        "JsonData!"
                    ],
                    "key": [
                        78,
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
                55,
                {
                    "content": [
                        78,
                        "String!"
                    ],
                    "noteId": [
                        78,
                        "String!"
                    ]
                }
            ],
            "updatePeriod": [
                81,
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
                82,
                {
                    "disabled": [
                        38,
                        "Boolean!"
                    ],
                    "periodId": [
                        78,
                        "String!"
                    ],
                    "requirementKey": [
                        78,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                79,
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
                78
            ]
        },
        "MutationMessage": {
            "arg": [
                78
            ],
            "message": [
                78
            ],
            "type": [
                54
            ],
            "__typename": [
                78
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
                78
            ],
            "createdAt": [
                44
            ],
            "id": [
                46
            ],
            "updatedAt": [
                44
            ],
            "__typename": [
                78
            ]
        },
        "NoteActions": {
            "delete": [
                38
            ],
            "update": [
                38
            ],
            "__typename": [
                78
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
                78
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
                78
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
                78
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
                78
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
                78
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
                78
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
                78
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
                78
            ],
            "ids": [
                46
            ],
            "names": [
                78
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
                78
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
                78
            ],
            "period": [
                60
            ],
            "requirements": [
                65
            ],
            "title": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                38
            ],
            "__typename": [
                78
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                41
            ],
            "description": [
                78
            ],
            "enabled": [
                38
            ],
            "key": [
                78
            ],
            "navTitle": [
                78
            ],
            "prompts": [
                66
            ],
            "title": [
                78
            ],
            "type": [
                76
            ],
            "__typename": [
                78
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                41
            ],
            "description": [
                78
            ],
            "key": [
                78
            ],
            "navTitle": [
                78
            ],
            "periodId": [
                78
            ],
            "title": [
                78
            ],
            "__typename": [
                78
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
                78
            ],
            "name": [
                78
            ],
            "openDate": [
                44
            ],
            "__typename": [
                78
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                38
            ],
            "key": [
                78
            ],
            "title": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "Program": {
            "key": [
                46
            ],
            "navTitle": [
                78
            ],
            "title": [
                78
            ],
            "__typename": [
                78
            ]
        },
        "ProgramFilters": {
            "keys": [
                78
            ],
            "__typename": [
                78
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
                        78,
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
                        78,
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
                78
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
                78
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
                        78
                    ]
                }
            ],
            "description": [
                78
            ],
            "fetchedData": [
                51,
                {
                    "schemaVersion": [
                        78
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
                78
            ],
            "key": [
                78
            ],
            "moot": [
                38
            ],
            "navTitle": [
                78
            ],
            "preloadData": [
                51,
                {
                    "schemaVersion": [
                        78
                    ]
                }
            ],
            "requirement": [
                36
            ],
            "title": [
                78
            ],
            "visibility": [
                71
            ],
            "__typename": [
                78
            ]
        },
        "RequirementPromptActions": {
            "update": [
                38
            ],
            "__typename": [
                78
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
                78
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
                78
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
                78
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
                78
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
                78
            ]
        }
    }
}