export default {
    "scalars": [
        25,
        27,
        31,
        32,
        36,
        37,
        38,
        41,
        42,
        45,
        58,
        62,
        63,
        65
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                32
            ],
            "createAppRequestSelf": [
                32
            ],
            "createPeriod": [
                32
            ],
            "createRole": [
                32
            ],
            "user": [
                15
            ],
            "viewAppRequestList": [
                32
            ],
            "viewApplicantDashboard": [
                32
            ],
            "viewPeriodManagement": [
                32
            ],
            "viewReviewerInterface": [
                32
            ],
            "viewRoleManagement": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "AccessControl": {
            "description": [
                65
            ],
            "name": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessGrantTag": {
            "category": [
                65
            ],
            "categoryLabel": [
                65
            ],
            "label": [
                65
            ],
            "tag": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessRole": {
            "actions": [
                64
            ],
            "description": [
                65
            ],
            "grants": [
                5
            ],
            "groups": [
                65
            ],
            "id": [
                38
            ],
            "name": [
                65
            ],
            "scope": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                65
            ],
            "ids": [
                38
            ],
            "names": [
                65
            ],
            "scopes": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                6
            ],
            "allow": [
                32
            ],
            "controls": [
                65
            ],
            "id": [
                38
            ],
            "subjectType": [
                11
            ],
            "tags": [
                2
            ],
            "__typename": [
                65
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                32
            ],
            "update": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                32
            ],
            "controls": [
                65
            ],
            "subjectType": [
                65
            ],
            "tags": [
                14
            ],
            "__typename": [
                65
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                32
            ],
            "controls": [
                65
            ],
            "subjectType": [
                65
            ],
            "tags": [
                14
            ],
            "__typename": [
                65
            ]
        },
        "AccessRoleInput": {
            "description": [
                65
            ],
            "groups": [
                65
            ],
            "name": [
                65
            ],
            "scope": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                44
            ],
            "success": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "description": [
                65
            ],
            "name": [
                65
            ],
            "tags": [
                13
            ],
            "title": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessTag": {
            "label": [
                65
            ],
            "value": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessTagCategory": {
            "category": [
                65
            ],
            "description": [
                65
            ],
            "label": [
                65
            ],
            "listable": [
                32
            ],
            "tags": [
                12
            ],
            "__typename": [
                65
            ]
        },
        "AccessTagInput": {
            "category": [
                65
            ],
            "tag": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessUser": {
            "fullname": [
                65
            ],
            "groups": [
                65
            ],
            "login": [
                38
            ],
            "otherIdentifiers": [
                17
            ],
            "otherInfo": [
                42
            ],
            "roles": [
                3
            ],
            "stillValid": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "AccessUserFilter": {
            "logins": [
                38
            ],
            "otherIdentifiers": [
                65
            ],
            "otherIdentifiersByLabel": [
                18
            ],
            "search": [
                65
            ],
            "self": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                38
            ],
            "label": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                38
            ],
            "label": [
                65
            ],
            "__typename": [
                65
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
                28
            ],
            "closedAt": [
                36
            ],
            "createdAt": [
                36
            ],
            "data": [
                42,
                {
                    "schemaVersion": [
                        65
                    ]
                }
            ],
            "dataVersion": [
                41
            ],
            "id": [
                38
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
                46
            ],
            "prompt": [
                60,
                {
                    "promptId": [
                        38,
                        "ID!"
                    ]
                }
            ],
            "status": [
                27
            ],
            "statusReason": [
                65
            ],
            "updatedAt": [
                36
            ],
            "__typename": [
                65
            ]
        },
        "AppRequestActions": {
            "cancel": [
                32
            ],
            "close": [
                32
            ],
            "offer": [
                32
            ],
            "reopen": [
                32
            ],
            "return": [
                32
            ],
            "review": [
                32
            ],
            "submit": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "AppRequestActivity": {
            "action": [
                65
            ],
            "appRequest": [
                19
            ],
            "createdAt": [
                36
            ],
            "data": [
                42
            ],
            "description": [
                65
            ],
            "id": [
                38
            ],
            "impersonatedBy": [
                15
            ],
            "user": [
                15
            ],
            "__typename": [
                65
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                65
            ],
            "appRequestIds": [
                38
            ],
            "happenedAfter": [
                36
            ],
            "happenedBefore": [
                36
            ],
            "impersonated": [
                32
            ],
            "impersonatedBy": [
                38
            ],
            "impersonatedUsers": [
                38
            ],
            "users": [
                38
            ],
            "__typename": [
                65
            ]
        },
        "AppRequestFilter": {
            "closed": [
                32
            ],
            "closedAfter": [
                36
            ],
            "closedBefore": [
                36
            ],
            "createdAfter": [
                36
            ],
            "createdBefore": [
                36
            ],
            "ids": [
                38
            ],
            "indexes": [
                26
            ],
            "logins": [
                38
            ],
            "own": [
                32
            ],
            "periodIds": [
                38
            ],
            "search": [
                65
            ],
            "status": [
                27
            ],
            "submittedAfter": [
                36
            ],
            "submittedBefore": [
                36
            ],
            "updatedAfter": [
                36
            ],
            "updatedBefore": [
                36
            ],
            "__typename": [
                65
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                37
            ],
            "applicantDashboardPriority": [
                37
            ],
            "category": [
                65
            ],
            "categoryLabel": [
                65
            ],
            "listFiltersPriority": [
                37
            ],
            "listable": [
                32
            ],
            "reviewerDashboardPriority": [
                37
            ],
            "values": [
                40
            ],
            "__typename": [
                65
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                65
            ],
            "tags": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                29
            ],
            "id": [
                38
            ],
            "navTitle": [
                65
            ],
            "programKey": [
                65
            ],
            "requirements": [
                30
            ],
            "status": [
                31
            ],
            "statusReason": [
                65
            ],
            "title": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "ApplicationRequirement": {
            "application": [
                28
            ],
            "configurationData": [
                42
            ],
            "description": [
                65
            ],
            "id": [
                38
            ],
            "key": [
                65
            ],
            "navTitle": [
                65
            ],
            "prompts": [
                60
            ],
            "reachable": [
                32
            ],
            "smartTitle": [
                65
            ],
            "status": [
                62
            ],
            "statusReason": [
                65
            ],
            "title": [
                65
            ],
            "type": [
                63
            ],
            "__typename": [
                65
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                34
            ],
            "data": [
                42
            ],
            "key": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "ConfigurationAccess": {
            "update": [
                32
            ],
            "view": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                38
            ],
            "keys": [
                65
            ],
            "periodCodes": [
                65
            ],
            "periodIds": [
                38
            ],
            "__typename": [
                65
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                37
            ],
            "applicantDashboardPriority": [
                37
            ],
            "category": [
                65
            ],
            "categoryLabel": [
                65
            ],
            "listFiltersPriority": [
                37
            ],
            "listable": [
                32
            ],
            "reviewerDashboardPriority": [
                37
            ],
            "values": [
                40,
                {
                    "inUse": [
                        32
                    ],
                    "search": [
                        65
                    ]
                }
            ],
            "__typename": [
                65
            ]
        },
        "IndexValue": {
            "label": [
                65
            ],
            "value": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "Int": {},
        "JsonData": {},
        "Mutation": {
            "addNote": [
                66,
                {
                    "content": [
                        65,
                        "String!"
                    ],
                    "internal": [
                        32,
                        "Boolean!"
                    ]
                }
            ],
            "createAppRequest": [
                66,
                {
                    "login": [
                        65,
                        "String!"
                    ],
                    "periodId": [
                        38,
                        "ID!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "createPeriod": [
                68,
                {
                    "period": [
                        53,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "deletePeriod": [
                69,
                {
                    "periodId": [
                        38,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                66,
                {
                    "appRequestId": [
                        38,
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
                        38,
                        "ID!"
                    ],
                    "validateOnly": [
                        32
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
                        32
                    ]
                }
            ],
            "roleDelete": [
                69,
                {
                    "roleId": [
                        38,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                10,
                {
                    "grantId": [
                        38,
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
                        38,
                        "ID!"
                    ],
                    "validateOnly": [
                        32
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
                        38,
                        "ID!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "submitAppRequest": [
                66,
                {
                    "appRequestId": [
                        38,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                67,
                {
                    "data": [
                        42,
                        "JsonData!"
                    ],
                    "key": [
                        65,
                        "String!"
                    ],
                    "periodId": [
                        38,
                        "ID!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "updatePeriod": [
                68,
                {
                    "periodId": [
                        38,
                        "ID!"
                    ],
                    "update": [
                        53,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "updatePrompt": [
                66,
                {
                    "data": [
                        42,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        37
                    ],
                    "promptId": [
                        38,
                        "ID!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "__typename": [
                65
            ]
        },
        "MutationMessage": {
            "arg": [
                65
            ],
            "message": [
                65
            ],
            "type": [
                45
            ],
            "__typename": [
                65
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                47
            ],
            "archiveDate": [
                36
            ],
            "closeDate": [
                36
            ],
            "code": [
                65
            ],
            "configurations": [
                33,
                {
                    "filter": [
                        35
                    ]
                }
            ],
            "id": [
                38
            ],
            "name": [
                65
            ],
            "openDate": [
                36
            ],
            "programs": [
                49
            ],
            "prompts": [
                52
            ],
            "requirements": [
                51
            ],
            "reviewed": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                32
            ],
            "delete": [
                32
            ],
            "update": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                36
            ],
            "archiveBefore": [
                36
            ],
            "closesAfter": [
                36
            ],
            "closesBefore": [
                36
            ],
            "codes": [
                65
            ],
            "ids": [
                38
            ],
            "openNow": [
                32
            ],
            "opensAfter": [
                36
            ],
            "opensBefore": [
                36
            ],
            "__typename": [
                65
            ]
        },
        "PeriodProgram": {
            "actions": [
                50
            ],
            "enabled": [
                32
            ],
            "group": [
                50
            ],
            "key": [
                38
            ],
            "navTitle": [
                65
            ],
            "period": [
                46
            ],
            "requirements": [
                51
            ],
            "title": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                33
            ],
            "description": [
                65
            ],
            "enabled": [
                32
            ],
            "key": [
                65
            ],
            "navTitle": [
                65
            ],
            "prompts": [
                52
            ],
            "title": [
                65
            ],
            "type": [
                63
            ],
            "__typename": [
                65
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                33
            ],
            "description": [
                65
            ],
            "key": [
                65
            ],
            "navTitle": [
                65
            ],
            "periodId": [
                65
            ],
            "title": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                36
            ],
            "closeDate": [
                36
            ],
            "code": [
                65
            ],
            "name": [
                65
            ],
            "openDate": [
                36
            ],
            "__typename": [
                65
            ]
        },
        "Program": {
            "key": [
                38
            ],
            "navTitle": [
                65
            ],
            "title": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "ProgramFilters": {
            "keys": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "ProgramGroup": {
            "key": [
                38
            ],
            "navTitle": [
                65
            ],
            "programs": [
                54,
                {
                    "filter": [
                        55
                    ]
                }
            ],
            "title": [
                65
            ],
            "__typename": [
                65
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                38
            ],
            "__typename": [
                65
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
                39,
                {
                    "categories": [
                        65,
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
                46,
                {
                    "filter": [
                        48
                    ]
                }
            ],
            "programGroups": [
                56,
                {
                    "filter": [
                        57
                    ]
                }
            ],
            "programs": [
                54,
                {
                    "filter": [
                        55
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
                65
            ],
            "subjectTypes": [
                11
            ],
            "__typename": [
                65
            ]
        },
        "RequirementPrompt": {
            "actions": [
                61
            ],
            "answered": [
                32
            ],
            "configurationData": [
                42
            ],
            "configurationRelatedData": [
                42
            ],
            "data": [
                42,
                {
                    "schemaVersion": [
                        65
                    ]
                }
            ],
            "description": [
                65
            ],
            "fetchedData": [
                42,
                {
                    "schemaVersion": [
                        65
                    ]
                }
            ],
            "id": [
                38
            ],
            "invalidated": [
                32
            ],
            "key": [
                65
            ],
            "navTitle": [
                65
            ],
            "preloadData": [
                42,
                {
                    "schemaVersion": [
                        65
                    ]
                }
            ],
            "requirement": [
                30
            ],
            "title": [
                65
            ],
            "visibility": [
                58
            ],
            "__typename": [
                65
            ]
        },
        "RequirementPromptActions": {
            "update": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                32
            ],
            "update": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                19
            ],
            "messages": [
                44
            ],
            "success": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                33
            ],
            "messages": [
                44
            ],
            "success": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                44
            ],
            "period": [
                46
            ],
            "success": [
                32
            ],
            "__typename": [
                65
            ]
        },
        "ValidatedResponse": {
            "messages": [
                44
            ],
            "success": [
                32
            ],
            "__typename": [
                65
            ]
        }
    }
}