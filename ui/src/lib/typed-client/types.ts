export default {
    "scalars": [
        9,
        20,
        24,
        25,
        26,
        27,
        28,
        31,
        39,
        40,
        42
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
                42
            ]
        },
        "AccessControl": {
            "description": [
                42
            ],
            "name": [
                42
            ],
            "tagType": [
                9
            ],
            "tags": [
                12,
                {
                    "search": [
                        42
                    ]
                }
            ],
            "__typename": [
                42
            ]
        },
        "AccessControlInput": {
            "control": [
                42
            ],
            "tags": [
                13
            ],
            "__typename": [
                42
            ]
        },
        "AccessRole": {
            "actions": [
                41
            ],
            "grants": [
                5
            ],
            "groups": [
                42
            ],
            "id": [
                27
            ],
            "name": [
                42
            ],
            "scope": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                42
            ],
            "ids": [
                27
            ],
            "names": [
                42
            ],
            "scopes": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessRoleGrant": {
            "allow": [
                25
            ],
            "id": [
                27
            ],
            "subject": [
                42
            ],
            "subjectType": [
                42
            ],
            "__typename": [
                42
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
                42
            ],
            "subjectType": [
                42
            ],
            "subjects": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessRoleInput": {
            "groups": [
                42
            ],
            "name": [
                42
            ],
            "scope": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                30
            ],
            "success": [
                25
            ],
            "__typename": [
                42
            ]
        },
        "AccessSearchType": {},
        "AccessSubjectInstance": {
            "id": [
                27
            ],
            "name": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "name": [
                42
            ],
            "subjectSearchType": [
                9
            ],
            "subjects": [
                10,
                {
                    "search": [
                        42
                    ]
                }
            ],
            "__typename": [
                42
            ]
        },
        "AccessTag": {
            "category": [
                42
            ],
            "categoryLabel": [
                42
            ],
            "name": [
                42
            ],
            "tag": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessTagInput": {
            "category": [
                42
            ],
            "tag": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessUser": {
            "groups": [
                42
            ],
            "login": [
                27
            ],
            "otherIdentifiers": [
                16
            ],
            "otherInfo": [
                28
            ],
            "roles": [
                3
            ],
            "__typename": [
                42
            ]
        },
        "AccessUserFilter": {
            "logins": [
                27
            ],
            "otherIdentifersByLabel": [
                17
            ],
            "otherIdentifiers": [
                42
            ],
            "search": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                27
            ],
            "label": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                27
            ],
            "label": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "AppRequest": {
            "applications": [
                21
            ],
            "closedAt": [
                26
            ],
            "createdAt": [
                26
            ],
            "data": [
                28,
                {
                    "schemaVersion": [
                        42
                    ]
                }
            ],
            "id": [
                27
            ],
            "period": [
                32
            ],
            "status": [
                20
            ],
            "updatedAt": [
                26
            ],
            "__typename": [
                42
            ]
        },
        "AppRequestFilter": {
            "ids": [
                27
            ],
            "logins": [
                27
            ],
            "own": [
                25
            ],
            "periodIds": [
                27
            ],
            "status": [
                20
            ],
            "__typename": [
                42
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                22
            ],
            "id": [
                27
            ],
            "navTitle": [
                42
            ],
            "requirements": [
                23
            ],
            "status": [
                24
            ],
            "statusReason": [
                42
            ],
            "title": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                25
            ],
            "__typename": [
                42
            ]
        },
        "ApplicationRequirement": {
            "application": [
                21
            ],
            "configurationData": [
                28
            ],
            "description": [
                42
            ],
            "id": [
                27
            ],
            "key": [
                42
            ],
            "navTitle": [
                42
            ],
            "prompts": [
                38
            ],
            "reachable": [
                25
            ],
            "smartTitle": [
                42
            ],
            "status": [
                39
            ],
            "statusReason": [
                42
            ],
            "title": [
                42
            ],
            "type": [
                40
            ],
            "__typename": [
                42
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
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
                        27,
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
                44,
                {
                    "roleId": [
                        27,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                8,
                {
                    "grantId": [
                        27,
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
                        27,
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
                        27,
                        "ID!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "submitAppRequest": [
                43,
                {
                    "appRequestId": [
                        27,
                        "ID!"
                    ]
                }
            ],
            "updatePrompt": [
                43,
                {
                    "data": [
                        28,
                        "JsonData!"
                    ],
                    "promptId": [
                        27,
                        "ID!"
                    ],
                    "validateOnly": [
                        25
                    ]
                }
            ],
            "__typename": [
                42
            ]
        },
        "MutationMessage": {
            "arg": [
                42
            ],
            "message": [
                42
            ],
            "type": [
                31
            ],
            "__typename": [
                42
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "archiveAt": [
                26
            ],
            "closeDate": [
                26
            ],
            "code": [
                42
            ],
            "id": [
                27
            ],
            "name": [
                42
            ],
            "openDate": [
                26
            ],
            "__typename": [
                42
            ]
        },
        "Program": {
            "key": [
                27
            ],
            "navTitle": [
                42
            ],
            "title": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "ProgramFilters": {
            "keys": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "ProgramGroup": {
            "key": [
                27
            ],
            "navTitle": [
                42
            ],
            "programs": [
                33,
                {
                    "filter": [
                        34
                    ]
                }
            ],
            "title": [
                42
            ],
            "__typename": [
                42
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                27
            ],
            "__typename": [
                42
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
            "programGroups": [
                35,
                {
                    "filter": [
                        36
                    ]
                }
            ],
            "programs": [
                33,
                {
                    "filter": [
                        34
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
                42
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
                28
            ],
            "data": [
                28,
                {
                    "schemaVersion": [
                        42
                    ]
                }
            ],
            "description": [
                42
            ],
            "fetchedData": [
                28,
                {
                    "schemaVersion": [
                        42
                    ]
                }
            ],
            "hiddenInNavigation": [
                25
            ],
            "id": [
                27
            ],
            "invalidated": [
                25
            ],
            "key": [
                42
            ],
            "navTitle": [
                42
            ],
            "preloadData": [
                28,
                {
                    "schemaVersion": [
                        42
                    ]
                }
            ],
            "reachable": [
                25
            ],
            "title": [
                42
            ],
            "__typename": [
                42
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
                42
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                18
            ],
            "messages": [
                30
            ],
            "success": [
                25
            ],
            "__typename": [
                42
            ]
        },
        "ValidatedResponse": {
            "messages": [
                30
            ],
            "success": [
                25
            ],
            "__typename": [
                42
            ]
        }
    }
}