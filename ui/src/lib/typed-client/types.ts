export default {
    "scalars": [
        28,
        31,
        34,
        36,
        37,
        43,
        44,
        45,
        48,
        49,
        50,
        53,
        70,
        74,
        75,
        77
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                37
            ],
            "createAppRequestSelf": [
                37
            ],
            "createPeriod": [
                37
            ],
            "createRole": [
                37
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                37
            ],
            "viewApplicantDashboard": [
                37
            ],
            "viewPeriodManagement": [
                37
            ],
            "viewReviewerInterface": [
                37
            ],
            "viewRoleManagement": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "AccessControl": {
            "description": [
                77
            ],
            "name": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                77
            ],
            "name": [
                77
            ],
            "tags": [
                15
            ],
            "title": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessGrantTag": {
            "category": [
                77
            ],
            "categoryLabel": [
                77
            ],
            "label": [
                77
            ],
            "tag": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessRole": {
            "actions": [
                76
            ],
            "description": [
                77
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                45
            ],
            "name": [
                77
            ],
            "scope": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                77
            ],
            "ids": [
                45
            ],
            "names": [
                77
            ],
            "scopes": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                37
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                77
            ],
            "id": [
                45
            ],
            "tags": [
                3
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                37
            ],
            "update": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                37
            ],
            "controlGroup": [
                77
            ],
            "controls": [
                77
            ],
            "tags": [
                16
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                37
            ],
            "controlGroup": [
                77
            ],
            "controls": [
                77
            ],
            "tags": [
                16
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                43
            ],
            "dateCreated": [
                43
            ],
            "groupName": [
                77
            ],
            "managers": [
                11
            ],
            "roleId": [
                45
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                77
            ],
            "fullname": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleInput": {
            "description": [
                77
            ],
            "groups": [
                77
            ],
            "name": [
                77
            ],
            "scope": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                52
            ],
            "success": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "AccessTag": {
            "label": [
                77
            ],
            "value": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessTagCategory": {
            "category": [
                77
            ],
            "description": [
                77
            ],
            "label": [
                77
            ],
            "listable": [
                37
            ],
            "tags": [
                14
            ],
            "__typename": [
                77
            ]
        },
        "AccessTagInput": {
            "category": [
                77
            ],
            "tag": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessUser": {
            "fullname": [
                77
            ],
            "groups": [
                77
            ],
            "login": [
                45
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                50
            ],
            "roles": [
                4
            ],
            "stillValid": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                45
            ],
            "tags": [
                45
            ],
            "__typename": [
                77
            ]
        },
        "AccessUserFilter": {
            "logins": [
                45
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                77
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                77
            ],
            "search": [
                77
            ],
            "self": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                45
            ],
            "label": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                45
            ],
            "label": [
                77
            ],
            "__typename": [
                77
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
                32
            ],
            "closedAt": [
                43
            ],
            "complete": [
                37
            ],
            "createdAt": [
                43
            ],
            "data": [
                50,
                {
                    "schemaVersion": [
                        77
                    ]
                }
            ],
            "dataVersion": [
                49
            ],
            "id": [
                45
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
                54,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "otherNotes": [
                54,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "period": [
                59
            ],
            "prompt": [
                72,
                {
                    "promptId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "status": [
                31
            ],
            "statusReason": [
                77
            ],
            "updatedAt": [
                43
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                37
            ],
            "cancel": [
                37
            ],
            "close": [
                37
            ],
            "completeRequest": [
                37
            ],
            "completeReview": [
                37
            ],
            "reopen": [
                37
            ],
            "returnToApplicant": [
                37
            ],
            "returnToNonBlocking": [
                37
            ],
            "returnToOffer": [
                37
            ],
            "returnToReview": [
                37
            ],
            "review": [
                37
            ],
            "submit": [
                37
            ],
            "viewAcceptUI": [
                37
            ],
            "viewApplyUI": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestActivity": {
            "action": [
                77
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                43
            ],
            "data": [
                50
            ],
            "description": [
                77
            ],
            "id": [
                45
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                77
            ],
            "appRequestIds": [
                45
            ],
            "happenedAfter": [
                43
            ],
            "happenedBefore": [
                43
            ],
            "impersonated": [
                37
            ],
            "impersonatedBy": [
                45
            ],
            "impersonatedUsers": [
                45
            ],
            "users": [
                45
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestFilter": {
            "closed": [
                37
            ],
            "closedAfter": [
                43
            ],
            "closedBefore": [
                43
            ],
            "createdAfter": [
                43
            ],
            "createdBefore": [
                43
            ],
            "ids": [
                45
            ],
            "indexes": [
                29
            ],
            "logins": [
                45
            ],
            "own": [
                37
            ],
            "periodIds": [
                45
            ],
            "search": [
                77
            ],
            "status": [
                31
            ],
            "submittedAfter": [
                43
            ],
            "submittedBefore": [
                43
            ],
            "updatedAfter": [
                43
            ],
            "updatedBefore": [
                43
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                44
            ],
            "applicantDashboardPriority": [
                44
            ],
            "category": [
                77
            ],
            "categoryLabel": [
                77
            ],
            "listFiltersPriority": [
                44
            ],
            "listable": [
                37
            ],
            "reviewerDashboardPriority": [
                44
            ],
            "values": [
                47
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                77
            ],
            "tags": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                45
            ],
            "applicants": [
                77
            ],
            "ids": [
                45
            ],
            "__typename": [
                77
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                33
            ],
            "id": [
                45
            ],
            "ineligiblePhase": [
                48
            ],
            "navTitle": [
                77
            ],
            "nextWorkflowStage": [
                67
            ],
            "phase": [
                34
            ],
            "previousWorkflowStage": [
                67
            ],
            "programKey": [
                77
            ],
            "requirements": [
                35
            ],
            "status": [
                36
            ],
            "statusReason": [
                77
            ],
            "title": [
                77
            ],
            "workflowStage": [
                67
            ],
            "workflowStages": [
                67
            ],
            "__typename": [
                77
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                37
            ],
            "reverseWorkflow": [
                37
            ],
            "viewAsReviewer": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                32
            ],
            "configurationData": [
                50
            ],
            "description": [
                77
            ],
            "id": [
                45
            ],
            "key": [
                77
            ],
            "navTitle": [
                77
            ],
            "prompts": [
                72
            ],
            "smartTitle": [
                77
            ],
            "status": [
                74
            ],
            "statusReason": [
                77
            ],
            "title": [
                77
            ],
            "type": [
                75
            ],
            "workflowStage": [
                67
            ],
            "__typename": [
                77
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                77
            ],
            "label": [
                77
            ],
            "tags": [
                39
            ],
            "useInFilters": [
                37
            ],
            "useInList": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "CategoryTag": {
            "label": [
                77
            ],
            "tag": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "Configuration": {
            "actions": [
                41
            ],
            "data": [
                50
            ],
            "fetchedData": [
                50
            ],
            "key": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "ConfigurationAccess": {
            "update": [
                37
            ],
            "view": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                45
            ],
            "keys": [
                77
            ],
            "periodCodes": [
                77
            ],
            "periodIds": [
                45
            ],
            "__typename": [
                77
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                44
            ],
            "applicantDashboardPriority": [
                44
            ],
            "category": [
                77
            ],
            "categoryLabel": [
                77
            ],
            "listFiltersPriority": [
                44
            ],
            "listable": [
                37
            ],
            "reviewerDashboardPriority": [
                44
            ],
            "values": [
                47,
                {
                    "inUse": [
                        37
                    ],
                    "search": [
                        77
                    ]
                }
            ],
            "__typename": [
                77
            ]
        },
        "IndexValue": {
            "label": [
                77
            ],
            "value": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                78,
                {
                    "content": [
                        77,
                        "String!"
                    ]
                }
            ],
            "advanceWorkflow": [
                78,
                {
                    "applicationId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ],
                    "dataVersion": [
                        49
                    ]
                }
            ],
            "closeAppRequest": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                78,
                {
                    "login": [
                        77,
                        "String!"
                    ],
                    "periodId": [
                        45,
                        "ID!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "createPeriod": [
                80,
                {
                    "copyPeriodId": [
                        77
                    ],
                    "period": [
                        66,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "deleteNote": [
                37,
                {
                    "noteId": [
                        77,
                        "String!"
                    ]
                }
            ],
            "deletePeriod": [
                81,
                {
                    "periodId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                80,
                {
                    "periodId": [
                        45,
                        "ID!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "reopenAppRequest": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "returnToApplicant": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                78,
                {
                    "applicationId": [
                        45,
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
                        45,
                        "ID!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        45
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "roleDelete": [
                81,
                {
                    "roleId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        45,
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
                        45,
                        "ID!"
                    ],
                    "validateOnly": [
                        37
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
                        45,
                        "ID!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "submitAppRequest": [
                78,
                {
                    "appRequestId": [
                        45,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                79,
                {
                    "data": [
                        50,
                        "JsonData!"
                    ],
                    "key": [
                        77,
                        "String!"
                    ],
                    "periodId": [
                        45,
                        "ID!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "updateNote": [
                54,
                {
                    "content": [
                        77,
                        "String!"
                    ],
                    "noteId": [
                        77,
                        "String!"
                    ]
                }
            ],
            "updatePeriod": [
                80,
                {
                    "periodId": [
                        45,
                        "ID!"
                    ],
                    "update": [
                        66,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "updatePeriodRequirement": [
                81,
                {
                    "disabled": [
                        37,
                        "Boolean!"
                    ],
                    "periodId": [
                        77,
                        "String!"
                    ],
                    "requirementKey": [
                        77,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                78,
                {
                    "data": [
                        50,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        49
                    ],
                    "promptId": [
                        45,
                        "ID!"
                    ],
                    "validateOnly": [
                        37
                    ]
                }
            ],
            "__typename": [
                77
            ]
        },
        "MutationMessage": {
            "arg": [
                77
            ],
            "message": [
                77
            ],
            "type": [
                53
            ],
            "__typename": [
                77
            ]
        },
        "MutationMessageType": {},
        "Note": {
            "actions": [
                55
            ],
            "appRequest": [
                22
            ],
            "author": [
                17
            ],
            "content": [
                77
            ],
            "createdAt": [
                43
            ],
            "id": [
                45
            ],
            "updatedAt": [
                43
            ],
            "__typename": [
                77
            ]
        },
        "NoteActions": {
            "delete": [
                37
            ],
            "update": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "Pagination": {
            "page": [
                49
            ],
            "perPage": [
                49
            ],
            "__typename": [
                77
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                38
            ],
            "currentPage": [
                44
            ],
            "hasNextPage": [
                37
            ],
            "perPage": [
                44
            ],
            "totalItems": [
                44
            ],
            "__typename": [
                77
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                57
            ],
            "appRequests": [
                57
            ],
            "appRequestsActivity": [
                57
            ],
            "__typename": [
                77
            ]
        },
        "Period": {
            "actions": [
                60
            ],
            "archiveDate": [
                43
            ],
            "closeDate": [
                43
            ],
            "code": [
                77
            ],
            "configurations": [
                40,
                {
                    "filter": [
                        42
                    ]
                }
            ],
            "id": [
                45
            ],
            "name": [
                77
            ],
            "openDate": [
                43
            ],
            "programs": [
                62
            ],
            "prompts": [
                65
            ],
            "requirements": [
                64
            ],
            "reviewed": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                37
            ],
            "delete": [
                37
            ],
            "update": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                43
            ],
            "archiveBefore": [
                43
            ],
            "closesAfter": [
                43
            ],
            "closesBefore": [
                43
            ],
            "codes": [
                77
            ],
            "ids": [
                45
            ],
            "names": [
                77
            ],
            "openNow": [
                37
            ],
            "opensAfter": [
                43
            ],
            "opensBefore": [
                43
            ],
            "__typename": [
                77
            ]
        },
        "PeriodProgram": {
            "actions": [
                63
            ],
            "enabled": [
                37
            ],
            "key": [
                45
            ],
            "navTitle": [
                77
            ],
            "period": [
                59
            ],
            "requirements": [
                64
            ],
            "title": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                40
            ],
            "description": [
                77
            ],
            "enabled": [
                37
            ],
            "key": [
                77
            ],
            "navTitle": [
                77
            ],
            "prompts": [
                65
            ],
            "title": [
                77
            ],
            "type": [
                75
            ],
            "__typename": [
                77
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                40
            ],
            "description": [
                77
            ],
            "key": [
                77
            ],
            "navTitle": [
                77
            ],
            "periodId": [
                77
            ],
            "title": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                43
            ],
            "closeDate": [
                43
            ],
            "code": [
                77
            ],
            "name": [
                77
            ],
            "openDate": [
                43
            ],
            "__typename": [
                77
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                37
            ],
            "key": [
                77
            ],
            "title": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "Program": {
            "key": [
                45
            ],
            "navTitle": [
                77
            ],
            "title": [
                77
            ],
            "__typename": [
                77
            ]
        },
        "ProgramFilters": {
            "keys": [
                77
            ],
            "__typename": [
                77
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
                        56
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
                        77,
                        "String!"
                    ],
                    "paged": [
                        56
                    ]
                }
            ],
            "appRequestIndexes": [
                46,
                {
                    "categories": [
                        77,
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
                        56
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "pageInfo": [
                58
            ],
            "periods": [
                59,
                {
                    "filter": [
                        61
                    ]
                }
            ],
            "programs": [
                68,
                {
                    "filter": [
                        69
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
                77
            ],
            "userIndexes": [
                46,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "__typename": [
                77
            ]
        },
        "RequirementPrompt": {
            "actions": [
                73
            ],
            "answered": [
                37
            ],
            "configurationData": [
                50
            ],
            "data": [
                50,
                {
                    "schemaVersion": [
                        77
                    ]
                }
            ],
            "description": [
                77
            ],
            "fetchedData": [
                50,
                {
                    "schemaVersion": [
                        77
                    ]
                }
            ],
            "gatheredConfigData": [
                50
            ],
            "id": [
                45
            ],
            "invalidated": [
                37
            ],
            "invalidatedReason": [
                77
            ],
            "key": [
                77
            ],
            "moot": [
                37
            ],
            "navTitle": [
                77
            ],
            "preloadData": [
                50,
                {
                    "schemaVersion": [
                        77
                    ]
                }
            ],
            "requirement": [
                35
            ],
            "title": [
                77
            ],
            "visibility": [
                70
            ],
            "__typename": [
                77
            ]
        },
        "RequirementPromptActions": {
            "update": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                37
            ],
            "update": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                52
            ],
            "success": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                40
            ],
            "messages": [
                52
            ],
            "success": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                52
            ],
            "period": [
                59
            ],
            "success": [
                37
            ],
            "__typename": [
                77
            ]
        },
        "ValidatedResponse": {
            "messages": [
                52
            ],
            "success": [
                37
            ],
            "__typename": [
                77
            ]
        }
    }
}