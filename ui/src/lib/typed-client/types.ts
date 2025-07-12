export default {
    "scalars": [
        25,
        26,
        30,
        31,
        35,
        36,
        37,
        40,
        43,
        56,
        60,
        61,
        63
    ],
    "types": {
        "Access": {
            "createAppRequest": [
                31
            ],
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
                63
            ]
        },
        "AccessControl": {
            "description": [
                63
            ],
            "name": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessGrantTag": {
            "category": [
                63
            ],
            "categoryLabel": [
                63
            ],
            "label": [
                63
            ],
            "tag": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessRole": {
            "actions": [
                62
            ],
            "description": [
                63
            ],
            "grants": [
                5
            ],
            "groups": [
                63
            ],
            "id": [
                37
            ],
            "name": [
                63
            ],
            "scope": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                63
            ],
            "ids": [
                37
            ],
            "names": [
                63
            ],
            "scopes": [
                63
            ],
            "__typename": [
                63
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
                63
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
                63
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
                63
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                31
            ],
            "controls": [
                63
            ],
            "subjectType": [
                63
            ],
            "tags": [
                14
            ],
            "__typename": [
                63
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                31
            ],
            "controls": [
                63
            ],
            "subjectType": [
                63
            ],
            "tags": [
                14
            ],
            "__typename": [
                63
            ]
        },
        "AccessRoleInput": {
            "description": [
                63
            ],
            "groups": [
                63
            ],
            "name": [
                63
            ],
            "scope": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                42
            ],
            "success": [
                31
            ],
            "__typename": [
                63
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "description": [
                63
            ],
            "name": [
                63
            ],
            "tags": [
                13
            ],
            "title": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessTag": {
            "label": [
                63
            ],
            "value": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessTagCategory": {
            "category": [
                63
            ],
            "description": [
                63
            ],
            "label": [
                63
            ],
            "listable": [
                31
            ],
            "tags": [
                12
            ],
            "__typename": [
                63
            ]
        },
        "AccessTagInput": {
            "category": [
                63
            ],
            "tag": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessUser": {
            "fullname": [
                63
            ],
            "groups": [
                63
            ],
            "login": [
                37
            ],
            "otherIdentifiers": [
                17
            ],
            "otherInfo": [
                40
            ],
            "roles": [
                3
            ],
            "__typename": [
                63
            ]
        },
        "AccessUserFilter": {
            "logins": [
                37
            ],
            "otherIdentifiers": [
                63
            ],
            "otherIdentifiersByLabel": [
                18
            ],
            "search": [
                63
            ],
            "self": [
                31
            ],
            "__typename": [
                63
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                37
            ],
            "label": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                37
            ],
            "label": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "AppRequest": {
            "actions": [
                20
            ],
            "activity": [
                21,
                {
                    "filters": [
                        22
                    ]
                }
            ],
            "applicant": [
                15
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
                40,
                {
                    "schemaVersion": [
                        63
                    ]
                }
            ],
            "id": [
                37
            ],
            "indexCategories": [
                24,
                {
                    "for": [
                        25
                    ]
                }
            ],
            "period": [
                44
            ],
            "prompt": [
                58,
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
            "statusReason": [
                63
            ],
            "updatedAt": [
                35
            ],
            "__typename": [
                63
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
                63
            ]
        },
        "AppRequestActivity": {
            "action": [
                63
            ],
            "appRequest": [
                19
            ],
            "createdAt": [
                35
            ],
            "data": [
                40
            ],
            "description": [
                63
            ],
            "id": [
                37
            ],
            "impersonatedBy": [
                15
            ],
            "user": [
                15
            ],
            "__typename": [
                63
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                63
            ],
            "appRequestIds": [
                37
            ],
            "happenedAfter": [
                35
            ],
            "happenedBefore": [
                35
            ],
            "impersonated": [
                31
            ],
            "impersonatedBy": [
                37
            ],
            "impersonatedUsers": [
                37
            ],
            "users": [
                37
            ],
            "__typename": [
                63
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
                63
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
                63
            ],
            "categoryLabel": [
                63
            ],
            "listFiltersPriority": [
                36
            ],
            "listable": [
                31
            ],
            "reviewerDashboardPriority": [
                36
            ],
            "values": [
                39
            ],
            "__typename": [
                63
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                28
            ],
            "id": [
                37
            ],
            "navTitle": [
                63
            ],
            "requirements": [
                29
            ],
            "status": [
                30
            ],
            "statusReason": [
                63
            ],
            "title": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                31
            ],
            "__typename": [
                63
            ]
        },
        "ApplicationRequirement": {
            "application": [
                27
            ],
            "configurationData": [
                40
            ],
            "description": [
                63
            ],
            "id": [
                37
            ],
            "key": [
                63
            ],
            "navTitle": [
                63
            ],
            "prompts": [
                58
            ],
            "reachable": [
                31
            ],
            "smartTitle": [
                63
            ],
            "status": [
                60
            ],
            "statusReason": [
                63
            ],
            "title": [
                63
            ],
            "type": [
                61
            ],
            "__typename": [
                63
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                33
            ],
            "data": [
                40
            ],
            "key": [
                63
            ],
            "__typename": [
                63
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
                63
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                37
            ],
            "keys": [
                63
            ],
            "periodCodes": [
                63
            ],
            "periodIds": [
                37
            ],
            "__typename": [
                63
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                36
            ],
            "applicantDashboardPriority": [
                36
            ],
            "category": [
                63
            ],
            "categoryLabel": [
                63
            ],
            "listFiltersPriority": [
                36
            ],
            "listable": [
                31
            ],
            "reviewerDashboardPriority": [
                36
            ],
            "values": [
                39,
                {
                    "inUse": [
                        31
                    ],
                    "search": [
                        63
                    ]
                }
            ],
            "__typename": [
                63
            ]
        },
        "IndexValue": {
            "label": [
                63
            ],
            "value": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "JsonData": {},
        "Mutation": {
            "addNote": [
                64,
                {
                    "content": [
                        63,
                        "String!"
                    ],
                    "internal": [
                        31,
                        "Boolean!"
                    ]
                }
            ],
            "createPeriod": [
                66,
                {
                    "period": [
                        51,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "deletePeriod": [
                67,
                {
                    "periodId": [
                        37,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                64,
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
                67,
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
                64,
                {
                    "appRequestId": [
                        37,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                65,
                {
                    "data": [
                        40,
                        "JsonData!"
                    ],
                    "key": [
                        63,
                        "String!"
                    ],
                    "periodId": [
                        37,
                        "ID!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "updatePeriod": [
                66,
                {
                    "periodId": [
                        37,
                        "ID!"
                    ],
                    "update": [
                        51,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        31
                    ]
                }
            ],
            "updatePrompt": [
                64,
                {
                    "data": [
                        40,
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
                63
            ]
        },
        "MutationMessage": {
            "arg": [
                63
            ],
            "message": [
                63
            ],
            "type": [
                43
            ],
            "__typename": [
                63
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                45
            ],
            "archiveDate": [
                35
            ],
            "closeDate": [
                35
            ],
            "code": [
                63
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
                63
            ],
            "openDate": [
                35
            ],
            "programs": [
                47
            ],
            "prompts": [
                50
            ],
            "requirements": [
                49
            ],
            "__typename": [
                63
            ]
        },
        "PeriodActions": {
            "delete": [
                31
            ],
            "update": [
                31
            ],
            "__typename": [
                63
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
                63
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
                63
            ]
        },
        "PeriodProgram": {
            "actions": [
                48
            ],
            "enabled": [
                31
            ],
            "group": [
                48
            ],
            "key": [
                37
            ],
            "navTitle": [
                63
            ],
            "period": [
                44
            ],
            "requirements": [
                49
            ],
            "title": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                31
            ],
            "__typename": [
                63
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                32
            ],
            "description": [
                63
            ],
            "enabled": [
                31
            ],
            "key": [
                63
            ],
            "navTitle": [
                63
            ],
            "prompts": [
                50
            ],
            "title": [
                63
            ],
            "type": [
                61
            ],
            "__typename": [
                63
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                32
            ],
            "description": [
                63
            ],
            "key": [
                63
            ],
            "navTitle": [
                63
            ],
            "periodId": [
                63
            ],
            "title": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                35
            ],
            "closeDate": [
                35
            ],
            "code": [
                63
            ],
            "name": [
                63
            ],
            "openDate": [
                35
            ],
            "__typename": [
                63
            ]
        },
        "Program": {
            "key": [
                37
            ],
            "navTitle": [
                63
            ],
            "title": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "ProgramFilters": {
            "keys": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "ProgramGroup": {
            "key": [
                37
            ],
            "navTitle": [
                63
            ],
            "programs": [
                52,
                {
                    "filter": [
                        53
                    ]
                }
            ],
            "title": [
                63
            ],
            "__typename": [
                63
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                37
            ],
            "__typename": [
                63
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
                38,
                {
                    "categories": [
                        63,
                        "[String!]"
                    ],
                    "for": [
                        25
                    ]
                }
            ],
            "appRequests": [
                19,
                {
                    "filter": [
                        23
                    ]
                }
            ],
            "periods": [
                44,
                {
                    "filter": [
                        46
                    ]
                }
            ],
            "programGroups": [
                54,
                {
                    "filter": [
                        55
                    ]
                }
            ],
            "programs": [
                52,
                {
                    "filter": [
                        53
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
                63
            ],
            "subjectTypes": [
                11
            ],
            "__typename": [
                63
            ]
        },
        "RequirementPrompt": {
            "actions": [
                59
            ],
            "answered": [
                31
            ],
            "configurationData": [
                40
            ],
            "configurationRelatedData": [
                40
            ],
            "data": [
                40,
                {
                    "schemaVersion": [
                        63
                    ]
                }
            ],
            "description": [
                63
            ],
            "fetchedData": [
                40,
                {
                    "schemaVersion": [
                        63
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
                63
            ],
            "navTitle": [
                63
            ],
            "preloadData": [
                40,
                {
                    "schemaVersion": [
                        63
                    ]
                }
            ],
            "requirement": [
                29
            ],
            "title": [
                63
            ],
            "visibility": [
                56
            ],
            "__typename": [
                63
            ]
        },
        "RequirementPromptActions": {
            "update": [
                31
            ],
            "__typename": [
                63
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
                63
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                19
            ],
            "messages": [
                42
            ],
            "success": [
                31
            ],
            "__typename": [
                63
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                32
            ],
            "messages": [
                42
            ],
            "success": [
                31
            ],
            "__typename": [
                63
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                42
            ],
            "period": [
                44
            ],
            "success": [
                31
            ],
            "__typename": [
                63
            ]
        },
        "ValidatedResponse": {
            "messages": [
                42
            ],
            "success": [
                31
            ],
            "__typename": [
                63
            ]
        }
    }
}