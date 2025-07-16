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
        44,
        57,
        61,
        62,
        64
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
                64
            ]
        },
        "AccessControl": {
            "description": [
                64
            ],
            "name": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessGrantTag": {
            "category": [
                64
            ],
            "categoryLabel": [
                64
            ],
            "label": [
                64
            ],
            "tag": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessRole": {
            "actions": [
                63
            ],
            "description": [
                64
            ],
            "grants": [
                5
            ],
            "groups": [
                64
            ],
            "id": [
                38
            ],
            "name": [
                64
            ],
            "scope": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                64
            ],
            "ids": [
                38
            ],
            "names": [
                64
            ],
            "scopes": [
                64
            ],
            "__typename": [
                64
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
                64
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
                64
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
                64
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                32
            ],
            "controls": [
                64
            ],
            "subjectType": [
                64
            ],
            "tags": [
                14
            ],
            "__typename": [
                64
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                32
            ],
            "controls": [
                64
            ],
            "subjectType": [
                64
            ],
            "tags": [
                14
            ],
            "__typename": [
                64
            ]
        },
        "AccessRoleInput": {
            "description": [
                64
            ],
            "groups": [
                64
            ],
            "name": [
                64
            ],
            "scope": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                3
            ],
            "messages": [
                43
            ],
            "success": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "AccessSubjectType": {
            "controls": [
                1
            ],
            "description": [
                64
            ],
            "name": [
                64
            ],
            "tags": [
                13
            ],
            "title": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessTag": {
            "label": [
                64
            ],
            "value": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessTagCategory": {
            "category": [
                64
            ],
            "description": [
                64
            ],
            "label": [
                64
            ],
            "listable": [
                32
            ],
            "tags": [
                12
            ],
            "__typename": [
                64
            ]
        },
        "AccessTagInput": {
            "category": [
                64
            ],
            "tag": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessUser": {
            "fullname": [
                64
            ],
            "groups": [
                64
            ],
            "login": [
                38
            ],
            "otherIdentifiers": [
                17
            ],
            "otherInfo": [
                41
            ],
            "roles": [
                3
            ],
            "stillValid": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "AccessUserFilter": {
            "logins": [
                38
            ],
            "otherIdentifiers": [
                64
            ],
            "otherIdentifiersByLabel": [
                18
            ],
            "search": [
                64
            ],
            "self": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                38
            ],
            "label": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                38
            ],
            "label": [
                64
            ],
            "__typename": [
                64
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
                41,
                {
                    "schemaVersion": [
                        64
                    ]
                }
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
                45
            ],
            "prompt": [
                59,
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
                64
            ],
            "updatedAt": [
                36
            ],
            "__typename": [
                64
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
                64
            ]
        },
        "AppRequestActivity": {
            "action": [
                64
            ],
            "appRequest": [
                19
            ],
            "createdAt": [
                36
            ],
            "data": [
                41
            ],
            "description": [
                64
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
                64
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                64
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
                64
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
                64
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
                64
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
                64
            ],
            "categoryLabel": [
                64
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
                64
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                64
            ],
            "tags": [
                64
            ],
            "__typename": [
                64
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
                64
            ],
            "requirements": [
                30
            ],
            "status": [
                31
            ],
            "statusReason": [
                64
            ],
            "title": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "ApplicationActions": {
            "viewAsReviewer": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "ApplicationRequirement": {
            "application": [
                28
            ],
            "configurationData": [
                41
            ],
            "description": [
                64
            ],
            "id": [
                38
            ],
            "key": [
                64
            ],
            "navTitle": [
                64
            ],
            "prompts": [
                59
            ],
            "reachable": [
                32
            ],
            "smartTitle": [
                64
            ],
            "status": [
                61
            ],
            "statusReason": [
                64
            ],
            "title": [
                64
            ],
            "type": [
                62
            ],
            "__typename": [
                64
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Configuration": {
            "actions": [
                34
            ],
            "data": [
                41
            ],
            "key": [
                64
            ],
            "__typename": [
                64
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
                64
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                38
            ],
            "keys": [
                64
            ],
            "periodCodes": [
                64
            ],
            "periodIds": [
                38
            ],
            "__typename": [
                64
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
                64
            ],
            "categoryLabel": [
                64
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
                        64
                    ]
                }
            ],
            "__typename": [
                64
            ]
        },
        "IndexValue": {
            "label": [
                64
            ],
            "value": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "JsonData": {},
        "Mutation": {
            "addNote": [
                65,
                {
                    "content": [
                        64,
                        "String!"
                    ],
                    "internal": [
                        32,
                        "Boolean!"
                    ]
                }
            ],
            "createAppRequest": [
                65,
                {
                    "login": [
                        64,
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
                67,
                {
                    "period": [
                        52,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "deletePeriod": [
                68,
                {
                    "periodId": [
                        38,
                        "ID!"
                    ]
                }
            ],
            "offerAppRequest": [
                65,
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
                68,
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
                65,
                {
                    "appRequestId": [
                        38,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                66,
                {
                    "data": [
                        41,
                        "JsonData!"
                    ],
                    "key": [
                        64,
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
                67,
                {
                    "periodId": [
                        38,
                        "ID!"
                    ],
                    "update": [
                        52,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        32
                    ]
                }
            ],
            "updatePrompt": [
                65,
                {
                    "data": [
                        41,
                        "JsonData!"
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
                64
            ]
        },
        "MutationMessage": {
            "arg": [
                64
            ],
            "message": [
                64
            ],
            "type": [
                44
            ],
            "__typename": [
                64
            ]
        },
        "MutationMessageType": {},
        "Period": {
            "actions": [
                46
            ],
            "archiveDate": [
                36
            ],
            "closeDate": [
                36
            ],
            "code": [
                64
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
                64
            ],
            "openDate": [
                36
            ],
            "programs": [
                48
            ],
            "prompts": [
                51
            ],
            "requirements": [
                50
            ],
            "reviewed": [
                32
            ],
            "__typename": [
                64
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
                64
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
                64
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
                64
            ]
        },
        "PeriodProgram": {
            "actions": [
                49
            ],
            "enabled": [
                32
            ],
            "group": [
                49
            ],
            "key": [
                38
            ],
            "navTitle": [
                64
            ],
            "period": [
                45
            ],
            "requirements": [
                50
            ],
            "title": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                33
            ],
            "description": [
                64
            ],
            "enabled": [
                32
            ],
            "key": [
                64
            ],
            "navTitle": [
                64
            ],
            "prompts": [
                51
            ],
            "title": [
                64
            ],
            "type": [
                62
            ],
            "__typename": [
                64
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                33
            ],
            "description": [
                64
            ],
            "key": [
                64
            ],
            "navTitle": [
                64
            ],
            "periodId": [
                64
            ],
            "title": [
                64
            ],
            "__typename": [
                64
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
                64
            ],
            "name": [
                64
            ],
            "openDate": [
                36
            ],
            "__typename": [
                64
            ]
        },
        "Program": {
            "key": [
                38
            ],
            "navTitle": [
                64
            ],
            "title": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "ProgramFilters": {
            "keys": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "ProgramGroup": {
            "key": [
                38
            ],
            "navTitle": [
                64
            ],
            "programs": [
                53,
                {
                    "filter": [
                        54
                    ]
                }
            ],
            "title": [
                64
            ],
            "__typename": [
                64
            ]
        },
        "ProgramGroupFilter": {
            "keys": [
                38
            ],
            "__typename": [
                64
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
                        64,
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
                45,
                {
                    "filter": [
                        47
                    ]
                }
            ],
            "programGroups": [
                55,
                {
                    "filter": [
                        56
                    ]
                }
            ],
            "programs": [
                53,
                {
                    "filter": [
                        54
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
                64
            ],
            "subjectTypes": [
                11
            ],
            "__typename": [
                64
            ]
        },
        "RequirementPrompt": {
            "actions": [
                60
            ],
            "answered": [
                32
            ],
            "configurationData": [
                41
            ],
            "configurationRelatedData": [
                41
            ],
            "data": [
                41,
                {
                    "schemaVersion": [
                        64
                    ]
                }
            ],
            "description": [
                64
            ],
            "fetchedData": [
                41,
                {
                    "schemaVersion": [
                        64
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
                64
            ],
            "navTitle": [
                64
            ],
            "preloadData": [
                41,
                {
                    "schemaVersion": [
                        64
                    ]
                }
            ],
            "requirement": [
                30
            ],
            "title": [
                64
            ],
            "visibility": [
                57
            ],
            "__typename": [
                64
            ]
        },
        "RequirementPromptActions": {
            "update": [
                32
            ],
            "__typename": [
                64
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
                64
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                19
            ],
            "messages": [
                43
            ],
            "success": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                33
            ],
            "messages": [
                43
            ],
            "success": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                43
            ],
            "period": [
                45
            ],
            "success": [
                32
            ],
            "__typename": [
                64
            ]
        },
        "ValidatedResponse": {
            "messages": [
                43
            ],
            "success": [
                32
            ],
            "__typename": [
                64
            ]
        }
    }
}