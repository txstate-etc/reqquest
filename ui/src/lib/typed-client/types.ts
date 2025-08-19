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
        61,
        65,
        66,
        68
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
                68
            ]
        },
        "AccessControl": {
            "description": [
                68
            ],
            "name": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessGrantTag": {
            "category": [
                68
            ],
            "categoryLabel": [
                68
            ],
            "label": [
                68
            ],
            "tag": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessRole": {
            "actions": [
                67
            ],
            "description": [
                68
            ],
            "grants": [
                5
            ],
            "groups": [
                68
            ],
            "id": [
                39
            ],
            "name": [
                68
            ],
            "scope": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                68
            ],
            "ids": [
                39
            ],
            "names": [
                68
            ],
            "scopes": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                6
            ],
            "allow": [
                33
            ],
            "controls": [
                68
            ],
            "id": [
                39
            ],
            "subjectType": [
                11
            ],
            "tags": [
                2
            ],
            "__typename": [
                68
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
                68
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                33
            ],
            "controls": [
                68
            ],
            "subjectType": [
                68
            ],
            "tags": [
                14
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                33
            ],
            "controls": [
                68
            ],
            "subjectType": [
                68
            ],
            "tags": [
                14
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleInput": {
            "description": [
                68
            ],
            "groups": [
                68
            ],
            "name": [
                68
            ],
            "scope": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                46
            ],
            "success": [
                33
            ],
            "__typename": [
                68
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "description": [
                68
            ],
            "name": [
                68
            ],
            "tags": [
                13
            ],
            "title": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessTag": {
            "label": [
                68
            ],
            "value": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessTagCategory": {
            "category": [
                68
            ],
            "description": [
                68
            ],
            "label": [
                68
            ],
            "listable": [
                33
            ],
            "tags": [
                12
            ],
            "__typename": [
                68
            ]
        },
        "AccessTagInput": {
            "category": [
                68
            ],
            "tag": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessUser": {
            "fullname": [
                68
            ],
            "groups": [
                68
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
                3
            ],
            "stillValid": [
                33
            ],
            "__typename": [
                68
            ]
        },
        "AccessUserFilter": {
            "logins": [
                39
            ],
            "otherIdentifiers": [
                68
            ],
            "otherIdentifiersByLabel": [
                18
            ],
            "search": [
                68
            ],
            "self": [
                33
            ],
            "__typename": [
                68
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                39
            ],
            "label": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                39
            ],
            "label": [
                68
            ],
            "__typename": [
                68
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
                        68
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
                63,
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
                68
            ],
            "updatedAt": [
                37
            ],
            "__typename": [
                68
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
                68
            ]
        },
        "AppRequestActivity": {
            "action": [
                68
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
                68
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
                68
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                68
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
                68
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
                68
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
                68
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
                68
            ],
            "categoryLabel": [
                68
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
                68
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                68
            ],
            "tags": [
                68
            ],
            "__typename": [
                68
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
                68
            ],
            "phase": [
                30
            ],
            "programKey": [
                68
            ],
            "requirements": [
                31
            ],
            "status": [
                32
            ],
            "statusReason": [
                68
            ],
            "title": [
                68
            ],
            "workflowStage": [
                56
            ],
            "__typename": [
                68
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                33
            ],
            "__typename": [
                68
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
                68
            ],
            "id": [
                39
            ],
            "key": [
                68
            ],
            "navTitle": [
                68
            ],
            "prompts": [
                63
            ],
            "smartTitle": [
                68
            ],
            "status": [
                65
            ],
            "statusReason": [
                68
            ],
            "title": [
                68
            ],
            "type": [
                66
            ],
            "workflowStage": [
                56
            ],
            "__typename": [
                68
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
                68
            ],
            "__typename": [
                68
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
                68
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                39
            ],
            "keys": [
                68
            ],
            "periodCodes": [
                68
            ],
            "periodIds": [
                39
            ],
            "__typename": [
                68
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
                68
            ],
            "categoryLabel": [
                68
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
                        68
                    ]
                }
            ],
            "__typename": [
                68
            ]
        },
        "IndexValue": {
            "label": [
                68
            ],
            "value": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                69,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                69,
                {
                    "content": [
                        68,
                        "String!"
                    ],
                    "internal": [
                        33,
                        "Boolean!"
                    ]
                }
            ],
            "advanceWorkflow": [
                69,
                {
                    "applicationId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                69,
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
                69,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                69,
                {
                    "login": [
                        68,
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
                71,
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
                72,
                {
                    "periodId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                69,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "reopenAppRequest": [
                69,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "returnAppRequest": [
                69,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "roleAddGrant": [
                10,
                {
                    "grant": [
                        7,
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
                10,
                {
                    "role": [
                        9,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        33
                    ]
                }
            ],
            "roleDelete": [
                72,
                {
                    "roleId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                10,
                {
                    "grantId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "roleUpdate": [
                10,
                {
                    "role": [
                        9,
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
                10,
                {
                    "grant": [
                        8,
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
                69,
                {
                    "appRequestId": [
                        39,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                70,
                {
                    "data": [
                        44,
                        "JsonData!"
                    ],
                    "key": [
                        68,
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
                71,
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
                69,
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
                68
            ]
        },
        "MutationMessage": {
            "arg": [
                68
            ],
            "message": [
                68
            ],
            "type": [
                47
            ],
            "__typename": [
                68
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
                68
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
                68
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
                68
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
                68
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
                68
            ],
            "ids": [
                39
            ],
            "names": [
                68
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
                68
            ]
        },
        "PeriodProgram": {
            "actions": [
                52
            ],
            "enabled": [
                33
            ],
            "group": [
                52
            ],
            "key": [
                39
            ],
            "navTitle": [
                68
            ],
            "period": [
                48
            ],
            "requirements": [
                53
            ],
            "title": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                33
            ],
            "__typename": [
                68
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                34
            ],
            "description": [
                68
            ],
            "enabled": [
                33
            ],
            "key": [
                68
            ],
            "navTitle": [
                68
            ],
            "prompts": [
                54
            ],
            "title": [
                68
            ],
            "type": [
                66
            ],
            "__typename": [
                68
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                34
            ],
            "description": [
                68
            ],
            "key": [
                68
            ],
            "navTitle": [
                68
            ],
            "periodId": [
                68
            ],
            "title": [
                68
            ],
            "__typename": [
                68
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
                68
            ],
            "name": [
                68
            ],
            "openDate": [
                37
            ],
            "reviewed": [
                33
            ],
            "__typename": [
                68
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                33
            ],
            "title": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "Program": {
            "key": [
                39
            ],
            "navTitle": [
                68
            ],
            "title": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "ProgramFilters": {
            "keys": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "ProgramGroup": {
            "key": [
                39
            ],
            "navTitle": [
                68
            ],
            "programs": [
                57,
                {
                    "filter": [
                        58
                    ]
                }
            ],
            "title": [
                68
            ],
            "__typename": [
                68
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                39
            ],
            "__typename": [
                68
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
                        68,
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
            "periods": [
                48,
                {
                    "filter": [
                        50
                    ]
                }
            ],
            "programGroups": [
                59,
                {
                    "filter": [
                        60
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
                3,
                {
                    "filter": [
                        4
                    ]
                }
            ],
            "scopes": [
                68
            ],
            "subjectTypes": [
                11
            ],
            "__typename": [
                68
            ]
        },
        "RequirementPrompt": {
            "actions": [
                64
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
                        68
                    ]
                }
            ],
            "description": [
                68
            ],
            "fetchedData": [
                44,
                {
                    "schemaVersion": [
                        68
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
                68
            ],
            "navTitle": [
                68
            ],
            "preloadData": [
                44,
                {
                    "schemaVersion": [
                        68
                    ]
                }
            ],
            "requirement": [
                31
            ],
            "title": [
                68
            ],
            "visibility": [
                61
            ],
            "__typename": [
                68
            ]
        },
        "RequirementPromptActions": {
            "update": [
                33
            ],
            "__typename": [
                68
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
                68
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
                68
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
                68
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
                68
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
                68
            ]
        }
    }
}