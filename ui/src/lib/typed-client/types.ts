export default {
    "scalars": [
        9,
        20,
        24,
        25,
        29,
        30,
        31,
        34,
        49,
        50,
        52
    ],
    "types": {
        "Access": {
            "createPeriod": [
                25
            ],
            "createRole": [
                25
            ],
            "viewApplicantInterface": [
                25
            ],
            "viewDefinitionManagement": [
                25
            ],
            "viewPeriodManagement": [
                25
            ],
            "viewReviewerInterface": [
                25
            ],
            "viewRoleManagement": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "AccessControl": {
            "description": [
                52
            ],
            "name": [
                52
            ],
            "tagType": [
                9
            ],
            "tags": [
                12,
                {
                    "search": [
                        52
                    ]
                }
            ],
            "__typename": [
                52
            ]
        },
        "AccessControlInput": {
            "control": [
                52
            ],
            "tags": [
                13
            ],
            "__typename": [
                52
            ]
        },
        "AccessRole": {
            "actions": [
                51
            ],
            "grants": [
                5
            ],
            "groups": [
                52
            ],
            "id": [
                30
            ],
            "name": [
                52
            ],
            "scope": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                52
            ],
            "ids": [
                30
            ],
            "names": [
                52
            ],
            "scopes": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessRoleGrant": {
            "allow": [
                25
            ],
            "id": [
                30
            ],
            "subject": [
                52
            ],
            "subjectType": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                25
            ],
            "controls": [
                2
            ],
            "description": [
                52
            ],
            "subjectType": [
                52
            ],
            "subjects": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessRoleInput": {
            "groups": [
                52
            ],
            "name": [
                52
            ],
            "scope": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                33
            ],
            "success": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "AccessSearchType": {},
        "AccessSubjectInstance": {
            "id": [
                30
            ],
            "name": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "name": [
                52
            ],
            "subjectSearchType": [
                9
            ],
            "subjects": [
                10,
                {
                    "search": [
                        52
                    ]
                }
            ],
            "__typename": [
                52
            ]
        },
        "AccessTag": {
            "category": [
                52
            ],
            "categoryLabel": [
                52
            ],
            "name": [
                52
            ],
            "tag": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessTagInput": {
            "category": [
                52
            ],
            "tag": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessUser": {
            "groups": [
                52
            ],
            "login": [
                30
            ],
            "otherIdentifiers": [
                16
            ],
            "otherInfo": [
                31
            ],
            "roles": [
                3
            ],
            "__typename": [
                52
            ]
        },
        "AccessUserFilter": {
            "logins": [
                30
            ],
            "otherIdentifersByLabel": [
                17
            ],
            "otherIdentifiers": [
                52
            ],
            "search": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                30
            ],
            "label": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                30
            ],
            "label": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "AppRequest": {
            "applications": [
                21
            ],
            "closedAt": [
                29
            ],
            "createdAt": [
                29
            ],
            "data": [
                31,
                {
                    "schemaVersion": [
                        52
                    ]
                }
            ],
            "id": [
                30
            ],
            "period": [
                35
            ],
            "status": [
                20
            ],
            "updatedAt": [
                29
            ],
            "__typename": [
                52
            ]
        },
        "AppRequestFilter": {
            "ids": [
                30
            ],
            "logins": [
                30
            ],
            "own": [
                25
            ],
            "periodIds": [
                30
            ],
            "status": [
                20
            ],
            "__typename": [
                52
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                22
            ],
            "id": [
                30
            ],
            "navTitle": [
                52
            ],
            "requirements": [
                23
            ],
            "status": [
                24
            ],
            "statusReason": [
                52
            ],
            "title": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "ApplicationRequirement": {
            "application": [
                21
            ],
            "configurationData": [
                31
            ],
            "description": [
                52
            ],
            "id": [
                30
            ],
            "key": [
                52
            ],
            "navTitle": [
                52
            ],
            "prompts": [
                48
            ],
            "reachable": [
                25
            ],
            "smartTitle": [
                52
            ],
            "status": [
                49
            ],
            "statusReason": [
                52
            ],
            "title": [
                52
            ],
            "type": [
                50
            ],
            "__typename": [
                52
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                27
            ],
            "data": [
                31
            ],
            "key": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "ConfigurationAccess": {
            "update": [
                25
            ],
            "view": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                30
            ],
            "keys": [
                52
            ],
            "periodCodes": [
                52
            ],
            "periodIds": [
                30
            ],
            "__typename": [
                52
            ]
        },
        "DateTime": {},
        "ID": {},
        "JsonData": {},
        "Mutation": {
            "roleAddGrant": [
                8,
                {
                    "grant": [
                        6,
                        "AccessRoleGrantCreate!"
                    ],
                    "roleId": [
                        30,
                        "ID!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "roleCreate": [
                8,
                {
                    "role": [
                        7,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "roleDelete": [
                56,
                {
                    "roleId": [
                        30,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                8,
                {
                    "grantId": [
                        30,
                        "ID!"
                    ]
                }
            ],
            "roleUpdate": [
                8,
                {
                    "role": [
                        7,
                        "AccessRoleInput!"
                    ],
                    "roleId": [
                        30,
                        "ID!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "roleUpdateGrant": [
                8,
                {
                    "grant": [
                        6,
                        "AccessRoleGrantCreate!"
                    ],
                    "grantId": [
                        30,
                        "ID!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "submitAppRequest": [
                53,
                {
                    "appRequestId": [
                        30,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                54,
                {
                    "data": [
                        31,
                        "JsonData!"
                    ],
                    "key": [
                        52,
                        "String!"
                    ],
                    "periodId": [
                        52,
                        "String!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "updatePeriod": [
                55,
                {
                    "id": [
                        52,
                        "String!"
                    ],
                    "update": [
                        42,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "updatePrompt": [
                53,
                {
                    "data": [
                        31,
                        "JsonData!"
                    ],
                    "promptId": [
                        30,
                        "ID!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "__typename": [
                52
            ]
        },
        "MutationMessage": {
            "arg": [
                52
            ],
            "message": [
                52
            ],
            "type": [
                34
            ],
            "__typename": [
                52
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                36
            ],
            "archiveAt": [
                29
            ],
            "closeDate": [
                29
            ],
            "code": [
                52
            ],
            "configurations": [
                26,
                {
                    "filter": [
                        28
                    ]
                }
            ],
            "id": [
                30
            ],
            "name": [
                52
            ],
            "openDate": [
                29
            ],
            "programs": [
                38
            ],
            "prompts": [
                41
            ],
            "requirements": [
                40
            ],
            "__typename": [
                52
            ]
        },
        "PeriodActions": {
            "update": [
                25
            ],
            "view": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                29
            ],
            "archiveBefore": [
                29
            ],
            "closesAfter": [
                29
            ],
            "closesBefore": [
                29
            ],
            "codes": [
                52
            ],
            "ids": [
                30
            ],
            "openNow": [
                25
            ],
            "opensAfter": [
                29
            ],
            "opensBefore": [
                29
            ],
            "__typename": [
                52
            ]
        },
        "PeriodProgram": {
            "actions": [
                39
            ],
            "enabled": [
                25
            ],
            "group": [
                39
            ],
            "key": [
                30
            ],
            "navTitle": [
                52
            ],
            "period": [
                35
            ],
            "requirements": [
                40
            ],
            "title": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                26
            ],
            "description": [
                52
            ],
            "enabled": [
                25
            ],
            "key": [
                52
            ],
            "navTitle": [
                52
            ],
            "prompts": [
                41
            ],
            "title": [
                52
            ],
            "type": [
                50
            ],
            "__typename": [
                52
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                26
            ],
            "description": [
                52
            ],
            "key": [
                52
            ],
            "navTitle": [
                52
            ],
            "periodId": [
                52
            ],
            "title": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "PeriodUpdate": {
            "archiveAt": [
                29
            ],
            "closeDate": [
                29
            ],
            "code": [
                52
            ],
            "name": [
                52
            ],
            "openDate": [
                29
            ],
            "__typename": [
                52
            ]
        },
        "Program": {
            "key": [
                30
            ],
            "navTitle": [
                52
            ],
            "title": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "ProgramFilters": {
            "keys": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "ProgramGroup": {
            "key": [
                30
            ],
            "navTitle": [
                52
            ],
            "programs": [
                43,
                {
                    "filter": [
                        44
                    ]
                }
            ],
            "title": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                30
            ],
            "__typename": [
                52
            ]
        },
        "Query": {
            "access": [
                0
            ],
            "accessUsers": [
                14,
                {
                    "filter": [
                        15
                    ]
                }
            ],
            "appRequests": [
                18,
                {
                    "filter": [
                        19
                    ]
                }
            ],
            "periods": [
                35,
                {
                    "filter": [
                        37
                    ]
                }
            ],
            "programGroups": [
                45,
                {
                    "filter": [
                        46
                    ]
                }
            ],
            "programs": [
                43,
                {
                    "filter": [
                        44
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
            "subjectTypes": [
                11
            ],
            "__typename": [
                52
            ]
        },
        "RequirementPrompt": {
            "answered": [
                25
            ],
            "askedEarlier": [
                25
            ],
            "askedInEarlierApplication": [
                25
            ],
            "askedInEarlierRequirement": [
                25
            ],
            "configurationData": [
                31
            ],
            "data": [
                31,
                {
                    "schemaVersion": [
                        52
                    ]
                }
            ],
            "description": [
                52
            ],
            "fetchedData": [
                31,
                {
                    "schemaVersion": [
                        52
                    ]
                }
            ],
            "hiddenInNavigation": [
                25
            ],
            "id": [
                30
            ],
            "invalidated": [
                25
            ],
            "key": [
                52
            ],
            "navTitle": [
                52
            ],
            "preloadData": [
                31,
                {
                    "schemaVersion": [
                        52
                    ]
                }
            ],
            "reachable": [
                25
            ],
            "title": [
                52
            ],
            "__typename": [
                52
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                25
            ],
            "update": [
                25
            ],
            "view": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                18
            ],
            "messages": [
                33
            ],
            "success": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                26
            ],
            "messages": [
                33
            ],
            "success": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                33
            ],
            "period": [
                35
            ],
            "success": [
                25
            ],
            "__typename": [
                52
            ]
        },
        "ValidatedResponse": {
            "messages": [
                33
            ],
            "success": [
                25
            ],
            "__typename": [
                52
            ]
        }
    }
}