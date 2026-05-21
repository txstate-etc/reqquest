export default {
    "scalars": [
        28,
        31,
        32,
        37,
        39,
        40,
        46,
        47,
        48,
        51,
        52,
        53,
        59,
        76,
        81,
        82,
        84
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                40
            ],
            "createAppRequestSelf": [
                40
            ],
            "createPeriod": [
                40
            ],
            "createRole": [
                40
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                40
            ],
            "viewApplicantDashboard": [
                40
            ],
            "viewMetrics": [
                40
            ],
            "viewPeriodManagement": [
                40
            ],
            "viewReviewerInterface": [
                40
            ],
            "viewRoleManagement": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "AccessControl": {
            "description": [
                84
            ],
            "name": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                84
            ],
            "name": [
                84
            ],
            "tags": [
                15
            ],
            "title": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessGrantTag": {
            "category": [
                84
            ],
            "categoryLabel": [
                84
            ],
            "label": [
                84
            ],
            "tag": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessRole": {
            "actions": [
                83
            ],
            "description": [
                84
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                48
            ],
            "name": [
                84
            ],
            "scope": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                84
            ],
            "ids": [
                48
            ],
            "names": [
                84
            ],
            "scopes": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                40
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                84
            ],
            "id": [
                48
            ],
            "tags": [
                3
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                40
            ],
            "update": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                40
            ],
            "controlGroup": [
                84
            ],
            "controls": [
                84
            ],
            "tags": [
                16
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                40
            ],
            "controlGroup": [
                84
            ],
            "controls": [
                84
            ],
            "tags": [
                16
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                46
            ],
            "dateCreated": [
                46
            ],
            "groupName": [
                84
            ],
            "managers": [
                11
            ],
            "roleId": [
                48
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                84
            ],
            "fullname": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleInput": {
            "description": [
                84
            ],
            "groups": [
                84
            ],
            "name": [
                84
            ],
            "scope": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                58
            ],
            "success": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "AccessTag": {
            "label": [
                84
            ],
            "value": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessTagCategory": {
            "category": [
                84
            ],
            "description": [
                84
            ],
            "label": [
                84
            ],
            "listable": [
                40
            ],
            "tags": [
                14
            ],
            "__typename": [
                84
            ]
        },
        "AccessTagInput": {
            "category": [
                84
            ],
            "tag": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessUser": {
            "fullname": [
                84
            ],
            "groups": [
                84
            ],
            "login": [
                48
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                53
            ],
            "roles": [
                4
            ],
            "stillValid": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                48
            ],
            "tags": [
                48
            ],
            "__typename": [
                84
            ]
        },
        "AccessUserFilter": {
            "logins": [
                48
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                84
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                84
            ],
            "search": [
                84
            ],
            "self": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                48
            ],
            "label": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                48
            ],
            "label": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AppRequest": {
            "actions": [
                23
            ],
            "applicant": [
                17
            ],
            "applications": [
                33
            ],
            "closedAt": [
                46
            ],
            "createdAt": [
                46
            ],
            "data": [
                53,
                {
                    "schemaVersion": [
                        84
                    ]
                }
            ],
            "dataVersion": [
                52
            ],
            "id": [
                48
            ],
            "indexCategories": [
                27,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "notes": [
                60,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "otherNotes": [
                60,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "period": [
                65
            ],
            "phase": [
                31
            ],
            "prompt": [
                78,
                {
                    "promptId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "status": [
                32
            ],
            "statusReason": [
                84
            ],
            "submittedAt": [
                46
            ],
            "updatedAt": [
                46
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                40
            ],
            "cancel": [
                40
            ],
            "close": [
                40
            ],
            "completeRequest": [
                40
            ],
            "completeReview": [
                40
            ],
            "createNote": [
                40
            ],
            "createPersistentNote": [
                40
            ],
            "reopen": [
                40
            ],
            "returnToApplicant": [
                40
            ],
            "returnToNonBlocking": [
                40
            ],
            "returnToOffer": [
                40
            ],
            "returnToReview": [
                40
            ],
            "review": [
                40
            ],
            "submit": [
                40
            ],
            "viewAcceptUI": [
                40
            ],
            "viewApplyUI": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestActivity": {
            "action": [
                84
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                46
            ],
            "data": [
                53
            ],
            "description": [
                84
            ],
            "id": [
                48
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                84
            ],
            "appRequestIds": [
                48
            ],
            "happenedAfter": [
                46
            ],
            "happenedBefore": [
                46
            ],
            "impersonated": [
                40
            ],
            "impersonatedBy": [
                48
            ],
            "impersonatedUsers": [
                48
            ],
            "users": [
                48
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestFilter": {
            "closed": [
                40
            ],
            "closedAfter": [
                46
            ],
            "closedBefore": [
                46
            ],
            "complete": [
                40
            ],
            "createdAfter": [
                46
            ],
            "createdBefore": [
                46
            ],
            "ids": [
                48
            ],
            "indexes": [
                29
            ],
            "logins": [
                48
            ],
            "own": [
                40
            ],
            "periodIds": [
                48
            ],
            "reviewStarted": [
                40
            ],
            "search": [
                84
            ],
            "status": [
                32
            ],
            "submittedAfter": [
                46
            ],
            "submittedBefore": [
                46
            ],
            "updatedAfter": [
                46
            ],
            "updatedBefore": [
                46
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                47
            ],
            "applicantDashboardPriority": [
                47
            ],
            "category": [
                84
            ],
            "categoryLabel": [
                84
            ],
            "listFiltersPriority": [
                47
            ],
            "listable": [
                40
            ],
            "reviewerDashboardPriority": [
                47
            ],
            "values": [
                50
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                84
            ],
            "tags": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                48
            ],
            "applicants": [
                84
            ],
            "ids": [
                48
            ],
            "__typename": [
                84
            ]
        },
        "AppRequestPhase": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                34
            ],
            "id": [
                48
            ],
            "ineligiblePhase": [
                51
            ],
            "navTitle": [
                84
            ],
            "nextWorkflowStage": [
                73
            ],
            "phase": [
                37
            ],
            "previousWorkflowStage": [
                73
            ],
            "programKey": [
                84
            ],
            "requirements": [
                38
            ],
            "status": [
                39
            ],
            "statusReason": [
                84
            ],
            "title": [
                84
            ],
            "workflowStage": [
                73
            ],
            "workflowStages": [
                73
            ],
            "__typename": [
                84
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                40
            ],
            "reverseWorkflow": [
                40
            ],
            "viewAsReviewer": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "ApplicationMetric": {
            "approved": [
                47
            ],
            "closed": [
                47
            ],
            "denied": [
                47
            ],
            "entries": [
                36
            ],
            "started": [
                47
            ],
            "submitted": [
                47
            ],
            "__typename": [
                84
            ]
        },
        "ApplicationMetricEntry": {
            "applicantFullname": [
                84
            ],
            "applicantId": [
                48
            ],
            "applicantLogin": [
                84
            ],
            "applicationId": [
                48
            ],
            "closedAt": [
                46
            ],
            "createdAt": [
                46
            ],
            "ineligiblePhase": [
                84
            ],
            "periodCode": [
                84
            ],
            "periodId": [
                48
            ],
            "periodName": [
                84
            ],
            "phase": [
                84
            ],
            "programKey": [
                84
            ],
            "status": [
                84
            ],
            "submittedAt": [
                46
            ],
            "updatedAt": [
                46
            ],
            "__typename": [
                84
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                33
            ],
            "configurationData": [
                53
            ],
            "description": [
                84
            ],
            "id": [
                48
            ],
            "key": [
                84
            ],
            "navTitle": [
                84
            ],
            "prompts": [
                78,
                {
                    "filter": [
                        80
                    ]
                }
            ],
            "smartTitle": [
                84
            ],
            "status": [
                81
            ],
            "statusReason": [
                84
            ],
            "title": [
                84
            ],
            "type": [
                82
            ],
            "workflowStage": [
                73
            ],
            "__typename": [
                84
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                84
            ],
            "label": [
                84
            ],
            "tags": [
                42
            ],
            "useInFilters": [
                40
            ],
            "useInList": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "CategoryTag": {
            "label": [
                84
            ],
            "tag": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "Configuration": {
            "actions": [
                44
            ],
            "data": [
                53
            ],
            "fetchedData": [
                53
            ],
            "key": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "ConfigurationAccess": {
            "update": [
                40
            ],
            "view": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                48
            ],
            "keys": [
                84
            ],
            "periodCodes": [
                84
            ],
            "periodIds": [
                48
            ],
            "__typename": [
                84
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                47
            ],
            "applicantDashboardPriority": [
                47
            ],
            "category": [
                84
            ],
            "categoryLabel": [
                84
            ],
            "listFiltersPriority": [
                47
            ],
            "listable": [
                40
            ],
            "reviewerDashboardPriority": [
                47
            ],
            "values": [
                50,
                {
                    "inUse": [
                        40
                    ],
                    "search": [
                        84
                    ]
                }
            ],
            "__typename": [
                84
            ]
        },
        "IndexValue": {
            "label": [
                84
            ],
            "value": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "MetricAccessUserFilters": {
            "fullnames": [
                84
            ],
            "ids": [
                48
            ],
            "logins": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "MetricApplicationFilters": {
            "applicants": [
                54
            ],
            "applicationIds": [
                48
            ],
            "closedAfterDateTime": [
                46
            ],
            "closedBeforeDateTime": [
                46
            ],
            "periods": [
                56
            ],
            "startedAfterDateTime": [
                46
            ],
            "startedBeforeDateTime": [
                46
            ],
            "submittedAfterDateTime": [
                46
            ],
            "submittedBeforeDateTime": [
                46
            ],
            "__typename": [
                84
            ]
        },
        "MetricPeriodFilters": {
            "codes": [
                84
            ],
            "ids": [
                48
            ],
            "names": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "Mutation": {
            "acceptOffer": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                87,
                {
                    "content": [
                        84,
                        "String!"
                    ],
                    "persistent": [
                        40
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "advanceWorkflow": [
                85,
                {
                    "applicationId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ],
                    "dataVersion": [
                        52
                    ]
                }
            ],
            "closeAppRequest": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                85,
                {
                    "login": [
                        84,
                        "String!"
                    ],
                    "periodId": [
                        48,
                        "ID!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "createPeriod": [
                88,
                {
                    "copyPeriodId": [
                        84
                    ],
                    "period": [
                        72,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "deleteNote": [
                40,
                {
                    "noteId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "deletePeriod": [
                89,
                {
                    "periodId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                88,
                {
                    "periodId": [
                        48,
                        "ID!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "reopenAppRequest": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "returnToApplicant": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                85,
                {
                    "applicationId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "roleAddGrant": [
                13,
                {
                    "grant": [
                        8,
                        "AccessRoleGrantCreate!"
                    ],
                    "roleId": [
                        48,
                        "ID!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        48
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "roleDelete": [
                89,
                {
                    "roleId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "roleUpdate": [
                13,
                {
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "roleId": [
                        48,
                        "ID!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "roleUpdateGrant": [
                13,
                {
                    "grant": [
                        9,
                        "AccessRoleGrantUpdate!"
                    ],
                    "grantId": [
                        48,
                        "ID!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "stagePrompt": [
                85,
                {
                    "dataVersion": [
                        52
                    ],
                    "promptId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "submitAppRequest": [
                85,
                {
                    "appRequestId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "togglePersistence": [
                87,
                {
                    "noteId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                86,
                {
                    "data": [
                        53,
                        "JsonData!"
                    ],
                    "key": [
                        84,
                        "String!"
                    ],
                    "periodId": [
                        48,
                        "ID!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "updateNote": [
                87,
                {
                    "content": [
                        84,
                        "String!"
                    ],
                    "noteId": [
                        48,
                        "ID!"
                    ]
                }
            ],
            "updatePeriod": [
                88,
                {
                    "periodId": [
                        48,
                        "ID!"
                    ],
                    "update": [
                        72,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "updatePeriodRequirement": [
                89,
                {
                    "disabled": [
                        40,
                        "Boolean!"
                    ],
                    "periodId": [
                        84,
                        "String!"
                    ],
                    "requirementKey": [
                        84,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                85,
                {
                    "data": [
                        53,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        52
                    ],
                    "promptId": [
                        48,
                        "ID!"
                    ],
                    "validateOnly": [
                        40
                    ]
                }
            ],
            "__typename": [
                84
            ]
        },
        "MutationMessage": {
            "arg": [
                84
            ],
            "message": [
                84
            ],
            "type": [
                59
            ],
            "__typename": [
                84
            ]
        },
        "MutationMessageType": {},
        "Note": {
            "actions": [
                61
            ],
            "appRequest": [
                22
            ],
            "author": [
                17
            ],
            "content": [
                84
            ],
            "createdAt": [
                46
            ],
            "id": [
                48
            ],
            "persistent": [
                40
            ],
            "updatedAt": [
                46
            ],
            "__typename": [
                84
            ]
        },
        "NoteActions": {
            "delete": [
                40
            ],
            "update": [
                40
            ],
            "updatePersistent": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "Pagination": {
            "page": [
                52
            ],
            "perPage": [
                52
            ],
            "__typename": [
                84
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                41
            ],
            "currentPage": [
                47
            ],
            "hasNextPage": [
                40
            ],
            "perPage": [
                47
            ],
            "totalItems": [
                47
            ],
            "__typename": [
                84
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                63
            ],
            "appRequests": [
                63
            ],
            "appRequestsActivity": [
                63
            ],
            "__typename": [
                84
            ]
        },
        "Period": {
            "actions": [
                66
            ],
            "archiveDate": [
                46
            ],
            "closeDate": [
                46
            ],
            "code": [
                84
            ],
            "configurations": [
                43,
                {
                    "filter": [
                        45
                    ]
                }
            ],
            "id": [
                48
            ],
            "name": [
                84
            ],
            "openDate": [
                46
            ],
            "programs": [
                68
            ],
            "prompts": [
                71
            ],
            "requirements": [
                70
            ],
            "reviewed": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                40
            ],
            "delete": [
                40
            ],
            "update": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                46
            ],
            "archiveBefore": [
                46
            ],
            "closesAfter": [
                46
            ],
            "closesBefore": [
                46
            ],
            "codes": [
                84
            ],
            "ids": [
                48
            ],
            "names": [
                84
            ],
            "openNow": [
                40
            ],
            "opensAfter": [
                46
            ],
            "opensBefore": [
                46
            ],
            "__typename": [
                84
            ]
        },
        "PeriodProgram": {
            "actions": [
                69
            ],
            "enabled": [
                40
            ],
            "key": [
                48
            ],
            "navTitle": [
                84
            ],
            "period": [
                65
            ],
            "requirements": [
                70
            ],
            "title": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                43
            ],
            "description": [
                84
            ],
            "enabled": [
                40
            ],
            "key": [
                84
            ],
            "navTitle": [
                84
            ],
            "prompts": [
                71
            ],
            "title": [
                84
            ],
            "type": [
                82
            ],
            "__typename": [
                84
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                43
            ],
            "description": [
                84
            ],
            "key": [
                84
            ],
            "navTitle": [
                84
            ],
            "periodId": [
                84
            ],
            "title": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                46
            ],
            "closeDate": [
                46
            ],
            "code": [
                84
            ],
            "name": [
                84
            ],
            "openDate": [
                46
            ],
            "__typename": [
                84
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                40
            ],
            "key": [
                84
            ],
            "title": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "Program": {
            "key": [
                48
            ],
            "navTitle": [
                84
            ],
            "title": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "ProgramFilters": {
            "keys": [
                84
            ],
            "__typename": [
                84
            ]
        },
        "PromptVisibility": {},
        "Query": {
            "access": [
                0
            ],
            "accessUsers": [
                17,
                {
                    "filter": [
                        19
                    ],
                    "paged": [
                        62
                    ]
                }
            ],
            "appRequestActivity": [
                24,
                {
                    "filters": [
                        25
                    ],
                    "id": [
                        84,
                        "String!"
                    ],
                    "paged": [
                        62
                    ]
                }
            ],
            "appRequestIndexes": [
                49,
                {
                    "categories": [
                        84,
                        "[String!]"
                    ],
                    "for": [
                        28
                    ]
                }
            ],
            "appRequests": [
                22,
                {
                    "filter": [
                        26
                    ],
                    "paged": [
                        62
                    ]
                }
            ],
            "applicationMetrics": [
                35,
                {
                    "filter": [
                        55
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "countAppRequests": [
                52,
                {
                    "filter": [
                        26
                    ]
                }
            ],
            "pageInfo": [
                64
            ],
            "periods": [
                65,
                {
                    "filter": [
                        67
                    ]
                }
            ],
            "programs": [
                74,
                {
                    "filter": [
                        75
                    ]
                }
            ],
            "roles": [
                4,
                {
                    "filter": [
                        5
                    ]
                }
            ],
            "scopes": [
                84
            ],
            "userIndexes": [
                49,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "__typename": [
                84
            ]
        },
        "RequirementPrompt": {
            "actions": [
                79
            ],
            "answered": [
                40
            ],
            "configurationData": [
                53
            ],
            "data": [
                53,
                {
                    "schemaVersion": [
                        84
                    ]
                }
            ],
            "description": [
                84
            ],
            "fetchedData": [
                53,
                {
                    "schemaVersion": [
                        84
                    ]
                }
            ],
            "gatheredConfigData": [
                53
            ],
            "hasSavedData": [
                40
            ],
            "id": [
                48
            ],
            "invalidated": [
                40
            ],
            "invalidatedReason": [
                84
            ],
            "key": [
                84
            ],
            "moot": [
                40
            ],
            "navTitle": [
                84
            ],
            "preloadData": [
                53,
                {
                    "schemaVersion": [
                        84
                    ]
                }
            ],
            "prestage": [
                40
            ],
            "requirement": [
                38
            ],
            "title": [
                84
            ],
            "visibility": [
                76
            ],
            "__typename": [
                84
            ]
        },
        "RequirementPromptActions": {
            "update": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "RequirementPromptFilter": {
            "answered": [
                40
            ],
            "appRequestIds": [
                48
            ],
            "applicationIds": [
                48
            ],
            "ids": [
                48
            ],
            "promptKeys": [
                84
            ],
            "reachable": [
                40
            ],
            "requirementIds": [
                48
            ],
            "__typename": [
                84
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                40
            ],
            "update": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                58
            ],
            "success": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                43
            ],
            "messages": [
                58
            ],
            "success": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "ValidatedNoteResponse": {
            "messages": [
                58
            ],
            "note": [
                60
            ],
            "success": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                58
            ],
            "period": [
                65
            ],
            "success": [
                40
            ],
            "__typename": [
                84
            ]
        },
        "ValidatedResponse": {
            "messages": [
                58
            ],
            "success": [
                40
            ],
            "__typename": [
                84
            ]
        }
    }
}