export default {
    "scalars": [
        28,
        30,
        33,
        35,
        36,
        40,
        41,
        43,
        46,
        47,
        48,
        51,
        66,
        70,
        71,
        73
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
                73
            ]
        },
        "AccessControl": {
            "description": [
                73
            ],
            "name": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                73
            ],
            "name": [
                73
            ],
            "tags": [
                15
            ],
            "title": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessGrantTag": {
            "category": [
                73
            ],
            "categoryLabel": [
                73
            ],
            "label": [
                73
            ],
            "tag": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessRole": {
            "actions": [
                72
            ],
            "description": [
                73
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                43
            ],
            "name": [
                73
            ],
            "scope": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                73
            ],
            "ids": [
                43
            ],
            "names": [
                73
            ],
            "scopes": [
                73
            ],
            "__typename": [
                73
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
                73
            ],
            "id": [
                43
            ],
            "tags": [
                3
            ],
            "__typename": [
                73
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
                73
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                36
            ],
            "controlGroup": [
                73
            ],
            "controls": [
                73
            ],
            "tags": [
                16
            ],
            "__typename": [
                73
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                36
            ],
            "controlGroup": [
                73
            ],
            "controls": [
                73
            ],
            "tags": [
                16
            ],
            "__typename": [
                73
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                40
            ],
            "dateCreated": [
                40
            ],
            "groupName": [
                73
            ],
            "managers": [
                11
            ],
            "roleId": [
                43
            ],
            "__typename": [
                73
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                73
            ],
            "fullname": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessRoleInput": {
            "description": [
                73
            ],
            "groups": [
                73
            ],
            "name": [
                73
            ],
            "scope": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                50
            ],
            "success": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "AccessTag": {
            "label": [
                73
            ],
            "value": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessTagCategory": {
            "category": [
                73
            ],
            "description": [
                73
            ],
            "label": [
                73
            ],
            "listable": [
                36
            ],
            "tags": [
                14
            ],
            "__typename": [
                73
            ]
        },
        "AccessTagInput": {
            "category": [
                73
            ],
            "tag": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessUser": {
            "fullname": [
                73
            ],
            "groups": [
                73
            ],
            "login": [
                43
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                48
            ],
            "roles": [
                4
            ],
            "stillValid": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "AccessUserFilter": {
            "groups": [
                73
            ],
            "logins": [
                43
            ],
            "otherGroupingsByLabel": [
                19
            ],
            "otherIdentifiers": [
                73
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "search": [
                73
            ],
            "self": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "AccessUserGroupingInput": {
            "ids": [
                43
            ],
            "label": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                43
            ],
            "label": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                43
            ],
            "label": [
                73
            ],
            "__typename": [
                73
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
                40
            ],
            "createdAt": [
                40
            ],
            "data": [
                48,
                {
                    "schemaVersion": [
                        73
                    ]
                }
            ],
            "dataVersion": [
                47
            ],
            "id": [
                43
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
                55
            ],
            "prompt": [
                68,
                {
                    "promptId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "status": [
                30
            ],
            "statusReason": [
                73
            ],
            "updatedAt": [
                40
            ],
            "__typename": [
                73
            ]
        },
        "AppRequestActions": {
            "cancel": [
                36
            ],
            "close": [
                36
            ],
            "offer": [
                36
            ],
            "reopen": [
                36
            ],
            "return": [
                36
            ],
            "review": [
                36
            ],
            "submit": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "AppRequestActivity": {
            "action": [
                73
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                40
            ],
            "data": [
                48
            ],
            "description": [
                73
            ],
            "id": [
                43
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                73
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                73
            ],
            "appRequestIds": [
                43
            ],
            "happenedAfter": [
                40
            ],
            "happenedBefore": [
                40
            ],
            "impersonated": [
                36
            ],
            "impersonatedBy": [
                43
            ],
            "impersonatedUsers": [
                43
            ],
            "users": [
                43
            ],
            "__typename": [
                73
            ]
        },
        "AppRequestFilter": {
            "closed": [
                36
            ],
            "closedAfter": [
                40
            ],
            "closedBefore": [
                40
            ],
            "createdAfter": [
                40
            ],
            "createdBefore": [
                40
            ],
            "ids": [
                43
            ],
            "indexes": [
                29
            ],
            "logins": [
                43
            ],
            "own": [
                36
            ],
            "periodIds": [
                43
            ],
            "search": [
                73
            ],
            "status": [
                30
            ],
            "submittedAfter": [
                40
            ],
            "submittedBefore": [
                40
            ],
            "updatedAfter": [
                40
            ],
            "updatedBefore": [
                40
            ],
            "__typename": [
                73
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                41
            ],
            "applicantDashboardPriority": [
                41
            ],
            "category": [
                73
            ],
            "categoryLabel": [
                73
            ],
            "listFiltersPriority": [
                41
            ],
            "listable": [
                36
            ],
            "reviewerDashboardPriority": [
                41
            ],
            "values": [
                45
            ],
            "__typename": [
                73
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                73
            ],
            "tags": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                32
            ],
            "id": [
                43
            ],
            "ineligiblePhase": [
                46
            ],
            "navTitle": [
                73
            ],
            "phase": [
                33
            ],
            "programKey": [
                73
            ],
            "requirements": [
                34
            ],
            "status": [
                35
            ],
            "statusReason": [
                73
            ],
            "title": [
                73
            ],
            "workflowStage": [
                63
            ],
            "__typename": [
                73
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                31
            ],
            "configurationData": [
                48
            ],
            "description": [
                73
            ],
            "id": [
                43
            ],
            "key": [
                73
            ],
            "navTitle": [
                73
            ],
            "prompts": [
                68
            ],
            "smartTitle": [
                73
            ],
            "status": [
                70
            ],
            "statusReason": [
                73
            ],
            "title": [
                73
            ],
            "type": [
                71
            ],
            "workflowStage": [
                63
            ],
            "__typename": [
                73
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                38
            ],
            "data": [
                48
            ],
            "key": [
                73
            ],
            "__typename": [
                73
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
                73
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                43
            ],
            "keys": [
                73
            ],
            "periodCodes": [
                73
            ],
            "periodIds": [
                43
            ],
            "__typename": [
                73
            ]
        },
        "DateTime": {},
        "Float": {},
        "Groupings": {
            "ids": [
                73
            ],
            "label": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                41
            ],
            "applicantDashboardPriority": [
                41
            ],
            "category": [
                73
            ],
            "categoryLabel": [
                73
            ],
            "listFiltersPriority": [
                41
            ],
            "listable": [
                36
            ],
            "reviewerDashboardPriority": [
                41
            ],
            "values": [
                45,
                {
                    "inUse": [
                        36
                    ],
                    "search": [
                        73
                    ]
                }
            ],
            "__typename": [
                73
            ]
        },
        "IndexValue": {
            "label": [
                73
            ],
            "value": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                74,
                {
                    "appRequestId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                74,
                {
                    "content": [
                        73,
                        "String!"
                    ],
                    "internal": [
                        36,
                        "Boolean!"
                    ]
                }
            ],
            "advanceWorkflow": [
                74,
                {
                    "applicationId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                74,
                {
                    "appRequestId": [
                        43,
                        "ID!"
                    ],
                    "dataVersion": [
                        47
                    ]
                }
            ],
            "closeAppRequest": [
                74,
                {
                    "appRequestId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                74,
                {
                    "login": [
                        73,
                        "String!"
                    ],
                    "periodId": [
                        43,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "createPeriod": [
                76,
                {
                    "copyPeriodId": [
                        73
                    ],
                    "period": [
                        62,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "deletePeriod": [
                77,
                {
                    "periodId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                74,
                {
                    "appRequestId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "reopenAppRequest": [
                74,
                {
                    "appRequestId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "returnAppRequest": [
                74,
                {
                    "appRequestId": [
                        43,
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
                        43,
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
                77,
                {
                    "roleId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        43,
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
                        43,
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
                        43,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "submitAppRequest": [
                74,
                {
                    "appRequestId": [
                        43,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                75,
                {
                    "data": [
                        48,
                        "JsonData!"
                    ],
                    "key": [
                        73,
                        "String!"
                    ],
                    "periodId": [
                        43,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "updatePeriod": [
                76,
                {
                    "periodId": [
                        43,
                        "ID!"
                    ],
                    "update": [
                        62,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "updatePeriodRequirement": [
                77,
                {
                    "disabled": [
                        36,
                        "Boolean!"
                    ],
                    "periodId": [
                        73,
                        "String!"
                    ],
                    "requirementKey": [
                        73,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                74,
                {
                    "data": [
                        48,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        47
                    ],
                    "promptId": [
                        43,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "__typename": [
                73
            ]
        },
        "MutationMessage": {
            "arg": [
                73
            ],
            "message": [
                73
            ],
            "type": [
                51
            ],
            "__typename": [
                73
            ]
        },
        "MutationMessageType": {},
        "Pagination": {
            "page": [
                47
            ],
            "perPage": [
                47
            ],
            "__typename": [
                73
            ]
        },
        "PaginationInfoWithTotalItems": {
            "currentPage": [
                41
            ],
            "groupings": [
                42
            ],
            "hasNextPage": [
                36
            ],
            "perPage": [
                41
            ],
            "totalItems": [
                41
            ],
            "__typename": [
                73
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                53
            ],
            "__typename": [
                73
            ]
        },
        "Period": {
            "actions": [
                56
            ],
            "archiveDate": [
                40
            ],
            "closeDate": [
                40
            ],
            "code": [
                73
            ],
            "configurations": [
                37,
                {
                    "filter": [
                        39
                    ]
                }
            ],
            "id": [
                43
            ],
            "name": [
                73
            ],
            "openDate": [
                40
            ],
            "programs": [
                58
            ],
            "prompts": [
                61
            ],
            "requirements": [
                60
            ],
            "reviewed": [
                36
            ],
            "__typename": [
                73
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
                73
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                40
            ],
            "archiveBefore": [
                40
            ],
            "closesAfter": [
                40
            ],
            "closesBefore": [
                40
            ],
            "codes": [
                73
            ],
            "ids": [
                43
            ],
            "names": [
                73
            ],
            "openNow": [
                36
            ],
            "opensAfter": [
                40
            ],
            "opensBefore": [
                40
            ],
            "__typename": [
                73
            ]
        },
        "PeriodProgram": {
            "actions": [
                59
            ],
            "enabled": [
                36
            ],
            "key": [
                43
            ],
            "navTitle": [
                73
            ],
            "period": [
                55
            ],
            "requirements": [
                60
            ],
            "title": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                37
            ],
            "description": [
                73
            ],
            "enabled": [
                36
            ],
            "key": [
                73
            ],
            "navTitle": [
                73
            ],
            "prompts": [
                61
            ],
            "title": [
                73
            ],
            "type": [
                71
            ],
            "__typename": [
                73
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                37
            ],
            "description": [
                73
            ],
            "key": [
                73
            ],
            "navTitle": [
                73
            ],
            "periodId": [
                73
            ],
            "title": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                40
            ],
            "closeDate": [
                40
            ],
            "code": [
                73
            ],
            "name": [
                73
            ],
            "openDate": [
                40
            ],
            "reviewed": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                36
            ],
            "key": [
                73
            ],
            "title": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "Program": {
            "key": [
                43
            ],
            "navTitle": [
                73
            ],
            "title": [
                73
            ],
            "__typename": [
                73
            ]
        },
        "ProgramFilters": {
            "keys": [
                73
            ],
            "__typename": [
                73
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
                        18
                    ],
                    "paged": [
                        52
                    ]
                }
            ],
            "appRequestIndexes": [
                44,
                {
                    "categories": [
                        73,
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
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "pageInfo": [
                54
            ],
            "periods": [
                55,
                {
                    "filter": [
                        57
                    ]
                }
            ],
            "programs": [
                64,
                {
                    "filter": [
                        65
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
                73
            ],
            "__typename": [
                73
            ]
        },
        "RequirementPrompt": {
            "actions": [
                69
            ],
            "answered": [
                36
            ],
            "configurationData": [
                48
            ],
            "configurationRelatedData": [
                48
            ],
            "data": [
                48,
                {
                    "schemaVersion": [
                        73
                    ]
                }
            ],
            "description": [
                73
            ],
            "fetchedData": [
                48,
                {
                    "schemaVersion": [
                        73
                    ]
                }
            ],
            "id": [
                43
            ],
            "invalidated": [
                36
            ],
            "invalidatedReason": [
                73
            ],
            "key": [
                73
            ],
            "moot": [
                36
            ],
            "navTitle": [
                73
            ],
            "preloadData": [
                48,
                {
                    "schemaVersion": [
                        73
                    ]
                }
            ],
            "requirement": [
                34
            ],
            "title": [
                73
            ],
            "visibility": [
                66
            ],
            "__typename": [
                73
            ]
        },
        "RequirementPromptActions": {
            "update": [
                36
            ],
            "__typename": [
                73
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
                73
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                50
            ],
            "success": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                37
            ],
            "messages": [
                50
            ],
            "success": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                50
            ],
            "period": [
                55
            ],
            "success": [
                36
            ],
            "__typename": [
                73
            ]
        },
        "ValidatedResponse": {
            "messages": [
                50
            ],
            "success": [
                36
            ],
            "__typename": [
                73
            ]
        }
    }
}