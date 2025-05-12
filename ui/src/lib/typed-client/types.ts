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
        56,
        57,
        59
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
                59
            ]
        },
        "AccessControl": {
            "description": [
                59
            ],
            "name": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "AccessGrantTag": {
            "category": [
                59
            ],
            "categoryLabel": [
                59
            ],
            "label": [
                59
            ],
            "tag": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "AccessRole": {
            "actions": [
                58
            ],
            "description": [
                59
            ],
            "grants": [
                5
            ],
            "groups": [
                59
            ],
            "id": [
                37
            ],
            "name": [
                59
            ],
            "scope": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                59
            ],
            "ids": [
                37
            ],
            "names": [
                59
            ],
            "scopes": [
                59
            ],
            "__typename": [
                59
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
                59
            ],
            "id": [
                37
            ],
            "subjectType": [
                59
            ],
            "tags": [
                2
            ],
            "__typename": [
                59
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
                59
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                31
            ],
            "controls": [
                59
            ],
            "subjectType": [
                59
            ],
            "tags": [
                14
            ],
            "__typename": [
                59
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                31
            ],
            "controls": [
                59
            ],
            "subjectType": [
                59
            ],
            "tags": [
                14
            ],
            "__typename": [
                59
            ]
        },
        "AccessRoleInput": {
            "description": [
                59
            ],
            "groups": [
                59
            ],
            "name": [
                59
            ],
            "scope": [
                59
            ],
            "__typename": [
                59
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
                59
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "name": [
                59
            ],
            "tags": [
                13
            ],
            "__typename": [
                59
            ]
        },
        "AccessTag": {
            "label": [
                59
            ],
            "value": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "AccessTagCategory": {
            "category": [
                59
            ],
            "description": [
                59
            ],
            "label": [
                59
            ],
            "listable": [
                31
            ],
            "tags": [
                12
            ],
            "__typename": [
                59
            ]
        },
        "AccessTagInput": {
            "category": [
                59
            ],
            "tag": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "AccessUser": {
            "groups": [
                59
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
                59
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
                59
            ],
            "search": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                37
            ],
            "label": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                37
            ],
            "label": [
                59
            ],
            "__typename": [
                59
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
                        59
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
            "status": [
                26
            ],
            "updatedAt": [
                35
            ],
            "__typename": [
                59
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
                59
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
                59
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
                59
            ],
            "categoryLabel": [
                59
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
                59
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                59
            ],
            "categoryLabel": [
                59
            ],
            "listable": [
                31
            ],
            "values": [
                25,
                {
                    "search": [
                        59
                    ]
                }
            ],
            "__typename": [
                59
            ]
        },
        "AppRequestIndexValue": {
            "label": [
                59
            ],
            "value": [
                59
            ],
            "__typename": [
                59
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
                59
            ],
            "requirements": [
                29
            ],
            "status": [
                30
            ],
            "statusReason": [
                59
            ],
            "title": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                31
            ],
            "__typename": [
                59
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
                59
            ],
            "id": [
                37
            ],
            "key": [
                59
            ],
            "navTitle": [
                59
            ],
            "prompts": [
                55
            ],
            "reachable": [
                31
            ],
            "smartTitle": [
                59
            ],
            "status": [
                56
            ],
            "statusReason": [
                59
            ],
            "title": [
                59
            ],
            "type": [
                57
            ],
            "__typename": [
                59
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
                59
            ],
            "__typename": [
                59
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
                59
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                37
            ],
            "keys": [
                59
            ],
            "periodCodes": [
                59
            ],
            "periodIds": [
                37
            ],
            "__typename": [
                59
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "JsonData": {},
        "Mutation": {
            "offerAppRequest": [
                60,
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
                63,
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
                60,
                {
                    "appRequestId": [
                        37,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                61,
                {
                    "data": [
                        38,
                        "JsonData!"
                    ],
                    "key": [
                        59,
                        "String!"
                    ],
                    "periodId": [
                        59,
                        "String!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "updatePeriod": [
                62,
                {
                    "id": [
                        59,
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
                60,
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
                59
            ]
        },
        "MutationMessage": {
            "arg": [
                59
            ],
            "message": [
                59
            ],
            "type": [
                41
            ],
            "__typename": [
                59
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
                59
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
                59
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
                59
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
                59
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
                59
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
                59
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
                59
            ],
            "period": [
                42
            ],
            "requirements": [
                47
            ],
            "title": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                31
            ],
            "__typename": [
                59
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                32
            ],
            "description": [
                59
            ],
            "enabled": [
                31
            ],
            "key": [
                59
            ],
            "navTitle": [
                59
            ],
            "prompts": [
                48
            ],
            "title": [
                59
            ],
            "type": [
                57
            ],
            "__typename": [
                59
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                32
            ],
            "description": [
                59
            ],
            "key": [
                59
            ],
            "navTitle": [
                59
            ],
            "periodId": [
                59
            ],
            "title": [
                59
            ],
            "__typename": [
                59
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
                59
            ],
            "name": [
                59
            ],
            "openDate": [
                35
            ],
            "__typename": [
                59
            ]
        },
        "Program": {
            "key": [
                37
            ],
            "navTitle": [
                59
            ],
            "title": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "ProgramFilters": {
            "keys": [
                59
            ],
            "__typename": [
                59
            ]
        },
        "ProgramGroup": {
            "key": [
                37
            ],
            "navTitle": [
                59
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
                59
            ],
            "__typename": [
                59
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                37
            ],
            "__typename": [
                59
            ]
        },
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
                59
            ],
            "subjectTypes": [
                11
            ],
            "__typename": [
                59
            ]
        },
        "RequirementPrompt": {
            "answered": [
                31
            ],
            "askedEarlier": [
                31
            ],
            "askedInEarlierApplication": [
                31
            ],
            "askedInEarlierRequirement": [
                31
            ],
            "configurationData": [
                38
            ],
            "data": [
                38,
                {
                    "schemaVersion": [
                        59
                    ]
                }
            ],
            "description": [
                59
            ],
            "fetchedData": [
                38,
                {
                    "schemaVersion": [
                        59
                    ]
                }
            ],
            "hiddenInNavigation": [
                31
            ],
            "id": [
                37
            ],
            "invalidated": [
                31
            ],
            "key": [
                59
            ],
            "navTitle": [
                59
            ],
            "preloadData": [
                38,
                {
                    "schemaVersion": [
                        59
                    ]
                }
            ],
            "reachable": [
                31
            ],
            "title": [
                59
            ],
            "__typename": [
                59
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
                59
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
                59
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
                59
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
                59
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
                59
            ]
        }
    }
}