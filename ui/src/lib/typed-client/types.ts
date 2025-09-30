export default {
    "scalars": [
        27,
        29,
        32,
        34,
        35,
        39,
        40,
        41,
        44,
        45,
        46,
        49,
        61,
        65,
        66,
        68
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                35
            ],
            "createAppRequestSelf": [
                35
            ],
            "createPeriod": [
                35
            ],
            "createRole": [
                35
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                35
            ],
            "viewApplicantDashboard": [
                35
            ],
            "viewPeriodManagement": [
                35
            ],
            "viewReviewerInterface": [
                35
            ],
            "viewRoleManagement": [
                35
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
        "AccessControlGroup": {
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
                15
            ],
            "title": [
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
                6
            ],
            "groups": [
                10
            ],
            "id": [
                41
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
                41
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
                7
            ],
            "allow": [
                35
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                68
            ],
            "id": [
                41
            ],
            "tags": [
                3
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                35
            ],
            "update": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                35
            ],
            "controlGroup": [
                68
            ],
            "controls": [
                68
            ],
            "tags": [
                16
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                35
            ],
            "controlGroup": [
                68
            ],
            "controls": [
                68
            ],
            "tags": [
                16
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                39
            ],
            "dateCreated": [
                39
            ],
            "groupName": [
                68
            ],
            "managers": [
                11
            ],
            "roleId": [
                41
            ],
            "__typename": [
                68
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                68
            ],
            "fullname": [
                68
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
                4
            ],
            "messages": [
                48
            ],
            "success": [
                35
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
                35
            ],
            "tags": [
                14
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
                41
            ],
            "otherIdentifiers": [
                19
            ],
            "otherInfo": [
                46
            ],
            "roles": [
                4
            ],
            "stillValid": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "AccessUserFilter": {
            "logins": [
                41
            ],
            "otherIdentifiers": [
                68
            ],
            "otherIdentifiersByLabel": [
                20
            ],
            "search": [
                68
            ],
            "self": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                41
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
                41
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
                22
            ],
            "activity": [
                23,
                {
                    "filters": [
                        24
                    ]
                }
            ],
            "applicant": [
                17
            ],
            "applications": [
                30
            ],
            "closedAt": [
                39
            ],
            "createdAt": [
                39
            ],
            "data": [
                46,
                {
                    "schemaVersion": [
                        68
                    ]
                }
            ],
            "dataVersion": [
                45
            ],
            "id": [
                41
            ],
            "indexCategories": [
                26,
                {
                    "for": [
                        27
                    ]
                }
            ],
            "period": [
                50
            ],
            "prompt": [
                63,
                {
                    "promptId": [
                        41,
                        "ID!"
                    ]
                }
            ],
            "status": [
                29
            ],
            "statusReason": [
                68
            ],
            "updatedAt": [
                39
            ],
            "__typename": [
                68
            ]
        },
        "AppRequestActions": {
            "cancel": [
                35
            ],
            "close": [
                35
            ],
            "offer": [
                35
            ],
            "reopen": [
                35
            ],
            "return": [
                35
            ],
            "review": [
                35
            ],
            "submit": [
                35
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
                21
            ],
            "createdAt": [
                39
            ],
            "data": [
                46
            ],
            "description": [
                68
            ],
            "id": [
                41
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
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
                41
            ],
            "happenedAfter": [
                39
            ],
            "happenedBefore": [
                39
            ],
            "impersonated": [
                35
            ],
            "impersonatedBy": [
                41
            ],
            "impersonatedUsers": [
                41
            ],
            "users": [
                41
            ],
            "__typename": [
                68
            ]
        },
        "AppRequestFilter": {
            "closed": [
                35
            ],
            "closedAfter": [
                39
            ],
            "closedBefore": [
                39
            ],
            "createdAfter": [
                39
            ],
            "createdBefore": [
                39
            ],
            "ids": [
                41
            ],
            "indexes": [
                28
            ],
            "logins": [
                41
            ],
            "own": [
                35
            ],
            "periodIds": [
                41
            ],
            "search": [
                68
            ],
            "status": [
                29
            ],
            "submittedAfter": [
                39
            ],
            "submittedBefore": [
                39
            ],
            "updatedAfter": [
                39
            ],
            "updatedBefore": [
                39
            ],
            "__typename": [
                68
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                40
            ],
            "applicantDashboardPriority": [
                40
            ],
            "category": [
                68
            ],
            "categoryLabel": [
                68
            ],
            "listFiltersPriority": [
                40
            ],
            "listable": [
                35
            ],
            "reviewerDashboardPriority": [
                40
            ],
            "values": [
                43
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
                31
            ],
            "id": [
                41
            ],
            "ineligiblePhase": [
                44
            ],
            "navTitle": [
                68
            ],
            "phase": [
                32
            ],
            "programKey": [
                68
            ],
            "requirements": [
                33
            ],
            "status": [
                34
            ],
            "statusReason": [
                68
            ],
            "title": [
                68
            ],
            "workflowStage": [
                58
            ],
            "__typename": [
                68
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                30
            ],
            "configurationData": [
                46
            ],
            "description": [
                68
            ],
            "id": [
                41
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
                58
            ],
            "__typename": [
                68
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                37
            ],
            "data": [
                46
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
                35
            ],
            "view": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                41
            ],
            "keys": [
                68
            ],
            "periodCodes": [
                68
            ],
            "periodIds": [
                41
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
                40
            ],
            "applicantDashboardPriority": [
                40
            ],
            "category": [
                68
            ],
            "categoryLabel": [
                68
            ],
            "listFiltersPriority": [
                40
            ],
            "listable": [
                35
            ],
            "reviewerDashboardPriority": [
                40
            ],
            "values": [
                43,
                {
                    "inUse": [
                        35
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
                        41,
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
                        35,
                        "Boolean!"
                    ]
                }
            ],
            "advanceWorkflow": [
                69,
                {
                    "applicationId": [
                        41,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                69,
                {
                    "appRequestId": [
                        41,
                        "ID!"
                    ],
                    "dataVersion": [
                        45
                    ]
                }
            ],
            "closeAppRequest": [
                69,
                {
                    "appRequestId": [
                        41,
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
                        41,
                        "ID!"
                    ],
                    "validateOnly": [
                        35
                    ]
                }
            ],
            "createPeriod": [
                71,
                {
                    "copyPeriodId": [
                        68
                    ],
                    "period": [
                        57,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        35
                    ]
                }
            ],
            "deletePeriod": [
                72,
                {
                    "periodId": [
                        41,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                69,
                {
                    "appRequestId": [
                        41,
                        "ID!"
                    ]
                }
            ],
            "reopenAppRequest": [
                69,
                {
                    "appRequestId": [
                        41,
                        "ID!"
                    ]
                }
            ],
            "returnAppRequest": [
                69,
                {
                    "appRequestId": [
                        41,
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
                        41,
                        "ID!"
                    ],
                    "validateOnly": [
                        35
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
                        35
                    ]
                }
            ],
            "roleDelete": [
                72,
                {
                    "roleId": [
                        41,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        41,
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
                        41,
                        "ID!"
                    ],
                    "validateOnly": [
                        35
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
                        41,
                        "ID!"
                    ],
                    "validateOnly": [
                        35
                    ]
                }
            ],
            "submitAppRequest": [
                69,
                {
                    "appRequestId": [
                        41,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                70,
                {
                    "data": [
                        46,
                        "JsonData!"
                    ],
                    "key": [
                        68,
                        "String!"
                    ],
                    "periodId": [
                        41,
                        "ID!"
                    ],
                    "validateOnly": [
                        35
                    ]
                }
            ],
            "updatePeriod": [
                71,
                {
                    "periodId": [
                        41,
                        "ID!"
                    ],
                    "update": [
                        57,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        35
                    ]
                }
            ],
            "updatePeriodRequirement": [
                72,
                {
                    "disabled": [
                        35,
                        "Boolean!"
                    ],
                    "periodId": [
                        68,
                        "String!"
                    ],
                    "requirementKey": [
                        68,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                69,
                {
                    "data": [
                        46,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        45
                    ],
                    "promptId": [
                        41,
                        "ID!"
                    ],
                    "validateOnly": [
                        35
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
                49
            ],
            "__typename": [
                68
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                51
            ],
            "archiveDate": [
                39
            ],
            "closeDate": [
                39
            ],
            "code": [
                68
            ],
            "configurations": [
                36,
                {
                    "filter": [
                        38
                    ]
                }
            ],
            "id": [
                41
            ],
            "name": [
                68
            ],
            "openDate": [
                39
            ],
            "programs": [
                53
            ],
            "prompts": [
                56
            ],
            "requirements": [
                55
            ],
            "reviewed": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                35
            ],
            "delete": [
                35
            ],
            "update": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                39
            ],
            "archiveBefore": [
                39
            ],
            "closesAfter": [
                39
            ],
            "closesBefore": [
                39
            ],
            "codes": [
                68
            ],
            "ids": [
                41
            ],
            "names": [
                68
            ],
            "openNow": [
                35
            ],
            "opensAfter": [
                39
            ],
            "opensBefore": [
                39
            ],
            "__typename": [
                68
            ]
        },
        "PeriodProgram": {
            "actions": [
                54
            ],
            "enabled": [
                35
            ],
            "key": [
                41
            ],
            "navTitle": [
                68
            ],
            "period": [
                50
            ],
            "requirements": [
                55
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
                35
            ],
            "__typename": [
                68
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                36
            ],
            "description": [
                68
            ],
            "enabled": [
                35
            ],
            "key": [
                68
            ],
            "navTitle": [
                68
            ],
            "prompts": [
                56
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
                36
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
                39
            ],
            "closeDate": [
                39
            ],
            "code": [
                68
            ],
            "name": [
                68
            ],
            "openDate": [
                39
            ],
            "reviewed": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                35
            ],
            "key": [
                68
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
                41
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
                42,
                {
                    "categories": [
                        68,
                        "[String!]"
                    ],
                    "for": [
                        27
                    ]
                }
            ],
            "appRequests": [
                21,
                {
                    "filter": [
                        25
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "periods": [
                50,
                {
                    "filter": [
                        52
                    ]
                }
            ],
            "programs": [
                59,
                {
                    "filter": [
                        60
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
                68
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
                35
            ],
            "configurationData": [
                46
            ],
            "configurationRelatedData": [
                46
            ],
            "data": [
                46,
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
                46,
                {
                    "schemaVersion": [
                        68
                    ]
                }
            ],
            "id": [
                41
            ],
            "invalidated": [
                35
            ],
            "invalidatedReason": [
                68
            ],
            "key": [
                68
            ],
            "navTitle": [
                68
            ],
            "preloadData": [
                46,
                {
                    "schemaVersion": [
                        68
                    ]
                }
            ],
            "requirement": [
                33
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
                35
            ],
            "__typename": [
                68
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                35
            ],
            "update": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                21
            ],
            "messages": [
                48
            ],
            "success": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                36
            ],
            "messages": [
                48
            ],
            "success": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                48
            ],
            "period": [
                50
            ],
            "success": [
                35
            ],
            "__typename": [
                68
            ]
        },
        "ValidatedResponse": {
            "messages": [
                48
            ],
            "success": [
                35
            ],
            "__typename": [
                68
            ]
        }
    }
}