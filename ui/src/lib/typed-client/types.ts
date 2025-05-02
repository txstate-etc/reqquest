export default {
    "scalars": [
        9,
        20,
        22,
        23,
        24,
        25,
        26,
        29,
        36
    ],
    "types": {
        "Access": {
            "createPeriod": [
                23
            ],
            "createRole": [
                23
            ],
            "viewApplicantInterface": [
                23
            ],
            "viewDefinitionManagement": [
                23
            ],
            "viewPeriodManagement": [
                23
            ],
            "viewReviewerInterface": [
                23
            ],
            "viewRoleManagement": [
                23
            ],
            "__typename": [
                36
            ]
        },
        "AccessControl": {
            "description": [
                36
            ],
            "name": [
                36
            ],
            "tagType": [
                9
            ],
            "tags": [
                12,
                {
                    "search": [
                        36
                    ]
                }
            ],
            "__typename": [
                36
            ]
        },
        "AccessControlInput": {
            "control": [
                36
            ],
            "tags": [
                13
            ],
            "__typename": [
                36
            ]
        },
        "AccessRole": {
            "actions": [
                35
            ],
            "grants": [
                5
            ],
            "groups": [
                36
            ],
            "id": [
                25
            ],
            "name": [
                36
            ],
            "scope": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                36
            ],
            "ids": [
                25
            ],
            "names": [
                36
            ],
            "scopes": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessRoleGrant": {
            "allow": [
                23
            ],
            "id": [
                25
            ],
            "subject": [
                36
            ],
            "subjectType": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                23
            ],
            "controls": [
                2
            ],
            "description": [
                36
            ],
            "subjectType": [
                36
            ],
            "subjects": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessRoleInput": {
            "groups": [
                36
            ],
            "name": [
                36
            ],
            "scope": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                28
            ],
            "success": [
                23
            ],
            "__typename": [
                36
            ]
        },
        "AccessSearchType": {},
        "AccessSubjectInstance": {
            "id": [
                25
            ],
            "name": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "name": [
                36
            ],
            "subjectSearchType": [
                9
            ],
            "subjects": [
                10,
                {
                    "search": [
                        36
                    ]
                }
            ],
            "__typename": [
                36
            ]
        },
        "AccessTag": {
            "category": [
                36
            ],
            "categoryLabel": [
                36
            ],
            "name": [
                36
            ],
            "tag": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessTagInput": {
            "category": [
                36
            ],
            "tag": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessUser": {
            "groups": [
                36
            ],
            "login": [
                25
            ],
            "otherIdentifiers": [
                16
            ],
            "otherInfo": [
                26
            ],
            "roles": [
                3
            ],
            "__typename": [
                36
            ]
        },
        "AccessUserFilter": {
            "logins": [
                25
            ],
            "otherIdentifersByLabel": [
                17
            ],
            "otherIdentifiers": [
                36
            ],
            "search": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                25
            ],
            "label": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                25
            ],
            "label": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "AppRequest": {
            "applications": [
                21
            ],
            "closedAt": [
                24
            ],
            "createdAt": [
                24
            ],
            "data": [
                26,
                {
                    "schemaVersion": [
                        36
                    ]
                }
            ],
            "id": [
                25
            ],
            "status": [
                20
            ],
            "submitEligible": [
                23
            ],
            "updatedAt": [
                24
            ],
            "__typename": [
                36
            ]
        },
        "AppRequestFilter": {
            "ids": [
                25
            ],
            "logins": [
                25
            ],
            "own": [
                23
            ],
            "periodIds": [
                25
            ],
            "status": [
                20
            ],
            "__typename": [
                36
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "id": [
                25
            ],
            "status": [
                22
            ],
            "statusReason": [
                36
            ],
            "__typename": [
                36
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
                        25,
                        "ID!"
                    ],
                    "validateOnly": [
                        23
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
                        23
                    ]
                }
            ],
            "roleDelete": [
                37,
                {
                    "roleId": [
                        25,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                8,
                {
                    "grantId": [
                        25,
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
                        25,
                        "ID!"
                    ],
                    "validateOnly": [
                        23
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
                        25,
                        "ID!"
                    ],
                    "validateOnly": [
                        23
                    ]
                }
            ],
            "__typename": [
                36
            ]
        },
        "MutationMessage": {
            "arg": [
                36
            ],
            "message": [
                36
            ],
            "type": [
                29
            ],
            "__typename": [
                36
            ]
        },
        "MutationMessageType": {},
        "Program": {
            "key": [
                25
            ],
            "navTitle": [
                36
            ],
            "title": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "ProgramFilters": {
            "keys": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "ProgramGroup": {
            "key": [
                25
            ],
            "navTitle": [
                36
            ],
            "programs": [
                30,
                {
                    "filter": [
                        31
                    ]
                }
            ],
            "title": [
                36
            ],
            "__typename": [
                36
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                25
            ],
            "__typename": [
                36
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
                32,
                {
                    "filter": [
                        33
                    ]
                }
            ],
            "programs": [
                30,
                {
                    "filter": [
                        31
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
                36
            ]
        },
        "RoleActions": {
            "delete": [
                23
            ],
            "update": [
                23
            ],
            "view": [
                23
            ],
            "__typename": [
                36
            ]
        },
        "String": {},
        "ValidatedResponse": {
            "messages": [
                28
            ],
            "success": [
                23
            ],
            "__typename": [
                36
            ]
        }
    }
}