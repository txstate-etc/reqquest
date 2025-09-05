export default {
    "scalars": [
        25,
        27,
        30,
        32,
        33,
        37,
        38,
        39,
        42,
        43,
        44,
        47,
        59,
        63,
        64,
        66
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                33
            ],
            "createAppRequestSelf": [
                33
            ],
            "createPeriod": [
                33
            ],
            "createRole": [
                33
            ],
            "user": [
                15
            ],
            "viewAppRequestList": [
                33
            ],
            "viewApplicantDashboard": [
                33
            ],
            "viewPeriodManagement": [
                33
            ],
            "viewReviewerInterface": [
                33
            ],
            "viewRoleManagement": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "AccessControl": {
            "description": [
                66
            ],
            "name": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                66
            ],
            "name": [
                66
            ],
            "tags": [
                13
            ],
            "title": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessGrantTag": {
            "category": [
                66
            ],
            "categoryLabel": [
                66
            ],
            "label": [
                66
            ],
            "tag": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessRole": {
            "actions": [
                65
            ],
            "description": [
                66
            ],
            "grants": [
                6
            ],
            "groups": [
                66
            ],
            "id": [
                39
            ],
            "name": [
                66
            ],
            "scope": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                66
            ],
            "ids": [
                39
            ],
            "names": [
                66
            ],
            "scopes": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                33
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                66
            ],
            "id": [
                39
            ],
            "tags": [
                3
            ],
            "__typename": [
                66
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                33
            ],
            "update": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                33
            ],
            "controlGroup": [
                66
            ],
            "controls": [
                66
            ],
            "tags": [
                14
            ],
            "__typename": [
                66
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                33
            ],
            "controlGroup": [
                66
            ],
            "controls": [
                66
            ],
            "tags": [
                14
            ],
            "__typename": [
                66
            ]
        },
        "AccessRoleInput": {
            "description": [
                66
            ],
            "groups": [
                66
            ],
            "name": [
                66
            ],
            "scope": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                46
            ],
            "success": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "AccessTag": {
            "label": [
                66
            ],
            "value": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessTagCategory": {
            "category": [
                66
            ],
            "description": [
                66
            ],
            "label": [
                66
            ],
            "listable": [
                33
            ],
            "tags": [
                12
            ],
            "__typename": [
                66
            ]
        },
        "AccessTagInput": {
            "category": [
                66
            ],
            "tag": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessUser": {
            "fullname": [
                66
            ],
            "groups": [
                66
            ],
            "login": [
                39
            ],
            "otherIdentifiers": [
                17
            ],
            "otherInfo": [
                44
            ],
            "roles": [
                4
            ],
            "stillValid": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "AccessUserFilter": {
            "logins": [
                39
            ],
            "otherIdentifiers": [
                66
            ],
            "otherIdentifiersByLabel": [
                18
            ],
            "search": [
                66
            ],
            "self": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                39
            ],
            "label": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                39
            ],
            "label": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AppRequest": {
            "actions": [
                20
            ],
            "activity": [
                21,
                {
                    "filters": [
                        22
                    ]
                }
            ],
            "applicant": [
                15
            ],
            "applications": [
                28
            ],
            "closedAt": [
                37
            ],
            "createdAt": [
                37
            ],
            "data": [
                44,
                {
                    "schemaVersion": [
                        66
                    ]
                }
            ],
            "dataVersion": [
                43
            ],
            "id": [
                39
            ],
            "indexCategories": [
                24,
                {
                    "for": [
                        25
                    ]
                }
            ],
            "period": [
                48
            ],
            "prompt": [
                61,
                {
                    "promptId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "status": [
                27
            ],
            "statusReason": [
                66
            ],
            "updatedAt": [
                37
            ],
            "__typename": [
                66
            ]
        },
        "AppRequestActions": {
            "cancel": [
                33
            ],
            "close": [
                33
            ],
            "offer": [
                33
            ],
            "reopen": [
                33
            ],
            "return": [
                33
            ],
            "review": [
                33
            ],
            "submit": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "AppRequestActivity": {
            "action": [
                66
            ],
            "appRequest": [
                19
            ],
            "createdAt": [
                37
            ],
            "data": [
                44
            ],
            "description": [
                66
            ],
            "id": [
                39
            ],
            "impersonatedBy": [
                15
            ],
            "user": [
                15
            ],
            "__typename": [
                66
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                66
            ],
            "appRequestIds": [
                39
            ],
            "happenedAfter": [
                37
            ],
            "happenedBefore": [
                37
            ],
            "impersonated": [
                33
            ],
            "impersonatedBy": [
                39
            ],
            "impersonatedUsers": [
                39
            ],
            "users": [
                39
            ],
            "__typename": [
                66
            ]
        },
        "AppRequestFilter": {
            "closed": [
                33
            ],
            "closedAfter": [
                37
            ],
            "closedBefore": [
                37
            ],
            "createdAfter": [
                37
            ],
            "createdBefore": [
                37
            ],
            "ids": [
                39
            ],
            "indexes": [
                26
            ],
            "logins": [
                39
            ],
            "own": [
                33
            ],
            "periodIds": [
                39
            ],
            "search": [
                66
            ],
            "status": [
                27
            ],
            "submittedAfter": [
                37
            ],
            "submittedBefore": [
                37
            ],
            "updatedAfter": [
                37
            ],
            "updatedBefore": [
                37
            ],
            "__typename": [
                66
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                38
            ],
            "applicantDashboardPriority": [
                38
            ],
            "category": [
                66
            ],
            "categoryLabel": [
                66
            ],
            "listFiltersPriority": [
                38
            ],
            "listable": [
                33
            ],
            "reviewerDashboardPriority": [
                38
            ],
            "values": [
                41
            ],
            "__typename": [
                66
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                66
            ],
            "tags": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                29
            ],
            "id": [
                39
            ],
            "ineligiblePhase": [
                42
            ],
            "navTitle": [
                66
            ],
            "phase": [
                30
            ],
            "programKey": [
                66
            ],
            "requirements": [
                31
            ],
            "status": [
                32
            ],
            "statusReason": [
                66
            ],
            "title": [
                66
            ],
            "workflowStage": [
                56
            ],
            "__typename": [
                66
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                28
            ],
            "configurationData": [
                44
            ],
            "description": [
                66
            ],
            "id": [
                39
            ],
            "key": [
                66
            ],
            "navTitle": [
                66
            ],
            "prompts": [
                61
            ],
            "smartTitle": [
                66
            ],
            "status": [
                63
            ],
            "statusReason": [
                66
            ],
            "title": [
                66
            ],
            "type": [
                64
            ],
            "workflowStage": [
                56
            ],
            "__typename": [
                66
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                35
            ],
            "data": [
                44
            ],
            "key": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "ConfigurationAccess": {
            "update": [
                33
            ],
            "view": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                39
            ],
            "keys": [
                66
            ],
            "periodCodes": [
                66
            ],
            "periodIds": [
                39
            ],
            "__typename": [
                66
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                38
            ],
            "applicantDashboardPriority": [
                38
            ],
            "category": [
                66
            ],
            "categoryLabel": [
                66
            ],
            "listFiltersPriority": [
                38
            ],
            "listable": [
                33
            ],
            "reviewerDashboardPriority": [
                38
            ],
            "values": [
                41,
                {
                    "inUse": [
                        33
                    ],
                    "search": [
                        66
                    ]
                }
            ],
            "__typename": [
                66
            ]
        },
        "IndexValue": {
            "label": [
                66
            ],
            "value": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                67,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                67,
                {
                    "content": [
                        66,
                        "String!"
                    ],
                    "internal": [
                        33,
                        "Boolean!"
                    ]
                }
            ],
            "advanceWorkflow": [
                67,
                {
                    "applicationId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                67,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ],
                    "dataVersion": [
                        43
                    ]
                }
            ],
            "closeAppRequest": [
                67,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                67,
                {
                    "login": [
                        66,
                        "String!"
                    ],
                    "periodId": [
                        39,
                        "ID!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "createPeriod": [
                69,
                {
                    "period": [
                        55,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "deletePeriod": [
                70,
                {
                    "periodId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                67,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "reopenAppRequest": [
                67,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "returnAppRequest": [
                67,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "roleAddGrant": [
                11,
                {
                    "grant": [
                        8,
                        "AccessRoleGrantCreate!"
                    ],
                    "roleId": [
                        39,
                        "ID!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "roleCreate": [
                11,
                {
                    "role": [
                        10,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "roleDelete": [
                70,
                {
                    "roleId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                11,
                {
                    "grantId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "roleUpdate": [
                11,
                {
                    "role": [
                        10,
                        "AccessRoleInput!"
                    ],
                    "roleId": [
                        39,
                        "ID!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "roleUpdateGrant": [
                11,
                {
                    "grant": [
                        9,
                        "AccessRoleGrantUpdate!"
                    ],
                    "grantId": [
                        39,
                        "ID!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "submitAppRequest": [
                67,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                68,
                {
                    "data": [
                        44,
                        "JsonData!"
                    ],
                    "key": [
                        66,
                        "String!"
                    ],
                    "periodId": [
                        39,
                        "ID!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "updatePeriod": [
                69,
                {
                    "periodId": [
                        39,
                        "ID!"
                    ],
                    "update": [
                        55,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "updatePrompt": [
                67,
                {
                    "data": [
                        44,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        43
                    ],
                    "promptId": [
                        39,
                        "ID!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "__typename": [
                66
            ]
        },
        "MutationMessage": {
            "arg": [
                66
            ],
            "message": [
                66
            ],
            "type": [
                47
            ],
            "__typename": [
                66
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                49
            ],
            "archiveDate": [
                37
            ],
            "closeDate": [
                37
            ],
            "code": [
                66
            ],
            "configurations": [
                34,
                {
                    "filter": [
                        36
                    ]
                }
            ],
            "id": [
                39
            ],
            "name": [
                66
            ],
            "openDate": [
                37
            ],
            "programs": [
                51
            ],
            "prompts": [
                54
            ],
            "requirements": [
                53
            ],
            "reviewed": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                33
            ],
            "delete": [
                33
            ],
            "update": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                37
            ],
            "archiveBefore": [
                37
            ],
            "closesAfter": [
                37
            ],
            "closesBefore": [
                37
            ],
            "codes": [
                66
            ],
            "ids": [
                39
            ],
            "names": [
                66
            ],
            "openNow": [
                33
            ],
            "opensAfter": [
                37
            ],
            "opensBefore": [
                37
            ],
            "__typename": [
                66
            ]
        },
        "PeriodProgram": {
            "actions": [
                52
            ],
            "enabled": [
                33
            ],
            "key": [
                39
            ],
            "navTitle": [
                66
            ],
            "period": [
                48
            ],
            "requirements": [
                53
            ],
            "title": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                34
            ],
            "description": [
                66
            ],
            "enabled": [
                33
            ],
            "key": [
                66
            ],
            "navTitle": [
                66
            ],
            "prompts": [
                54
            ],
            "title": [
                66
            ],
            "type": [
                64
            ],
            "__typename": [
                66
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                34
            ],
            "description": [
                66
            ],
            "key": [
                66
            ],
            "navTitle": [
                66
            ],
            "periodId": [
                66
            ],
            "title": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                37
            ],
            "closeDate": [
                37
            ],
            "code": [
                66
            ],
            "name": [
                66
            ],
            "openDate": [
                37
            ],
            "reviewed": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                33
            ],
            "title": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "Program": {
            "key": [
                39
            ],
            "navTitle": [
                66
            ],
            "title": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "ProgramFilters": {
            "keys": [
                66
            ],
            "__typename": [
                66
            ]
        },
        "PromptVisibility": {},
        "Query": {
            "access": [
                0
            ],
            "accessUsers": [
                15,
                {
                    "filter": [
                        16
                    ]
                }
            ],
            "appRequestIndexes": [
                40,
                {
                    "categories": [
                        66,
                        "[String!]"
                    ],
                    "for": [
                        25
                    ]
                }
            ],
            "appRequests": [
                19,
                {
                    "filter": [
                        23
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "periods": [
                48,
                {
                    "filter": [
                        50
                    ]
                }
            ],
            "programs": [
                57,
                {
                    "filter": [
                        58
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
                66
            ],
            "__typename": [
                66
            ]
        },
        "RequirementPrompt": {
            "actions": [
                62
            ],
            "answered": [
                33
            ],
            "configurationData": [
                44
            ],
            "configurationRelatedData": [
                44
            ],
            "data": [
                44,
                {
                    "schemaVersion": [
                        66
                    ]
                }
            ],
            "description": [
                66
            ],
            "fetchedData": [
                44,
                {
                    "schemaVersion": [
                        66
                    ]
                }
            ],
            "id": [
                39
            ],
            "invalidated": [
                33
            ],
            "key": [
                66
            ],
            "navTitle": [
                66
            ],
            "preloadData": [
                44,
                {
                    "schemaVersion": [
                        66
                    ]
                }
            ],
            "requirement": [
                31
            ],
            "title": [
                66
            ],
            "visibility": [
                59
            ],
            "__typename": [
                66
            ]
        },
        "RequirementPromptActions": {
            "update": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                33
            ],
            "update": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                19
            ],
            "messages": [
                46
            ],
            "success": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                34
            ],
            "messages": [
                46
            ],
            "success": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                46
            ],
            "period": [
                48
            ],
            "success": [
                33
            ],
            "__typename": [
                66
            ]
        },
        "ValidatedResponse": {
            "messages": [
                46
            ],
            "success": [
                33
            ],
            "__typename": [
                66
            ]
        }
    }
}