export default {
    "scalars": [
        23,
        24,
        28,
        29,
        33,
        34,
        35,
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
                29
            ],
            "createPeriod": [
                29
            ],
            "createRole": [
                29
            ],
            "viewAppRequestList": [
                29
            ],
            "viewApplicantDashboard": [
                29
            ],
            "viewPeriodManagement": [
                29
            ],
            "viewReviewerInterface": [
                29
            ],
            "viewRoleManagement": [
                29
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
                35
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
                35
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
                29
            ],
            "controls": [
                61
            ],
            "id": [
                35
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
                29
            ],
            "update": [
                29
            ],
            "__typename": [
                61
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                29
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
                29
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
                29
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
                29
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
                35
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
                35
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
                35
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
                35
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
                25
            ],
            "closedAt": [
                33
            ],
            "createdAt": [
                33
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
                35
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
                        35,
                        "ID!"
                    ]
                }
            ],
            "status": [
                24
            ],
            "statusReason": [
                61
            ],
            "updatedAt": [
                33
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestActions": {
            "cancel": [
                29
            ],
            "close": [
                29
            ],
            "offer": [
                29
            ],
            "reopen": [
                29
            ],
            "return": [
                29
            ],
            "review": [
                29
            ],
            "submit": [
                29
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestFilter": {
            "closed": [
                29
            ],
            "ids": [
                35
            ],
            "logins": [
                35
            ],
            "own": [
                29
            ],
            "periodIds": [
                35
            ],
            "status": [
                24
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                34
            ],
            "applicantDashboardPriority": [
                34
            ],
            "category": [
                61
            ],
            "categoryLabel": [
                61
            ],
            "listFiltersPriority": [
                34
            ],
            "listable": [
                29
            ],
            "reviewerDashboardPriority": [
                34
            ],
            "values": [
                37
            ],
            "__typename": [
                61
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                26
            ],
            "id": [
                35
            ],
            "navTitle": [
                61
            ],
            "requirements": [
                27
            ],
            "status": [
                28
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
                29
            ],
            "__typename": [
                61
            ]
        },
        "ApplicationRequirement": {
            "application": [
                25
            ],
            "configurationData": [
                38
            ],
            "description": [
                61
            ],
            "id": [
                35
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
                29
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
                31
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
                29
            ],
            "view": [
                29
            ],
            "__typename": [
                61
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                35
            ],
            "keys": [
                61
            ],
            "periodCodes": [
                61
            ],
            "periodIds": [
                35
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
                34
            ],
            "applicantDashboardPriority": [
                34
            ],
            "category": [
                61
            ],
            "categoryLabel": [
                61
            ],
            "listFiltersPriority": [
                34
            ],
            "listable": [
                29
            ],
            "reviewerDashboardPriority": [
                34
            ],
            "values": [
                37,
                {
                    "inUse": [
                        29
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
        "IndexValue": {
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
        "JsonData": {},
        "Mutation": {
            "offerAppRequest": [
                62,
                {
                    "appRequestId": [
                        35,
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
                        35,
                        "ID!"
                    ],
                    "validateOnly": [
                        29
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
                        29
                    ]
                }
            ],
            "roleDelete": [
                65,
                {
                    "roleId": [
                        35,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                10,
                {
                    "grantId": [
                        35,
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
                        35,
                        "ID!"
                    ],
                    "validateOnly": [
                        29
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
                        35,
                        "ID!"
                    ],
                    "validateOnly": [
                        29
                    ]
                }
            ],
            "submitAppRequest": [
                62,
                {
                    "appRequestId": [
                        35,
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
                        29
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
                        29
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
                        35,
                        "ID!"
                    ],
                    "validateOnly": [
                        29
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
                33
            ],
            "closeDate": [
                33
            ],
            "code": [
                61
            ],
            "configurations": [
                30,
                {
                    "filter": [
                        32
                    ]
                }
            ],
            "id": [
                35
            ],
            "name": [
                61
            ],
            "openDate": [
                33
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
                29
            ],
            "view": [
                29
            ],
            "__typename": [
                61
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                33
            ],
            "archiveBefore": [
                33
            ],
            "closesAfter": [
                33
            ],
            "closesBefore": [
                33
            ],
            "codes": [
                61
            ],
            "ids": [
                35
            ],
            "openNow": [
                29
            ],
            "opensAfter": [
                33
            ],
            "opensBefore": [
                33
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
                29
            ],
            "group": [
                46
            ],
            "key": [
                35
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
                29
            ],
            "__typename": [
                61
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                30
            ],
            "description": [
                61
            ],
            "enabled": [
                29
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
                30
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
                33
            ],
            "closeDate": [
                33
            ],
            "code": [
                61
            ],
            "name": [
                61
            ],
            "openDate": [
                33
            ],
            "__typename": [
                61
            ]
        },
        "Program": {
            "key": [
                35
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
                35
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
                35
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
                36,
                {
                    "categories": [
                        61,
                        "[String!]"
                    ],
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
                29
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
                35
            ],
            "invalidated": [
                29
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
                27
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
                29
            ],
            "__typename": [
                61
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                29
            ],
            "update": [
                29
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
                29
            ],
            "__typename": [
                61
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                30
            ],
            "messages": [
                40
            ],
            "success": [
                29
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
                29
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
                29
            ],
            "__typename": [
                61
            ]
        }
    }
}