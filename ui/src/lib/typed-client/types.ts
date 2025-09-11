export default {
    "scalars": [
        26,
        28,
        31,
        33,
        34,
        38,
        39,
        40,
        43,
        44,
        45,
        48,
        60,
        64,
        65,
        67
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                34
            ],
            "createAppRequestSelf": [
                34
            ],
            "createPeriod": [
                34
            ],
            "createRole": [
                34
            ],
            "user": [
                16
            ],
            "viewAppRequestList": [
                34
            ],
            "viewApplicantDashboard": [
                34
            ],
            "viewPeriodManagement": [
                34
            ],
            "viewReviewerInterface": [
                34
            ],
            "viewRoleManagement": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "AccessControl": {
            "description": [
                67
            ],
            "name": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                67
            ],
            "name": [
                67
            ],
            "tags": [
                14
            ],
            "title": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessGrantTag": {
            "category": [
                67
            ],
            "categoryLabel": [
                67
            ],
            "label": [
                67
            ],
            "tag": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessRole": {
            "actions": [
                66
            ],
            "description": [
                67
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                40
            ],
            "name": [
                67
            ],
            "scope": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                67
            ],
            "ids": [
                40
            ],
            "names": [
                67
            ],
            "scopes": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                34
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                67
            ],
            "id": [
                40
            ],
            "tags": [
                3
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                34
            ],
            "update": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                34
            ],
            "controlGroup": [
                67
            ],
            "controls": [
                67
            ],
            "tags": [
                15
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                34
            ],
            "controlGroup": [
                67
            ],
            "controls": [
                67
            ],
            "tags": [
                15
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                38
            ],
            "groupName": [
                67
            ],
            "roleId": [
                40
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleInput": {
            "description": [
                67
            ],
            "groups": [
                67
            ],
            "name": [
                67
            ],
            "scope": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                47
            ],
            "success": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "AccessTag": {
            "label": [
                67
            ],
            "value": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessTagCategory": {
            "category": [
                67
            ],
            "description": [
                67
            ],
            "label": [
                67
            ],
            "listable": [
                34
            ],
            "tags": [
                13
            ],
            "__typename": [
                67
            ]
        },
        "AccessTagInput": {
            "category": [
                67
            ],
            "tag": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessUser": {
            "fullname": [
                67
            ],
            "groups": [
                67
            ],
            "login": [
                40
            ],
            "otherIdentifiers": [
                18
            ],
            "otherInfo": [
                45
            ],
            "roles": [
                4
            ],
            "stillValid": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "AccessUserFilter": {
            "logins": [
                40
            ],
            "otherIdentifiers": [
                67
            ],
            "otherIdentifiersByLabel": [
                19
            ],
            "search": [
                67
            ],
            "self": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                40
            ],
            "label": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                40
            ],
            "label": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AppRequest": {
            "actions": [
                21
            ],
            "activity": [
                22,
                {
                    "filters": [
                        23
                    ]
                }
            ],
            "applicant": [
                16
            ],
            "applications": [
                29
            ],
            "closedAt": [
                38
            ],
            "createdAt": [
                38
            ],
            "data": [
                45,
                {
                    "schemaVersion": [
                        67
                    ]
                }
            ],
            "dataVersion": [
                44
            ],
            "id": [
                40
            ],
            "indexCategories": [
                25,
                {
                    "for": [
                        26
                    ]
                }
            ],
            "period": [
                49
            ],
            "prompt": [
                62,
                {
                    "promptId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "status": [
                28
            ],
            "statusReason": [
                67
            ],
            "updatedAt": [
                38
            ],
            "__typename": [
                67
            ]
        },
        "AppRequestActions": {
            "cancel": [
                34
            ],
            "close": [
                34
            ],
            "offer": [
                34
            ],
            "reopen": [
                34
            ],
            "return": [
                34
            ],
            "review": [
                34
            ],
            "submit": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "AppRequestActivity": {
            "action": [
                67
            ],
            "appRequest": [
                20
            ],
            "createdAt": [
                38
            ],
            "data": [
                45
            ],
            "description": [
                67
            ],
            "id": [
                40
            ],
            "impersonatedBy": [
                16
            ],
            "user": [
                16
            ],
            "__typename": [
                67
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                67
            ],
            "appRequestIds": [
                40
            ],
            "happenedAfter": [
                38
            ],
            "happenedBefore": [
                38
            ],
            "impersonated": [
                34
            ],
            "impersonatedBy": [
                40
            ],
            "impersonatedUsers": [
                40
            ],
            "users": [
                40
            ],
            "__typename": [
                67
            ]
        },
        "AppRequestFilter": {
            "closed": [
                34
            ],
            "closedAfter": [
                38
            ],
            "closedBefore": [
                38
            ],
            "createdAfter": [
                38
            ],
            "createdBefore": [
                38
            ],
            "ids": [
                40
            ],
            "indexes": [
                27
            ],
            "logins": [
                40
            ],
            "own": [
                34
            ],
            "periodIds": [
                40
            ],
            "search": [
                67
            ],
            "status": [
                28
            ],
            "submittedAfter": [
                38
            ],
            "submittedBefore": [
                38
            ],
            "updatedAfter": [
                38
            ],
            "updatedBefore": [
                38
            ],
            "__typename": [
                67
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                39
            ],
            "applicantDashboardPriority": [
                39
            ],
            "category": [
                67
            ],
            "categoryLabel": [
                67
            ],
            "listFiltersPriority": [
                39
            ],
            "listable": [
                34
            ],
            "reviewerDashboardPriority": [
                39
            ],
            "values": [
                42
            ],
            "__typename": [
                67
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                67
            ],
            "tags": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                30
            ],
            "id": [
                40
            ],
            "ineligiblePhase": [
                43
            ],
            "navTitle": [
                67
            ],
            "phase": [
                31
            ],
            "programKey": [
                67
            ],
            "requirements": [
                32
            ],
            "status": [
                33
            ],
            "statusReason": [
                67
            ],
            "title": [
                67
            ],
            "workflowStage": [
                57
            ],
            "__typename": [
                67
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                29
            ],
            "configurationData": [
                45
            ],
            "description": [
                67
            ],
            "id": [
                40
            ],
            "key": [
                67
            ],
            "navTitle": [
                67
            ],
            "prompts": [
                62
            ],
            "smartTitle": [
                67
            ],
            "status": [
                64
            ],
            "statusReason": [
                67
            ],
            "title": [
                67
            ],
            "type": [
                65
            ],
            "workflowStage": [
                57
            ],
            "__typename": [
                67
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                36
            ],
            "data": [
                45
            ],
            "key": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "ConfigurationAccess": {
            "update": [
                34
            ],
            "view": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                40
            ],
            "keys": [
                67
            ],
            "periodCodes": [
                67
            ],
            "periodIds": [
                40
            ],
            "__typename": [
                67
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                39
            ],
            "applicantDashboardPriority": [
                39
            ],
            "category": [
                67
            ],
            "categoryLabel": [
                67
            ],
            "listFiltersPriority": [
                39
            ],
            "listable": [
                34
            ],
            "reviewerDashboardPriority": [
                39
            ],
            "values": [
                42,
                {
                    "inUse": [
                        34
                    ],
                    "search": [
                        67
                    ]
                }
            ],
            "__typename": [
                67
            ]
        },
        "IndexValue": {
            "label": [
                67
            ],
            "value": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                68,
                {
                    "appRequestId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                68,
                {
                    "content": [
                        67,
                        "String!"
                    ],
                    "internal": [
                        34,
                        "Boolean!"
                    ]
                }
            ],
            "advanceWorkflow": [
                68,
                {
                    "applicationId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                68,
                {
                    "appRequestId": [
                        40,
                        "ID!"
                    ],
                    "dataVersion": [
                        44
                    ]
                }
            ],
            "closeAppRequest": [
                68,
                {
                    "appRequestId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                68,
                {
                    "login": [
                        67,
                        "String!"
                    ],
                    "periodId": [
                        40,
                        "ID!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "createPeriod": [
                70,
                {
                    "period": [
                        56,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "deletePeriod": [
                71,
                {
                    "periodId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                68,
                {
                    "appRequestId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "reopenAppRequest": [
                68,
                {
                    "appRequestId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "returnAppRequest": [
                68,
                {
                    "appRequestId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "roleAddGrant": [
                12,
                {
                    "grant": [
                        8,
                        "AccessRoleGrantCreate!"
                    ],
                    "roleId": [
                        40,
                        "ID!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "roleCreate": [
                12,
                {
                    "role": [
                        11,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "roleDelete": [
                71,
                {
                    "roleId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                12,
                {
                    "grantId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "roleUpdate": [
                12,
                {
                    "role": [
                        11,
                        "AccessRoleInput!"
                    ],
                    "roleId": [
                        40,
                        "ID!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "roleUpdateGrant": [
                12,
                {
                    "grant": [
                        9,
                        "AccessRoleGrantUpdate!"
                    ],
                    "grantId": [
                        40,
                        "ID!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "submitAppRequest": [
                68,
                {
                    "appRequestId": [
                        40,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                69,
                {
                    "data": [
                        45,
                        "JsonData!"
                    ],
                    "key": [
                        67,
                        "String!"
                    ],
                    "periodId": [
                        40,
                        "ID!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "updatePeriod": [
                70,
                {
                    "periodId": [
                        40,
                        "ID!"
                    ],
                    "update": [
                        56,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "updatePeriodProgram": [
                71,
                {
                    "disabled": [
                        34,
                        "Boolean!"
                    ],
                    "periodId": [
                        67,
                        "String!"
                    ],
                    "requirementKey": [
                        67,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                68,
                {
                    "data": [
                        45,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        44
                    ],
                    "promptId": [
                        40,
                        "ID!"
                    ],
                    "validateOnly": [
                        34
                    ]
                }
            ],
            "__typename": [
                67
            ]
        },
        "MutationMessage": {
            "arg": [
                67
            ],
            "message": [
                67
            ],
            "type": [
                48
            ],
            "__typename": [
                67
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                50
            ],
            "archiveDate": [
                38
            ],
            "closeDate": [
                38
            ],
            "code": [
                67
            ],
            "configurations": [
                35,
                {
                    "filter": [
                        37
                    ]
                }
            ],
            "id": [
                40
            ],
            "name": [
                67
            ],
            "openDate": [
                38
            ],
            "programs": [
                52
            ],
            "prompts": [
                55
            ],
            "requirements": [
                54
            ],
            "reviewed": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                34
            ],
            "delete": [
                34
            ],
            "update": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                38
            ],
            "archiveBefore": [
                38
            ],
            "closesAfter": [
                38
            ],
            "closesBefore": [
                38
            ],
            "codes": [
                67
            ],
            "ids": [
                40
            ],
            "names": [
                67
            ],
            "openNow": [
                34
            ],
            "opensAfter": [
                38
            ],
            "opensBefore": [
                38
            ],
            "__typename": [
                67
            ]
        },
        "PeriodProgram": {
            "actions": [
                53
            ],
            "enabled": [
                34
            ],
            "key": [
                40
            ],
            "navTitle": [
                67
            ],
            "period": [
                49
            ],
            "requirements": [
                54
            ],
            "title": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                35
            ],
            "description": [
                67
            ],
            "enabled": [
                34
            ],
            "key": [
                67
            ],
            "navTitle": [
                67
            ],
            "prompts": [
                55
            ],
            "title": [
                67
            ],
            "type": [
                65
            ],
            "__typename": [
                67
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                35
            ],
            "description": [
                67
            ],
            "key": [
                67
            ],
            "navTitle": [
                67
            ],
            "periodId": [
                67
            ],
            "title": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                38
            ],
            "closeDate": [
                38
            ],
            "code": [
                67
            ],
            "name": [
                67
            ],
            "openDate": [
                38
            ],
            "reviewed": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                34
            ],
            "key": [
                67
            ],
            "title": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "Program": {
            "key": [
                40
            ],
            "navTitle": [
                67
            ],
            "title": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "ProgramFilters": {
            "keys": [
                67
            ],
            "__typename": [
                67
            ]
        },
        "PromptVisibility": {},
        "Query": {
            "access": [
                0
            ],
            "accessUsers": [
                16,
                {
                    "filter": [
                        17
                    ]
                }
            ],
            "appRequestIndexes": [
                41,
                {
                    "categories": [
                        67,
                        "[String!]"
                    ],
                    "for": [
                        26
                    ]
                }
            ],
            "appRequests": [
                20,
                {
                    "filter": [
                        24
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "periods": [
                49,
                {
                    "filter": [
                        51
                    ]
                }
            ],
            "programs": [
                58,
                {
                    "filter": [
                        59
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
                67
            ],
            "__typename": [
                67
            ]
        },
        "RequirementPrompt": {
            "actions": [
                63
            ],
            "answered": [
                34
            ],
            "configurationData": [
                45
            ],
            "configurationRelatedData": [
                45
            ],
            "data": [
                45,
                {
                    "schemaVersion": [
                        67
                    ]
                }
            ],
            "description": [
                67
            ],
            "fetchedData": [
                45,
                {
                    "schemaVersion": [
                        67
                    ]
                }
            ],
            "id": [
                40
            ],
            "invalidated": [
                34
            ],
            "key": [
                67
            ],
            "navTitle": [
                67
            ],
            "preloadData": [
                45,
                {
                    "schemaVersion": [
                        67
                    ]
                }
            ],
            "requirement": [
                32
            ],
            "title": [
                67
            ],
            "visibility": [
                60
            ],
            "__typename": [
                67
            ]
        },
        "RequirementPromptActions": {
            "update": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                34
            ],
            "update": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                20
            ],
            "messages": [
                47
            ],
            "success": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                35
            ],
            "messages": [
                47
            ],
            "success": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                47
            ],
            "period": [
                49
            ],
            "success": [
                34
            ],
            "__typename": [
                67
            ]
        },
        "ValidatedResponse": {
            "messages": [
                47
            ],
            "success": [
                34
            ],
            "__typename": [
                67
            ]
        }
    }
}