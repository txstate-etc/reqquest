export default {
    "scalars": [
        23,
        25,
        29,
        30,
        34,
        35,
        36,
        38,
        41,
        54,
        58,
        59,
        61
    ],
    "types": {
        "Access": {
            "createAppRequest": [
                30
            ],
            "createPeriod": [
                30
            ],
            "createRole": [
                30
            ],
            "viewAppRequestList": [
                30
            ],
            "viewApplicantDashboard": [
                30
            ],
            "viewPeriodManagement": [
                30
            ],
            "viewReviewerInterface": [
                30
            ],
            "viewRoleManagement": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "AccessControl": {
            "description": [
                61
            ],
            "name": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessGrantTag": {
            "category": [
                61
            ],
            "categoryLabel": [
                61
            ],
            "label": [
                61
            ],
            "tag": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessRole": {
            "actions": [
                60
            ],
            "description": [
                61
            ],
            "grants": [
                5
            ],
            "groups": [
                61
            ],
            "id": [
                36
            ],
            "name": [
                61
            ],
            "scope": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                61
            ],
            "ids": [
                36
            ],
            "names": [
                61
            ],
            "scopes": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                6
            ],
            "allow": [
                30
            ],
            "controls": [
                61
            ],
            "id": [
                36
            ],
            "subjectType": [
                11
            ],
            "tags": [
                2
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                30
            ],
            "update": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                30
            ],
            "controls": [
                61
            ],
            "subjectType": [
                61
            ],
            "tags": [
                14
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                30
            ],
            "controls": [
                61
            ],
            "subjectType": [
                61
            ],
            "tags": [
                14
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleInput": {
            "description": [
                61
            ],
            "groups": [
                61
            ],
            "name": [
                61
            ],
            "scope": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                40
            ],
            "success": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "description": [
                61
            ],
            "name": [
                61
            ],
            "tags": [
                13
            ],
            "title": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessTag": {
            "label": [
                61
            ],
            "value": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessTagCategory": {
            "category": [
                61
            ],
            "description": [
                61
            ],
            "label": [
                61
            ],
            "listable": [
                30
            ],
            "tags": [
                12
            ],
            "__typename": [
                61
            ]
        },
        "AccessTagInput": {
            "category": [
                61
            ],
            "tag": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessUser": {
            "fullname": [
                61
            ],
            "groups": [
                61
            ],
            "login": [
                36
            ],
            "otherIdentifiers": [
                17
            ],
            "otherInfo": [
                38
            ],
            "roles": [
                3
            ],
            "__typename": [
                61
            ]
        },
        "AccessUserFilter": {
            "logins": [
                36
            ],
            "otherIdentifersByLabel": [
                18
            ],
            "otherIdentifiers": [
                61
            ],
            "search": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                36
            ],
            "label": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                36
            ],
            "label": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AppRequest": {
            "actions": [
                20
            ],
            "applicant": [
                15
            ],
            "applications": [
                26
            ],
            "closedAt": [
                34
            ],
            "createdAt": [
                34
            ],
            "data": [
                38,
                {
                    "schemaVersion": [
                        61
                    ]
                }
            ],
            "id": [
                36
            ],
            "indexCategories": [
                22,
                {
                    "for": [
                        23
                    ]
                }
            ],
            "period": [
                42
            ],
            "prompt": [
                56,
                {
                    "promptId": [
                        36,
                        "ID!"
                    ]
                }
            ],
            "status": [
                25
            ],
            "statusReason": [
                61
            ],
            "updatedAt": [
                34
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestActions": {
            "cancel": [
                30
            ],
            "close": [
                30
            ],
            "offer": [
                30
            ],
            "reopen": [
                30
            ],
            "return": [
                30
            ],
            "review": [
                30
            ],
            "submit": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestFilter": {
            "closed": [
                30
            ],
            "ids": [
                36
            ],
            "logins": [
                36
            ],
            "own": [
                30
            ],
            "periodIds": [
                36
            ],
            "status": [
                25
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                35
            ],
            "applicantDashboardPriority": [
                35
            ],
            "category": [
                61
            ],
            "categoryLabel": [
                61
            ],
            "listFiltersPriority": [
                35
            ],
            "listable": [
                30
            ],
            "reviewerDashboardPriority": [
                35
            ],
            "values": [
                24
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexValue": {
            "label": [
                61
            ],
            "value": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                27
            ],
            "id": [
                36
            ],
            "navTitle": [
                61
            ],
            "requirements": [
                28
            ],
            "status": [
                29
            ],
            "statusReason": [
                61
            ],
            "title": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "ApplicationRequirement": {
            "application": [
                26
            ],
            "configurationData": [
                38
            ],
            "description": [
                61
            ],
            "id": [
                36
            ],
            "key": [
                61
            ],
            "navTitle": [
                61
            ],
            "prompts": [
                56
            ],
            "reachable": [
                30
            ],
            "smartTitle": [
                61
            ],
            "status": [
                58
            ],
            "statusReason": [
                61
            ],
            "title": [
                61
            ],
            "type": [
                59
            ],
            "__typename": [
                61
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                32
            ],
            "data": [
                38
            ],
            "key": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "ConfigurationAccess": {
            "update": [
                30
            ],
            "view": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                36
            ],
            "keys": [
                61
            ],
            "periodCodes": [
                61
            ],
            "periodIds": [
                36
            ],
            "__typename": [
                61
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                35
            ],
            "applicantDashboardPriority": [
                35
            ],
            "category": [
                61
            ],
            "categoryLabel": [
                61
            ],
            "listFiltersPriority": [
                35
            ],
            "listable": [
                30
            ],
            "reviewerDashboardPriority": [
                35
            ],
            "values": [
                24,
                {
                    "inUse": [
                        30
                    ],
                    "search": [
                        61
                    ]
                }
            ],
            "__typename": [
                61
            ]
        },
        "JsonData": {},
        "Mutation": {
            "offerAppRequest": [
                62,
                {
                    "appRequestId": [
                        36,
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
                        36,
                        "ID!"
                    ],
                    "validateOnly": [
                        30
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
                        30
                    ]
                }
            ],
            "roleDelete": [
                65,
                {
                    "roleId": [
                        36,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                10,
                {
                    "grantId": [
                        36,
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
                        36,
                        "ID!"
                    ],
                    "validateOnly": [
                        30
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
                        36,
                        "ID!"
                    ],
                    "validateOnly": [
                        30
                    ]
                }
            ],
            "submitAppRequest": [
                62,
                {
                    "appRequestId": [
                        36,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                63,
                {
                    "data": [
                        38,
                        "JsonData!"
                    ],
                    "key": [
                        61,
                        "String!"
                    ],
                    "periodId": [
                        61,
                        "String!"
                    ],
                    "validateOnly": [
                        30
                    ]
                }
            ],
            "updatePeriod": [
                64,
                {
                    "id": [
                        61,
                        "String!"
                    ],
                    "update": [
                        49,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        30
                    ]
                }
            ],
            "updatePrompt": [
                62,
                {
                    "data": [
                        38,
                        "JsonData!"
                    ],
                    "promptId": [
                        36,
                        "ID!"
                    ],
                    "validateOnly": [
                        30
                    ]
                }
            ],
            "__typename": [
                61
            ]
        },
        "MutationMessage": {
            "arg": [
                61
            ],
            "message": [
                61
            ],
            "type": [
                41
            ],
            "__typename": [
                61
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                43
            ],
            "archiveDate": [
                34
            ],
            "closeDate": [
                34
            ],
            "code": [
                61
            ],
            "configurations": [
                31,
                {
                    "filter": [
                        33
                    ]
                }
            ],
            "id": [
                36
            ],
            "name": [
                61
            ],
            "openDate": [
                34
            ],
            "programs": [
                45
            ],
            "prompts": [
                48
            ],
            "requirements": [
                47
            ],
            "__typename": [
                61
            ]
        },
        "PeriodActions": {
            "update": [
                30
            ],
            "view": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                34
            ],
            "archiveBefore": [
                34
            ],
            "closesAfter": [
                34
            ],
            "closesBefore": [
                34
            ],
            "codes": [
                61
            ],
            "ids": [
                36
            ],
            "openNow": [
                30
            ],
            "opensAfter": [
                34
            ],
            "opensBefore": [
                34
            ],
            "__typename": [
                61
            ]
        },
        "PeriodProgram": {
            "actions": [
                46
            ],
            "enabled": [
                30
            ],
            "group": [
                46
            ],
            "key": [
                36
            ],
            "navTitle": [
                61
            ],
            "period": [
                42
            ],
            "requirements": [
                47
            ],
            "title": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                31
            ],
            "description": [
                61
            ],
            "enabled": [
                30
            ],
            "key": [
                61
            ],
            "navTitle": [
                61
            ],
            "prompts": [
                48
            ],
            "title": [
                61
            ],
            "type": [
                59
            ],
            "__typename": [
                61
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                31
            ],
            "description": [
                61
            ],
            "key": [
                61
            ],
            "navTitle": [
                61
            ],
            "periodId": [
                61
            ],
            "title": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                34
            ],
            "closeDate": [
                34
            ],
            "code": [
                61
            ],
            "name": [
                61
            ],
            "openDate": [
                34
            ],
            "__typename": [
                61
            ]
        },
        "Program": {
            "key": [
                36
            ],
            "navTitle": [
                61
            ],
            "title": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "ProgramFilters": {
            "keys": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "ProgramGroup": {
            "key": [
                36
            ],
            "navTitle": [
                61
            ],
            "programs": [
                50,
                {
                    "filter": [
                        51
                    ]
                }
            ],
            "title": [
                61
            ],
            "__typename": [
                61
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                36
            ],
            "__typename": [
                61
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
                37,
                {
                    "for": [
                        23
                    ]
                }
            ],
            "appRequests": [
                19,
                {
                    "filter": [
                        21
                    ]
                }
            ],
            "periods": [
                42,
                {
                    "filter": [
                        44
                    ]
                }
            ],
            "programGroups": [
                52,
                {
                    "filter": [
                        53
                    ]
                }
            ],
            "programs": [
                50,
                {
                    "filter": [
                        51
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
                61
            ],
            "subjectTypes": [
                11
            ],
            "__typename": [
                61
            ]
        },
        "RequirementPrompt": {
            "actions": [
                57
            ],
            "answered": [
                30
            ],
            "configurationData": [
                38
            ],
            "configurationRelatedData": [
                38
            ],
            "data": [
                38,
                {
                    "schemaVersion": [
                        61
                    ]
                }
            ],
            "description": [
                61
            ],
            "fetchedData": [
                38,
                {
                    "schemaVersion": [
                        61
                    ]
                }
            ],
            "id": [
                36
            ],
            "invalidated": [
                30
            ],
            "key": [
                61
            ],
            "navTitle": [
                61
            ],
            "preloadData": [
                38,
                {
                    "schemaVersion": [
                        61
                    ]
                }
            ],
            "requirement": [
                28
            ],
            "title": [
                61
            ],
            "visibility": [
                54
            ],
            "__typename": [
                61
            ]
        },
        "RequirementPromptActions": {
            "update": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                30
            ],
            "update": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                19
            ],
            "messages": [
                40
            ],
            "success": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                31
            ],
            "messages": [
                40
            ],
            "success": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                40
            ],
            "period": [
                42
            ],
            "success": [
                30
            ],
            "__typename": [
                61
            ]
        },
        "ValidatedResponse": {
            "messages": [
                40
            ],
            "success": [
                30
            ],
            "__typename": [
                61
            ]
        }
    }
}