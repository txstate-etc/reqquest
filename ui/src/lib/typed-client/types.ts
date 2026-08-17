export default {
    "scalars": [
        28,
        31,
        32,
        38,
        40,
        41,
        42,
        48,
        49,
        50,
        53,
        54,
        55,
        61,
        78,
        83,
        84,
        86
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                42
            ],
            "createAppRequestSelf": [
                42
            ],
            "createPeriod": [
                42
            ],
            "createRole": [
                42
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                42
            ],
            "viewApplicantDashboard": [
                42
            ],
            "viewMetrics": [
                42
            ],
            "viewPeriodManagement": [
                42
            ],
            "viewReviewerInterface": [
                42
            ],
            "viewRoleManagement": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "AccessControl": {
            "description": [
                86
            ],
            "name": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                86
            ],
            "name": [
                86
            ],
            "tags": [
                15
            ],
            "title": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessGrantTag": {
            "category": [
                86
            ],
            "categoryLabel": [
                86
            ],
            "label": [
                86
            ],
            "tag": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessRole": {
            "actions": [
                85
            ],
            "description": [
                86
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                50
            ],
            "name": [
                86
            ],
            "scope": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                86
            ],
            "ids": [
                50
            ],
            "names": [
                86
            ],
            "scopes": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                42
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                86
            ],
            "id": [
                50
            ],
            "tags": [
                3
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                42
            ],
            "update": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                42
            ],
            "controlGroup": [
                86
            ],
            "controls": [
                86
            ],
            "tags": [
                16
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                42
            ],
            "controlGroup": [
                86
            ],
            "controls": [
                86
            ],
            "tags": [
                16
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                48
            ],
            "dateCreated": [
                48
            ],
            "groupName": [
                86
            ],
            "managers": [
                11
            ],
            "roleId": [
                50
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                86
            ],
            "fullname": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleInput": {
            "description": [
                86
            ],
            "groups": [
                86
            ],
            "name": [
                86
            ],
            "scope": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                60
            ],
            "success": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "AccessTag": {
            "label": [
                86
            ],
            "value": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessTagCategory": {
            "category": [
                86
            ],
            "description": [
                86
            ],
            "label": [
                86
            ],
            "listable": [
                42
            ],
            "tags": [
                14
            ],
            "__typename": [
                86
            ]
        },
        "AccessTagInput": {
            "category": [
                86
            ],
            "tag": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessUser": {
            "email": [
                86
            ],
            "fullname": [
                86
            ],
            "groups": [
                86
            ],
            "login": [
                50
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                55
            ],
            "roles": [
                4
            ],
            "stillValid": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                50
            ],
            "tags": [
                50
            ],
            "__typename": [
                86
            ]
        },
        "AccessUserFilter": {
            "logins": [
                50
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                86
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                86
            ],
            "search": [
                86
            ],
            "self": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                50
            ],
            "label": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                50
            ],
            "label": [
                86
            ],
            "__typename": [
                86
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
            "awaitingCorrection": [
                42
            ],
            "closedAt": [
                48
            ],
            "createdAt": [
                48
            ],
            "data": [
                55,
                {
                    "schemaVersion": [
                        86
                    ]
                }
            ],
            "dataVersion": [
                54
            ],
            "id": [
                50
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
                62,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "otherNotes": [
                62,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "period": [
                67
            ],
            "phase": [
                31
            ],
            "prompt": [
                80,
                {
                    "promptId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "status": [
                32
            ],
            "statusReason": [
                86
            ],
            "submittedAt": [
                48
            ],
            "updatedAt": [
                48
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                42
            ],
            "cancel": [
                42
            ],
            "close": [
                42
            ],
            "completeRequest": [
                42
            ],
            "completeReview": [
                42
            ],
            "createNote": [
                42
            ],
            "createPersistentNote": [
                42
            ],
            "reopen": [
                42
            ],
            "returnToApplicant": [
                42
            ],
            "returnToNonBlocking": [
                42
            ],
            "returnToOffer": [
                42
            ],
            "returnToReview": [
                42
            ],
            "review": [
                42
            ],
            "submit": [
                42
            ],
            "viewAcceptUI": [
                42
            ],
            "viewApplyUI": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestActivity": {
            "action": [
                86
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                48
            ],
            "data": [
                55
            ],
            "description": [
                86
            ],
            "id": [
                50
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                86
            ],
            "appRequestIds": [
                50
            ],
            "happenedAfter": [
                48
            ],
            "happenedBefore": [
                48
            ],
            "impersonated": [
                42
            ],
            "impersonatedBy": [
                50
            ],
            "impersonatedUsers": [
                50
            ],
            "search": [
                86
            ],
            "users": [
                50
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestFilter": {
            "closed": [
                42
            ],
            "closedAfter": [
                48
            ],
            "closedBefore": [
                48
            ],
            "complete": [
                42
            ],
            "createdAfter": [
                48
            ],
            "createdBefore": [
                48
            ],
            "ids": [
                50
            ],
            "indexes": [
                29
            ],
            "logins": [
                50
            ],
            "own": [
                42
            ],
            "periodIds": [
                50
            ],
            "rescindedStatus": [
                40
            ],
            "reviewStarted": [
                42
            ],
            "search": [
                86
            ],
            "status": [
                32
            ],
            "submittedAfter": [
                48
            ],
            "submittedBefore": [
                48
            ],
            "updatedAfter": [
                48
            ],
            "updatedBefore": [
                48
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                49
            ],
            "applicantDashboardPriority": [
                49
            ],
            "category": [
                86
            ],
            "categoryLabel": [
                86
            ],
            "listFiltersPriority": [
                49
            ],
            "listable": [
                42
            ],
            "reviewerDashboardPriority": [
                49
            ],
            "values": [
                52
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                86
            ],
            "tags": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                50
            ],
            "applicants": [
                86
            ],
            "ids": [
                50
            ],
            "__typename": [
                86
            ]
        },
        "AppRequestPhase": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                34
            ],
            "applicantDescription": [
                86
            ],
            "awaitingCorrection": [
                42
            ],
            "eligibilityDescription": [
                86
            ],
            "id": [
                50
            ],
            "ineligiblePhase": [
                53
            ],
            "navTitle": [
                86
            ],
            "nextWorkflowStage": [
                75
            ],
            "phase": [
                38
            ],
            "previousWorkflowStage": [
                75
            ],
            "programKey": [
                86
            ],
            "requirements": [
                39
            ],
            "rescindedReason": [
                86
            ],
            "rescindedStatus": [
                40
            ],
            "restoredReason": [
                86
            ],
            "status": [
                41
            ],
            "statusReason": [
                86
            ],
            "title": [
                86
            ],
            "workflowStage": [
                75
            ],
            "workflowStages": [
                75
            ],
            "__typename": [
                86
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                42
            ],
            "rescindApplication": [
                42
            ],
            "restoreApplication": [
                42
            ],
            "reverseWorkflow": [
                42
            ],
            "viewAsReviewer": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "ApplicationMetric": {
            "approved": [
                49
            ],
            "closed": [
                49
            ],
            "denied": [
                49
            ],
            "entries": [
                36
            ],
            "rescinded": [
                49
            ],
            "started": [
                49
            ],
            "submitted": [
                49
            ],
            "toDecision": [
                37
            ],
            "toSubmit": [
                37
            ],
            "__typename": [
                86
            ]
        },
        "ApplicationMetricEntry": {
            "appRequestId": [
                50
            ],
            "applicantFullname": [
                86
            ],
            "applicantId": [
                50
            ],
            "applicantLogin": [
                86
            ],
            "applicationId": [
                50
            ],
            "closedAt": [
                48
            ],
            "createdAt": [
                48
            ],
            "ineligiblePhase": [
                86
            ],
            "periodCode": [
                86
            ],
            "periodId": [
                50
            ],
            "periodName": [
                86
            ],
            "phase": [
                86
            ],
            "programKey": [
                86
            ],
            "status": [
                86
            ],
            "submittedAt": [
                48
            ],
            "updatedAt": [
                48
            ],
            "__typename": [
                86
            ]
        },
        "ApplicationMetricTiming": {
            "avg": [
                49
            ],
            "max": [
                49
            ],
            "min": [
                49
            ],
            "__typename": [
                86
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                33
            ],
            "configurationData": [
                55
            ],
            "description": [
                86
            ],
            "id": [
                50
            ],
            "key": [
                86
            ],
            "navTitle": [
                86
            ],
            "prompts": [
                80,
                {
                    "filter": [
                        82
                    ]
                }
            ],
            "smartTitle": [
                86
            ],
            "status": [
                83
            ],
            "statusReason": [
                86
            ],
            "title": [
                86
            ],
            "type": [
                84
            ],
            "workflowStage": [
                75
            ],
            "__typename": [
                86
            ]
        },
        "ApplicationRescindedStatus": {},
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                86
            ],
            "label": [
                86
            ],
            "tags": [
                44
            ],
            "useInFilters": [
                42
            ],
            "useInList": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "CategoryTag": {
            "label": [
                86
            ],
            "tag": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "Configuration": {
            "actions": [
                46
            ],
            "data": [
                55
            ],
            "fetchedData": [
                55
            ],
            "key": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "ConfigurationAccess": {
            "update": [
                42
            ],
            "view": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                50
            ],
            "keys": [
                86
            ],
            "periodCodes": [
                86
            ],
            "periodIds": [
                50
            ],
            "__typename": [
                86
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                49
            ],
            "applicantDashboardPriority": [
                49
            ],
            "category": [
                86
            ],
            "categoryLabel": [
                86
            ],
            "listFiltersPriority": [
                49
            ],
            "listable": [
                42
            ],
            "reviewerDashboardPriority": [
                49
            ],
            "values": [
                52,
                {
                    "inUse": [
                        42
                    ],
                    "search": [
                        86
                    ]
                }
            ],
            "__typename": [
                86
            ]
        },
        "IndexValue": {
            "label": [
                86
            ],
            "value": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "MetricAccessUserFilters": {
            "fullnames": [
                86
            ],
            "ids": [
                50
            ],
            "logins": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "MetricApplicationFilters": {
            "applicants": [
                56
            ],
            "applicationIds": [
                50
            ],
            "closedAfterDateTime": [
                48
            ],
            "closedBeforeDateTime": [
                48
            ],
            "periods": [
                58
            ],
            "startedAfterDateTime": [
                48
            ],
            "startedBeforeDateTime": [
                48
            ],
            "submittedAfterDateTime": [
                48
            ],
            "submittedBeforeDateTime": [
                48
            ],
            "__typename": [
                86
            ]
        },
        "MetricPeriodFilters": {
            "codes": [
                86
            ],
            "ids": [
                50
            ],
            "names": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "Mutation": {
            "acceptOffer": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                89,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ],
                    "content": [
                        86,
                        "String!"
                    ],
                    "persistent": [
                        42
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "advanceWorkflow": [
                87,
                {
                    "applicationId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ],
                    "dataVersion": [
                        54
                    ]
                }
            ],
            "closeAppRequest": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                87,
                {
                    "login": [
                        86,
                        "String!"
                    ],
                    "periodId": [
                        50,
                        "ID!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "createPeriod": [
                90,
                {
                    "copyPeriodId": [
                        86
                    ],
                    "period": [
                        74,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "deleteNote": [
                42,
                {
                    "noteId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "deletePeriod": [
                91,
                {
                    "periodId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                90,
                {
                    "periodId": [
                        50,
                        "ID!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "reopenAppRequest": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "rescind": [
                87,
                {
                    "applicationId": [
                        50,
                        "ID!"
                    ],
                    "reason": [
                        86,
                        "String!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "restore": [
                87,
                {
                    "applicationId": [
                        50,
                        "ID!"
                    ],
                    "reason": [
                        86,
                        "String!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "returnToApplicant": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                87,
                {
                    "applicationId": [
                        50,
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
                        50,
                        "ID!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        50
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "roleDelete": [
                91,
                {
                    "roleId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        50,
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
                        50,
                        "ID!"
                    ],
                    "validateOnly": [
                        42
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
                        50,
                        "ID!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "submitAppRequest": [
                87,
                {
                    "appRequestId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "togglePersistence": [
                89,
                {
                    "noteId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                88,
                {
                    "data": [
                        55,
                        "JsonData!"
                    ],
                    "key": [
                        86,
                        "String!"
                    ],
                    "periodId": [
                        50,
                        "ID!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "updateNote": [
                89,
                {
                    "content": [
                        86,
                        "String!"
                    ],
                    "noteId": [
                        50,
                        "ID!"
                    ]
                }
            ],
            "updatePeriod": [
                90,
                {
                    "periodId": [
                        50,
                        "ID!"
                    ],
                    "update": [
                        74,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "updatePeriodRequirement": [
                91,
                {
                    "disabled": [
                        42,
                        "Boolean!"
                    ],
                    "periodId": [
                        86,
                        "String!"
                    ],
                    "requirementKey": [
                        86,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                87,
                {
                    "data": [
                        55,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        54
                    ],
                    "overrideInvalidated": [
                        42
                    ],
                    "promptId": [
                        50,
                        "ID!"
                    ],
                    "validateOnly": [
                        42
                    ]
                }
            ],
            "__typename": [
                86
            ]
        },
        "MutationMessage": {
            "arg": [
                86
            ],
            "message": [
                86
            ],
            "type": [
                61
            ],
            "__typename": [
                86
            ]
        },
        "MutationMessageType": {},
        "Note": {
            "actions": [
                63
            ],
            "appRequest": [
                22
            ],
            "author": [
                17
            ],
            "content": [
                86
            ],
            "createdAt": [
                48
            ],
            "id": [
                50
            ],
            "persistent": [
                42
            ],
            "updatedAt": [
                48
            ],
            "__typename": [
                86
            ]
        },
        "NoteActions": {
            "delete": [
                42
            ],
            "update": [
                42
            ],
            "updatePersistent": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "Pagination": {
            "page": [
                54
            ],
            "perPage": [
                54
            ],
            "__typename": [
                86
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                43
            ],
            "currentPage": [
                49
            ],
            "hasNextPage": [
                42
            ],
            "perPage": [
                49
            ],
            "totalItems": [
                49
            ],
            "__typename": [
                86
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                65
            ],
            "appRequests": [
                65
            ],
            "appRequestsActivity": [
                65
            ],
            "__typename": [
                86
            ]
        },
        "Period": {
            "actions": [
                68
            ],
            "archiveDate": [
                48
            ],
            "closeDate": [
                48
            ],
            "code": [
                86
            ],
            "configurations": [
                45,
                {
                    "filter": [
                        47
                    ]
                }
            ],
            "id": [
                50
            ],
            "name": [
                86
            ],
            "openDate": [
                48
            ],
            "programs": [
                70
            ],
            "prompts": [
                73
            ],
            "requirements": [
                72
            ],
            "reviewed": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                42
            ],
            "delete": [
                42
            ],
            "update": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                48
            ],
            "archiveBefore": [
                48
            ],
            "closesAfter": [
                48
            ],
            "closesBefore": [
                48
            ],
            "codes": [
                86
            ],
            "ids": [
                50
            ],
            "names": [
                86
            ],
            "openNow": [
                42
            ],
            "opensAfter": [
                48
            ],
            "opensBefore": [
                48
            ],
            "__typename": [
                86
            ]
        },
        "PeriodProgram": {
            "actions": [
                71
            ],
            "applicantDescription": [
                86
            ],
            "eligibilityDescription": [
                86
            ],
            "enabled": [
                42
            ],
            "key": [
                50
            ],
            "navTitle": [
                86
            ],
            "period": [
                67
            ],
            "requirements": [
                72
            ],
            "title": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                45
            ],
            "description": [
                86
            ],
            "enabled": [
                42
            ],
            "key": [
                86
            ],
            "navTitle": [
                86
            ],
            "prompts": [
                73
            ],
            "title": [
                86
            ],
            "type": [
                84
            ],
            "__typename": [
                86
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                45
            ],
            "description": [
                86
            ],
            "key": [
                86
            ],
            "navTitle": [
                86
            ],
            "periodId": [
                86
            ],
            "title": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                48
            ],
            "closeDate": [
                48
            ],
            "code": [
                86
            ],
            "name": [
                86
            ],
            "openDate": [
                48
            ],
            "__typename": [
                86
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                42
            ],
            "key": [
                86
            ],
            "title": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "Program": {
            "applicantDescription": [
                86
            ],
            "eligibilityDescription": [
                86
            ],
            "key": [
                50
            ],
            "navTitle": [
                86
            ],
            "title": [
                86
            ],
            "__typename": [
                86
            ]
        },
        "ProgramFilters": {
            "keys": [
                86
            ],
            "__typename": [
                86
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
                        64
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
                        86,
                        "String!"
                    ],
                    "paged": [
                        64
                    ]
                }
            ],
            "appRequestIndexes": [
                51,
                {
                    "categories": [
                        86,
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
                        64
                    ]
                }
            ],
            "applicationMetrics": [
                35,
                {
                    "filter": [
                        57
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "countAppRequests": [
                54,
                {
                    "filter": [
                        26
                    ]
                }
            ],
            "pageInfo": [
                66
            ],
            "periods": [
                67,
                {
                    "filter": [
                        69
                    ]
                }
            ],
            "programs": [
                76,
                {
                    "filter": [
                        77
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
                86
            ],
            "userIndexes": [
                51,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "__typename": [
                86
            ]
        },
        "RequirementPrompt": {
            "actions": [
                81
            ],
            "answered": [
                42
            ],
            "configurationData": [
                55
            ],
            "data": [
                55,
                {
                    "schemaVersion": [
                        86
                    ]
                }
            ],
            "description": [
                86
            ],
            "fetchedData": [
                55,
                {
                    "schemaVersion": [
                        86
                    ]
                }
            ],
            "gatheredConfigData": [
                55
            ],
            "hasSavedData": [
                42
            ],
            "id": [
                50
            ],
            "invalidated": [
                42
            ],
            "invalidatedReason": [
                86
            ],
            "key": [
                86
            ],
            "moot": [
                42
            ],
            "navTitle": [
                86
            ],
            "optOut": [
                42
            ],
            "preloadData": [
                55,
                {
                    "schemaVersion": [
                        86
                    ]
                }
            ],
            "prestageData": [
                55,
                {
                    "schemaVersion": [
                        86
                    ]
                }
            ],
            "requirement": [
                39
            ],
            "title": [
                86
            ],
            "visibility": [
                78
            ],
            "__typename": [
                86
            ]
        },
        "RequirementPromptActions": {
            "update": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "RequirementPromptFilter": {
            "answered": [
                42
            ],
            "appRequestIds": [
                50
            ],
            "applicationIds": [
                50
            ],
            "ids": [
                50
            ],
            "promptKeys": [
                86
            ],
            "reachable": [
                42
            ],
            "requirementIds": [
                50
            ],
            "__typename": [
                86
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                42
            ],
            "update": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                60
            ],
            "success": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                45
            ],
            "messages": [
                60
            ],
            "success": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "ValidatedNoteResponse": {
            "messages": [
                60
            ],
            "note": [
                62
            ],
            "success": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                60
            ],
            "period": [
                67
            ],
            "success": [
                42
            ],
            "__typename": [
                86
            ]
        },
        "ValidatedResponse": {
            "messages": [
                60
            ],
            "success": [
                42
            ],
            "__typename": [
                86
            ]
        }
    }
}