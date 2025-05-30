export default {
    "scalars": [
        23,
        26,
        30,
        31,
        35,
        36,
        37,
        38,
        41,
        54,
        57,
        58,
        60
    ],
    "types": {
        "Access": {
            "createPeriod": [
                31
            ],
            "createRole": [
                31
            ],
            "viewAppRequestList": [
                31
            ],
            "viewApplicantDashboard": [
                31
            ],
            "viewPeriodManagement": [
                31
            ],
            "viewReviewerInterface": [
                31
            ],
            "viewRoleManagement": [
                31
            ],
            "__typename": [
                60
            ]
        },
        "AccessControl": {
            "description": [
                60
            ],
            "name": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessGrantTag": {
            "category": [
                60
            ],
            "categoryLabel": [
                60
            ],
            "label": [
                60
            ],
            "tag": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessRole": {
            "actions": [
                59
            ],
            "description": [
                60
            ],
            "grants": [
                5
            ],
            "groups": [
                60
            ],
            "id": [
                37
            ],
            "name": [
                60
            ],
            "scope": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                60
            ],
            "ids": [
                37
            ],
            "names": [
                60
            ],
            "scopes": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                6
            ],
            "allow": [
                31
            ],
            "controls": [
                60
            ],
            "id": [
                37
            ],
            "subjectType": [
                11
            ],
            "tags": [
                2
            ],
            "__typename": [
                60
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                31
            ],
            "update": [
                31
            ],
            "__typename": [
                60
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                31
            ],
            "controls": [
                60
            ],
            "subjectType": [
                60
            ],
            "tags": [
                14
            ],
            "__typename": [
                60
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                31
            ],
            "controls": [
                60
            ],
            "subjectType": [
                60
            ],
            "tags": [
                14
            ],
            "__typename": [
                60
            ]
        },
        "AccessRoleInput": {
            "description": [
                60
            ],
            "groups": [
                60
            ],
            "name": [
                60
            ],
            "scope": [
                60
            ],
            "__typename": [
                60
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
                31
            ],
            "__typename": [
                60
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "description": [
                60
            ],
            "name": [
                60
            ],
            "tags": [
                13
            ],
            "title": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessTag": {
            "label": [
                60
            ],
            "value": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessTagCategory": {
            "category": [
                60
            ],
            "description": [
                60
            ],
            "label": [
                60
            ],
            "listable": [
                31
            ],
            "tags": [
                12
            ],
            "__typename": [
                60
            ]
        },
        "AccessTagInput": {
            "category": [
                60
            ],
            "tag": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessUser": {
            "groups": [
                60
            ],
            "login": [
                37
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
                60
            ]
        },
        "AccessUserFilter": {
            "logins": [
                37
            ],
            "otherIdentifersByLabel": [
                18
            ],
            "otherIdentifiers": [
                60
            ],
            "search": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                37
            ],
            "label": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                37
            ],
            "label": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AppRequest": {
            "actions": [
                20
            ],
            "applications": [
                27
            ],
            "closedAt": [
                35
            ],
            "createdAt": [
                35
            ],
            "data": [
                38,
                {
                    "schemaVersion": [
                        60
                    ]
                }
            ],
            "id": [
                37
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
                        37,
                        "ID!"
                    ]
                }
            ],
            "status": [
                26
            ],
            "updatedAt": [
                35
            ],
            "__typename": [
                60
            ]
        },
        "AppRequestActions": {
            "cancel": [
                31
            ],
            "close": [
                31
            ],
            "offer": [
                31
            ],
            "reopen": [
                31
            ],
            "return": [
                31
            ],
            "review": [
                31
            ],
            "submit": [
                31
            ],
            "__typename": [
                60
            ]
        },
        "AppRequestFilter": {
            "closed": [
                31
            ],
            "ids": [
                37
            ],
            "logins": [
                37
            ],
            "own": [
                31
            ],
            "periodIds": [
                37
            ],
            "status": [
                26
            ],
            "__typename": [
                60
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                36
            ],
            "applicantDashboardPriority": [
                36
            ],
            "category": [
                60
            ],
            "categoryLabel": [
                60
            ],
            "listFiltersPriority": [
                36
            ],
            "reviewerDashboardPriority": [
                36
            ],
            "values": [
                25
            ],
            "__typename": [
                60
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                60
            ],
            "categoryLabel": [
                60
            ],
            "listable": [
                31
            ],
            "values": [
                25,
                {
                    "search": [
                        60
                    ]
                }
            ],
            "__typename": [
                60
            ]
        },
        "AppRequestIndexValue": {
            "label": [
                60
            ],
            "value": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                28
            ],
            "id": [
                37
            ],
            "navTitle": [
                60
            ],
            "requirements": [
                29
            ],
            "status": [
                30
            ],
            "statusReason": [
                60
            ],
            "title": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                31
            ],
            "__typename": [
                60
            ]
        },
        "ApplicationRequirement": {
            "application": [
                27
            ],
            "configurationData": [
                38
            ],
            "description": [
                60
            ],
            "id": [
                37
            ],
            "key": [
                60
            ],
            "navTitle": [
                60
            ],
            "prompts": [
                56
            ],
            "reachable": [
                31
            ],
            "smartTitle": [
                60
            ],
            "status": [
                57
            ],
            "statusReason": [
                60
            ],
            "title": [
                60
            ],
            "type": [
                58
            ],
            "__typename": [
                60
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                33
            ],
            "data": [
                38
            ],
            "key": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "ConfigurationAccess": {
            "update": [
                31
            ],
            "view": [
                31
            ],
            "__typename": [
                60
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                37
            ],
            "keys": [
                60
            ],
            "periodCodes": [
                60
            ],
            "periodIds": [
                37
            ],
            "__typename": [
                60
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "JsonData": {},
        "Mutation": {
            "offerAppRequest": [
                61,
                {
                    "appRequestId": [
                        37,
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
                        37,
                        "ID!"
                    ],
                    "validateOnly": [
                        31
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
                        31
                    ]
                }
            ],
            "roleDelete": [
                64,
                {
                    "roleId": [
                        37,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                10,
                {
                    "grantId": [
                        37,
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
                        37,
                        "ID!"
                    ],
                    "validateOnly": [
                        31
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
                        37,
                        "ID!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "submitAppRequest": [
                61,
                {
                    "appRequestId": [
                        37,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                62,
                {
                    "data": [
                        38,
                        "JsonData!"
                    ],
                    "key": [
                        60,
                        "String!"
                    ],
                    "periodId": [
                        60,
                        "String!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "updatePeriod": [
                63,
                {
                    "id": [
                        60,
                        "String!"
                    ],
                    "update": [
                        49,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "updatePrompt": [
                61,
                {
                    "data": [
                        38,
                        "JsonData!"
                    ],
                    "promptId": [
                        37,
                        "ID!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "__typename": [
                60
            ]
        },
        "MutationMessage": {
            "arg": [
                60
            ],
            "message": [
                60
            ],
            "type": [
                41
            ],
            "__typename": [
                60
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                43
            ],
            "archiveAt": [
                35
            ],
            "closeDate": [
                35
            ],
            "code": [
                60
            ],
            "configurations": [
                32,
                {
                    "filter": [
                        34
                    ]
                }
            ],
            "id": [
                37
            ],
            "name": [
                60
            ],
            "openDate": [
                35
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
                60
            ]
        },
        "PeriodActions": {
            "update": [
                31
            ],
            "view": [
                31
            ],
            "__typename": [
                60
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                35
            ],
            "archiveBefore": [
                35
            ],
            "closesAfter": [
                35
            ],
            "closesBefore": [
                35
            ],
            "codes": [
                60
            ],
            "ids": [
                37
            ],
            "openNow": [
                31
            ],
            "opensAfter": [
                35
            ],
            "opensBefore": [
                35
            ],
            "__typename": [
                60
            ]
        },
        "PeriodProgram": {
            "actions": [
                46
            ],
            "enabled": [
                31
            ],
            "group": [
                46
            ],
            "key": [
                37
            ],
            "navTitle": [
                60
            ],
            "period": [
                42
            ],
            "requirements": [
                47
            ],
            "title": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                31
            ],
            "__typename": [
                60
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                32
            ],
            "description": [
                60
            ],
            "enabled": [
                31
            ],
            "key": [
                60
            ],
            "navTitle": [
                60
            ],
            "prompts": [
                48
            ],
            "title": [
                60
            ],
            "type": [
                58
            ],
            "__typename": [
                60
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                32
            ],
            "description": [
                60
            ],
            "key": [
                60
            ],
            "navTitle": [
                60
            ],
            "periodId": [
                60
            ],
            "title": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "PeriodUpdate": {
            "archiveAt": [
                35
            ],
            "closeDate": [
                35
            ],
            "code": [
                60
            ],
            "name": [
                60
            ],
            "openDate": [
                35
            ],
            "__typename": [
                60
            ]
        },
        "Program": {
            "key": [
                37
            ],
            "navTitle": [
                60
            ],
            "title": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "ProgramFilters": {
            "keys": [
                60
            ],
            "__typename": [
                60
            ]
        },
        "ProgramGroup": {
            "key": [
                37
            ],
            "navTitle": [
                60
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
                60
            ],
            "__typename": [
                60
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                37
            ],
            "__typename": [
                60
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
            "appRequestFilters": [
                24
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
                60
            ],
            "subjectTypes": [
                11
            ],
            "__typename": [
                60
            ]
        },
        "RequirementPrompt": {
            "answered": [
                31
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
                        60
                    ]
                }
            ],
            "description": [
                60
            ],
            "fetchedData": [
                38,
                {
                    "schemaVersion": [
                        60
                    ]
                }
            ],
            "id": [
                37
            ],
            "invalidated": [
                31
            ],
            "key": [
                60
            ],
            "navTitle": [
                60
            ],
            "preloadData": [
                38,
                {
                    "schemaVersion": [
                        60
                    ]
                }
            ],
            "title": [
                60
            ],
            "visibility": [
                54
            ],
            "__typename": [
                60
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                31
            ],
            "update": [
                31
            ],
            "__typename": [
                60
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
                31
            ],
            "__typename": [
                60
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                32
            ],
            "messages": [
                40
            ],
            "success": [
                31
            ],
            "__typename": [
                60
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
                31
            ],
            "__typename": [
                60
            ]
        },
        "ValidatedResponse": {
            "messages": [
                40
            ],
            "success": [
                31
            ],
            "__typename": [
                60
            ]
        }
    }
}