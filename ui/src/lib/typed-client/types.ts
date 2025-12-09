export default {
    "scalars": [
        28,
        30,
        33,
        35,
        36,
        42,
        43,
        44,
        47,
        48,
        49,
        52,
        67,
        71,
        72,
        74
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                36
            ],
            "createAppRequestSelf": [
                36
            ],
            "createPeriod": [
                36
            ],
            "createRole": [
                36
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                36
            ],
            "viewApplicantDashboard": [
                36
            ],
            "viewPeriodManagement": [
                36
            ],
            "viewReviewerInterface": [
                36
            ],
            "viewRoleManagement": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "AccessControl": {
            "description": [
                74
            ],
            "name": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                74
            ],
            "name": [
                74
            ],
            "tags": [
                15
            ],
            "title": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessGrantTag": {
            "category": [
                74
            ],
            "categoryLabel": [
                74
            ],
            "label": [
                74
            ],
            "tag": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessRole": {
            "actions": [
                73
            ],
            "description": [
                74
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                44
            ],
            "name": [
                74
            ],
            "scope": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                74
            ],
            "ids": [
                44
            ],
            "names": [
                74
            ],
            "scopes": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                36
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                74
            ],
            "id": [
                44
            ],
            "tags": [
                3
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                36
            ],
            "update": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                36
            ],
            "controlGroup": [
                74
            ],
            "controls": [
                74
            ],
            "tags": [
                16
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                36
            ],
            "controlGroup": [
                74
            ],
            "controls": [
                74
            ],
            "tags": [
                16
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                42
            ],
            "dateCreated": [
                42
            ],
            "groupName": [
                74
            ],
            "managers": [
                11
            ],
            "roleId": [
                44
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                74
            ],
            "fullname": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleInput": {
            "description": [
                74
            ],
            "groups": [
                74
            ],
            "name": [
                74
            ],
            "scope": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                51
            ],
            "success": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "AccessTag": {
            "label": [
                74
            ],
            "value": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessTagCategory": {
            "category": [
                74
            ],
            "description": [
                74
            ],
            "label": [
                74
            ],
            "listable": [
                36
            ],
            "tags": [
                14
            ],
            "__typename": [
                74
            ]
        },
        "AccessTagInput": {
            "category": [
                74
            ],
            "tag": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessUser": {
            "fullname": [
                74
            ],
            "groups": [
                74
            ],
            "login": [
                44
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                49
            ],
            "roles": [
                4
            ],
            "stillValid": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                44
            ],
            "tags": [
                44
            ],
            "__typename": [
                74
            ]
        },
        "AccessUserFilter": {
            "logins": [
                44
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                74
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                74
            ],
            "search": [
                74
            ],
            "self": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                44
            ],
            "label": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                44
            ],
            "label": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AppRequest": {
            "actions": [
                23
            ],
            "activity": [
                24,
                {
                    "filters": [
                        25
                    ]
                }
            ],
            "applicant": [
                17
            ],
            "applications": [
                31
            ],
            "closedAt": [
                42
            ],
            "complete": [
                36
            ],
            "createdAt": [
                42
            ],
            "data": [
                49,
                {
                    "schemaVersion": [
                        74
                    ]
                }
            ],
            "dataVersion": [
                48
            ],
            "id": [
                44
            ],
            "indexCategories": [
                27,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "period": [
                56
            ],
            "prompt": [
                69,
                {
                    "promptId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "status": [
                30
            ],
            "statusReason": [
                74
            ],
            "updatedAt": [
                42
            ],
            "__typename": [
                74
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                36
            ],
            "cancel": [
                36
            ],
            "close": [
                36
            ],
            "completeRequest": [
                36
            ],
            "completeReview": [
                36
            ],
            "reopen": [
                36
            ],
            "returnToApplicant": [
                36
            ],
            "returnToNonBlocking": [
                36
            ],
            "returnToOffer": [
                36
            ],
            "returnToReview": [
                36
            ],
            "review": [
                36
            ],
            "submit": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "AppRequestActivity": {
            "action": [
                74
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                42
            ],
            "data": [
                49
            ],
            "description": [
                74
            ],
            "id": [
                44
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                74
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                74
            ],
            "appRequestIds": [
                44
            ],
            "happenedAfter": [
                42
            ],
            "happenedBefore": [
                42
            ],
            "impersonated": [
                36
            ],
            "impersonatedBy": [
                44
            ],
            "impersonatedUsers": [
                44
            ],
            "users": [
                44
            ],
            "__typename": [
                74
            ]
        },
        "AppRequestFilter": {
            "closed": [
                36
            ],
            "closedAfter": [
                42
            ],
            "closedBefore": [
                42
            ],
            "createdAfter": [
                42
            ],
            "createdBefore": [
                42
            ],
            "ids": [
                44
            ],
            "indexes": [
                29
            ],
            "logins": [
                44
            ],
            "own": [
                36
            ],
            "periodIds": [
                44
            ],
            "search": [
                74
            ],
            "status": [
                30
            ],
            "submittedAfter": [
                42
            ],
            "submittedBefore": [
                42
            ],
            "updatedAfter": [
                42
            ],
            "updatedBefore": [
                42
            ],
            "__typename": [
                74
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                43
            ],
            "applicantDashboardPriority": [
                43
            ],
            "category": [
                74
            ],
            "categoryLabel": [
                74
            ],
            "listFiltersPriority": [
                43
            ],
            "listable": [
                36
            ],
            "reviewerDashboardPriority": [
                43
            ],
            "values": [
                46
            ],
            "__typename": [
                74
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                74
            ],
            "tags": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                32
            ],
            "id": [
                44
            ],
            "ineligiblePhase": [
                47
            ],
            "navTitle": [
                74
            ],
            "nextWorkflowStage": [
                64
            ],
            "phase": [
                33
            ],
            "previousWorkflowStage": [
                64
            ],
            "programKey": [
                74
            ],
            "requirements": [
                34
            ],
            "status": [
                35
            ],
            "statusReason": [
                74
            ],
            "title": [
                74
            ],
            "workflowStage": [
                64
            ],
            "workflowStages": [
                64
            ],
            "__typename": [
                74
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                36
            ],
            "reverseWorkflow": [
                36
            ],
            "viewAsReviewer": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                31
            ],
            "configurationData": [
                49
            ],
            "description": [
                74
            ],
            "id": [
                44
            ],
            "key": [
                74
            ],
            "navTitle": [
                74
            ],
            "prompts": [
                69
            ],
            "smartTitle": [
                74
            ],
            "status": [
                71
            ],
            "statusReason": [
                74
            ],
            "title": [
                74
            ],
            "type": [
                72
            ],
            "workflowStage": [
                64
            ],
            "__typename": [
                74
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                74
            ],
            "label": [
                74
            ],
            "tags": [
                38
            ],
            "useInFilters": [
                36
            ],
            "useInList": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "CategoryTag": {
            "label": [
                74
            ],
            "tag": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "Configuration": {
            "actions": [
                40
            ],
            "data": [
                49
            ],
            "fetchedData": [
                49
            ],
            "key": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "ConfigurationAccess": {
            "update": [
                36
            ],
            "view": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                44
            ],
            "keys": [
                74
            ],
            "periodCodes": [
                74
            ],
            "periodIds": [
                44
            ],
            "__typename": [
                74
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                43
            ],
            "applicantDashboardPriority": [
                43
            ],
            "category": [
                74
            ],
            "categoryLabel": [
                74
            ],
            "listFiltersPriority": [
                43
            ],
            "listable": [
                36
            ],
            "reviewerDashboardPriority": [
                43
            ],
            "values": [
                46,
                {
                    "inUse": [
                        36
                    ],
                    "search": [
                        74
                    ]
                }
            ],
            "__typename": [
                74
            ]
        },
        "IndexValue": {
            "label": [
                74
            ],
            "value": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                75,
                {
                    "content": [
                        74,
                        "String!"
                    ],
                    "internal": [
                        36,
                        "Boolean!"
                    ]
                }
            ],
            "advanceWorkflow": [
                75,
                {
                    "applicationId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ],
                    "dataVersion": [
                        48
                    ]
                }
            ],
            "closeAppRequest": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                75,
                {
                    "login": [
                        74,
                        "String!"
                    ],
                    "periodId": [
                        44,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "createPeriod": [
                77,
                {
                    "copyPeriodId": [
                        74
                    ],
                    "period": [
                        63,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "deletePeriod": [
                78,
                {
                    "periodId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                77,
                {
                    "periodId": [
                        44,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "reopenAppRequest": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "returnToApplicant": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                75,
                {
                    "applicationId": [
                        44,
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
                        44,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        44
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "roleDelete": [
                78,
                {
                    "roleId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        44,
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
                        44,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
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
                        44,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "submitAppRequest": [
                75,
                {
                    "appRequestId": [
                        44,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                76,
                {
                    "data": [
                        49,
                        "JsonData!"
                    ],
                    "key": [
                        74,
                        "String!"
                    ],
                    "periodId": [
                        44,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "updatePeriod": [
                77,
                {
                    "periodId": [
                        44,
                        "ID!"
                    ],
                    "update": [
                        63,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "updatePeriodRequirement": [
                78,
                {
                    "disabled": [
                        36,
                        "Boolean!"
                    ],
                    "periodId": [
                        74,
                        "String!"
                    ],
                    "requirementKey": [
                        74,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                75,
                {
                    "data": [
                        49,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        48
                    ],
                    "promptId": [
                        44,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "__typename": [
                74
            ]
        },
        "MutationMessage": {
            "arg": [
                74
            ],
            "message": [
                74
            ],
            "type": [
                52
            ],
            "__typename": [
                74
            ]
        },
        "MutationMessageType": {},
        "Pagination": {
            "page": [
                48
            ],
            "perPage": [
                48
            ],
            "__typename": [
                74
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                37
            ],
            "currentPage": [
                43
            ],
            "hasNextPage": [
                36
            ],
            "perPage": [
                43
            ],
            "totalItems": [
                43
            ],
            "__typename": [
                74
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                54
            ],
            "appRequests": [
                54
            ],
            "__typename": [
                74
            ]
        },
        "Period": {
            "actions": [
                57
            ],
            "archiveDate": [
                42
            ],
            "closeDate": [
                42
            ],
            "code": [
                74
            ],
            "configurations": [
                39,
                {
                    "filter": [
                        41
                    ]
                }
            ],
            "id": [
                44
            ],
            "name": [
                74
            ],
            "openDate": [
                42
            ],
            "programs": [
                59
            ],
            "prompts": [
                62
            ],
            "requirements": [
                61
            ],
            "reviewed": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                36
            ],
            "delete": [
                36
            ],
            "update": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                42
            ],
            "archiveBefore": [
                42
            ],
            "closesAfter": [
                42
            ],
            "closesBefore": [
                42
            ],
            "codes": [
                74
            ],
            "ids": [
                44
            ],
            "names": [
                74
            ],
            "openNow": [
                36
            ],
            "opensAfter": [
                42
            ],
            "opensBefore": [
                42
            ],
            "__typename": [
                74
            ]
        },
        "PeriodProgram": {
            "actions": [
                60
            ],
            "enabled": [
                36
            ],
            "key": [
                44
            ],
            "navTitle": [
                74
            ],
            "period": [
                56
            ],
            "requirements": [
                61
            ],
            "title": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                39
            ],
            "description": [
                74
            ],
            "enabled": [
                36
            ],
            "key": [
                74
            ],
            "navTitle": [
                74
            ],
            "prompts": [
                62
            ],
            "title": [
                74
            ],
            "type": [
                72
            ],
            "__typename": [
                74
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                39
            ],
            "description": [
                74
            ],
            "key": [
                74
            ],
            "navTitle": [
                74
            ],
            "periodId": [
                74
            ],
            "title": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                42
            ],
            "closeDate": [
                42
            ],
            "code": [
                74
            ],
            "name": [
                74
            ],
            "openDate": [
                42
            ],
            "__typename": [
                74
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                36
            ],
            "key": [
                74
            ],
            "title": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "Program": {
            "key": [
                44
            ],
            "navTitle": [
                74
            ],
            "title": [
                74
            ],
            "__typename": [
                74
            ]
        },
        "ProgramFilters": {
            "keys": [
                74
            ],
            "__typename": [
                74
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
                        53
                    ]
                }
            ],
            "appRequestIndexes": [
                45,
                {
                    "categories": [
                        74,
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
                        53
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "pageInfo": [
                55
            ],
            "periods": [
                56,
                {
                    "filter": [
                        58
                    ]
                }
            ],
            "programs": [
                65,
                {
                    "filter": [
                        66
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
                74
            ],
            "__typename": [
                74
            ]
        },
        "RequirementPrompt": {
            "actions": [
                70
            ],
            "answered": [
                36
            ],
            "configurationData": [
                49
            ],
            "data": [
                49,
                {
                    "schemaVersion": [
                        74
                    ]
                }
            ],
            "description": [
                74
            ],
            "fetchedData": [
                49,
                {
                    "schemaVersion": [
                        74
                    ]
                }
            ],
            "gatheredConfigData": [
                49
            ],
            "id": [
                44
            ],
            "invalidated": [
                36
            ],
            "invalidatedReason": [
                74
            ],
            "key": [
                74
            ],
            "moot": [
                36
            ],
            "navTitle": [
                74
            ],
            "preloadData": [
                49,
                {
                    "schemaVersion": [
                        74
                    ]
                }
            ],
            "requirement": [
                34
            ],
            "title": [
                74
            ],
            "visibility": [
                67
            ],
            "__typename": [
                74
            ]
        },
        "RequirementPromptActions": {
            "update": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                36
            ],
            "update": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                51
            ],
            "success": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                39
            ],
            "messages": [
                51
            ],
            "success": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                51
            ],
            "period": [
                56
            ],
            "success": [
                36
            ],
            "__typename": [
                74
            ]
        },
        "ValidatedResponse": {
            "messages": [
                51
            ],
            "success": [
                36
            ],
            "__typename": [
                74
            ]
        }
    }
}