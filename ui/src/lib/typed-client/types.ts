export default {
    "scalars": [
        28,
        30,
        33,
        35,
        36,
        40,
        41,
        42,
        45,
        46,
        47,
        50,
        62,
        66,
        67,
        69
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
                69
            ]
        },
        "AccessControl": {
            "description": [
                69
            ],
            "name": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                69
            ],
            "name": [
                69
            ],
            "tags": [
                15
            ],
            "title": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessGrantTag": {
            "category": [
                69
            ],
            "categoryLabel": [
                69
            ],
            "label": [
                69
            ],
            "tag": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessRole": {
            "actions": [
                68
            ],
            "description": [
                69
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                42
            ],
            "name": [
                69
            ],
            "scope": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                69
            ],
            "ids": [
                42
            ],
            "names": [
                69
            ],
            "scopes": [
                69
            ],
            "__typename": [
                69
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
                69
            ],
            "id": [
                42
            ],
            "tags": [
                3
            ],
            "__typename": [
                69
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
                69
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                36
            ],
            "controlGroup": [
                69
            ],
            "controls": [
                69
            ],
            "tags": [
                16
            ],
            "__typename": [
                69
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                36
            ],
            "controlGroup": [
                69
            ],
            "controls": [
                69
            ],
            "tags": [
                16
            ],
            "__typename": [
                69
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
                69
            ],
            "managers": [
                11
            ],
            "roleId": [
                42
            ],
            "__typename": [
                69
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                69
            ],
            "fullname": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessRoleInput": {
            "description": [
                69
            ],
            "groups": [
                69
            ],
            "name": [
                69
            ],
            "scope": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                49
            ],
            "success": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "AccessTag": {
            "label": [
                69
            ],
            "value": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessTagCategory": {
            "category": [
                69
            ],
            "description": [
                69
            ],
            "label": [
                69
            ],
            "listable": [
                36
            ],
            "tags": [
                14
            ],
            "__typename": [
                69
            ]
        },
        "AccessTagInput": {
            "category": [
                69
            ],
            "tag": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessUser": {
            "fullname": [
                69
            ],
            "groups": [
                69
            ],
            "login": [
                42
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                47
            ],
            "roles": [
                4
            ],
            "stillValid": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "AccessUserFilter": {
            "groups": [
                69
            ],
            "logins": [
                42
            ],
            "otherGroupingsByLabel": [
                19
            ],
            "otherIdentifiers": [
                69
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "search": [
                69
            ],
            "self": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "AccessUserGroupingInput": {
            "ids": [
                42
            ],
            "label": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                42
            ],
            "label": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                42
            ],
            "label": [
                69
            ],
            "__typename": [
                69
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
                47,
                {
                    "schemaVersion": [
                        69
                    ]
                }
            ],
            "dataVersion": [
                46
            ],
            "id": [
                42
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
                51
            ],
            "prompt": [
                64,
                {
                    "promptId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "status": [
                30
            ],
            "statusReason": [
                69
            ],
            "updatedAt": [
                40
            ],
            "__typename": [
                69
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
                69
            ]
        },
        "AppRequestActivity": {
            "action": [
                69
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                40
            ],
            "data": [
                47
            ],
            "description": [
                69
            ],
            "id": [
                42
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                69
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                69
            ],
            "appRequestIds": [
                42
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
                42
            ],
            "impersonatedUsers": [
                42
            ],
            "users": [
                42
            ],
            "__typename": [
                69
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
                42
            ],
            "indexes": [
                29
            ],
            "logins": [
                42
            ],
            "own": [
                36
            ],
            "periodIds": [
                42
            ],
            "search": [
                69
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
                69
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
                69
            ],
            "categoryLabel": [
                69
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
                44
            ],
            "__typename": [
                69
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                69
            ],
            "tags": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                32
            ],
            "id": [
                42
            ],
            "ineligiblePhase": [
                45
            ],
            "navTitle": [
                69
            ],
            "phase": [
                33
            ],
            "programKey": [
                69
            ],
            "requirements": [
                34
            ],
            "status": [
                35
            ],
            "statusReason": [
                69
            ],
            "title": [
                69
            ],
            "workflowStage": [
                59
            ],
            "__typename": [
                69
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                31
            ],
            "configurationData": [
                47
            ],
            "description": [
                69
            ],
            "id": [
                42
            ],
            "key": [
                69
            ],
            "navTitle": [
                69
            ],
            "prompts": [
                64
            ],
            "smartTitle": [
                69
            ],
            "status": [
                66
            ],
            "statusReason": [
                69
            ],
            "title": [
                69
            ],
            "type": [
                67
            ],
            "workflowStage": [
                59
            ],
            "__typename": [
                69
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                38
            ],
            "data": [
                47
            ],
            "key": [
                69
            ],
            "__typename": [
                69
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
                69
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                42
            ],
            "keys": [
                69
            ],
            "periodCodes": [
                69
            ],
            "periodIds": [
                42
            ],
            "__typename": [
                69
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                41
            ],
            "applicantDashboardPriority": [
                41
            ],
            "category": [
                69
            ],
            "categoryLabel": [
                69
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
                44,
                {
                    "inUse": [
                        36
                    ],
                    "search": [
                        69
                    ]
                }
            ],
            "__typename": [
                69
            ]
        },
        "IndexValue": {
            "label": [
                69
            ],
            "value": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "acceptOffer": [
                70,
                {
                    "appRequestId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                70,
                {
                    "content": [
                        69,
                        "String!"
                    ],
                    "internal": [
                        36,
                        "Boolean!"
                    ]
                }
            ],
            "advanceWorkflow": [
                70,
                {
                    "applicationId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                70,
                {
                    "appRequestId": [
                        42,
                        "ID!"
                    ],
                    "dataVersion": [
                        46
                    ]
                }
            ],
            "closeAppRequest": [
                70,
                {
                    "appRequestId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                70,
                {
                    "login": [
                        69,
                        "String!"
                    ],
                    "periodId": [
                        42,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "createPeriod": [
                72,
                {
                    "copyPeriodId": [
                        69
                    ],
                    "period": [
                        58,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "deletePeriod": [
                73,
                {
                    "periodId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                70,
                {
                    "appRequestId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "reopenAppRequest": [
                70,
                {
                    "appRequestId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "returnAppRequest": [
                70,
                {
                    "appRequestId": [
                        42,
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
                        42,
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
                73,
                {
                    "roleId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        42,
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
                        42,
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
                        42,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "submitAppRequest": [
                70,
                {
                    "appRequestId": [
                        42,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                71,
                {
                    "data": [
                        47,
                        "JsonData!"
                    ],
                    "key": [
                        69,
                        "String!"
                    ],
                    "periodId": [
                        42,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "updatePeriod": [
                72,
                {
                    "periodId": [
                        42,
                        "ID!"
                    ],
                    "update": [
                        58,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "updatePeriodRequirement": [
                73,
                {
                    "disabled": [
                        36,
                        "Boolean!"
                    ],
                    "periodId": [
                        69,
                        "String!"
                    ],
                    "requirementKey": [
                        69,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                70,
                {
                    "data": [
                        47,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        46
                    ],
                    "promptId": [
                        42,
                        "ID!"
                    ],
                    "validateOnly": [
                        36
                    ]
                }
            ],
            "__typename": [
                69
            ]
        },
        "MutationMessage": {
            "arg": [
                69
            ],
            "message": [
                69
            ],
            "type": [
                50
            ],
            "__typename": [
                69
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                52
            ],
            "archiveDate": [
                40
            ],
            "closeDate": [
                40
            ],
            "code": [
                69
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
                42
            ],
            "name": [
                69
            ],
            "openDate": [
                40
            ],
            "programs": [
                54
            ],
            "prompts": [
                57
            ],
            "requirements": [
                56
            ],
            "reviewed": [
                36
            ],
            "__typename": [
                69
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
                69
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
                69
            ],
            "ids": [
                42
            ],
            "names": [
                69
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
                69
            ]
        },
        "PeriodProgram": {
            "actions": [
                55
            ],
            "enabled": [
                36
            ],
            "key": [
                42
            ],
            "navTitle": [
                69
            ],
            "period": [
                51
            ],
            "requirements": [
                56
            ],
            "title": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                37
            ],
            "description": [
                69
            ],
            "enabled": [
                36
            ],
            "key": [
                69
            ],
            "navTitle": [
                69
            ],
            "prompts": [
                57
            ],
            "title": [
                69
            ],
            "type": [
                67
            ],
            "__typename": [
                69
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                37
            ],
            "description": [
                69
            ],
            "key": [
                69
            ],
            "navTitle": [
                69
            ],
            "periodId": [
                69
            ],
            "title": [
                69
            ],
            "__typename": [
                69
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
                69
            ],
            "name": [
                69
            ],
            "openDate": [
                40
            ],
            "reviewed": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                36
            ],
            "key": [
                69
            ],
            "title": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "Program": {
            "key": [
                42
            ],
            "navTitle": [
                69
            ],
            "title": [
                69
            ],
            "__typename": [
                69
            ]
        },
        "ProgramFilters": {
            "keys": [
                69
            ],
            "__typename": [
                69
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
                    ]
                }
            ],
            "appRequestIndexes": [
                43,
                {
                    "categories": [
                        69,
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
            "periods": [
                51,
                {
                    "filter": [
                        53
                    ]
                }
            ],
            "programs": [
                60,
                {
                    "filter": [
                        61
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
                69
            ],
            "__typename": [
                69
            ]
        },
        "RequirementPrompt": {
            "actions": [
                65
            ],
            "answered": [
                36
            ],
            "configurationData": [
                47
            ],
            "configurationRelatedData": [
                47
            ],
            "data": [
                47,
                {
                    "schemaVersion": [
                        69
                    ]
                }
            ],
            "description": [
                69
            ],
            "fetchedData": [
                47,
                {
                    "schemaVersion": [
                        69
                    ]
                }
            ],
            "id": [
                42
            ],
            "invalidated": [
                36
            ],
            "invalidatedReason": [
                69
            ],
            "key": [
                69
            ],
            "moot": [
                36
            ],
            "navTitle": [
                69
            ],
            "preloadData": [
                47,
                {
                    "schemaVersion": [
                        69
                    ]
                }
            ],
            "requirement": [
                34
            ],
            "title": [
                69
            ],
            "visibility": [
                62
            ],
            "__typename": [
                69
            ]
        },
        "RequirementPromptActions": {
            "update": [
                36
            ],
            "__typename": [
                69
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
                69
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                49
            ],
            "success": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                37
            ],
            "messages": [
                49
            ],
            "success": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                49
            ],
            "period": [
                51
            ],
            "success": [
                36
            ],
            "__typename": [
                69
            ]
        },
        "ValidatedResponse": {
            "messages": [
                49
            ],
            "success": [
                36
            ],
            "__typename": [
                69
            ]
        }
    }
}