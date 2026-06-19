export default {
    "scalars": [
        28,
        31,
        32,
        38,
        40,
        41,
        47,
        48,
        49,
        52,
        53,
        54,
        60,
        77,
        82,
        83,
        85
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                41
            ],
            "createAppRequestSelf": [
                41
            ],
            "createPeriod": [
                41
            ],
            "createRole": [
                41
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                41
            ],
            "viewApplicantDashboard": [
                41
            ],
            "viewMetrics": [
                41
            ],
            "viewPeriodManagement": [
                41
            ],
            "viewReviewerInterface": [
                41
            ],
            "viewRoleManagement": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "AccessControl": {
            "description": [
                85
            ],
            "name": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                85
            ],
            "name": [
                85
            ],
            "tags": [
                15
            ],
            "title": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessGrantTag": {
            "category": [
                85
            ],
            "categoryLabel": [
                85
            ],
            "label": [
                85
            ],
            "tag": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessRole": {
            "actions": [
                84
            ],
            "description": [
                85
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                49
            ],
            "name": [
                85
            ],
            "scope": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                85
            ],
            "ids": [
                49
            ],
            "names": [
                85
            ],
            "scopes": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                41
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                85
            ],
            "id": [
                49
            ],
            "tags": [
                3
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                41
            ],
            "update": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                41
            ],
            "controlGroup": [
                85
            ],
            "controls": [
                85
            ],
            "tags": [
                16
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                41
            ],
            "controlGroup": [
                85
            ],
            "controls": [
                85
            ],
            "tags": [
                16
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                47
            ],
            "dateCreated": [
                47
            ],
            "groupName": [
                85
            ],
            "managers": [
                11
            ],
            "roleId": [
                49
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                85
            ],
            "fullname": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleInput": {
            "description": [
                85
            ],
            "groups": [
                85
            ],
            "name": [
                85
            ],
            "scope": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                59
            ],
            "success": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "AccessTag": {
            "label": [
                85
            ],
            "value": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessTagCategory": {
            "category": [
                85
            ],
            "description": [
                85
            ],
            "label": [
                85
            ],
            "listable": [
                41
            ],
            "tags": [
                14
            ],
            "__typename": [
                85
            ]
        },
        "AccessTagInput": {
            "category": [
                85
            ],
            "tag": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessUser": {
            "fullname": [
                85
            ],
            "groups": [
                85
            ],
            "login": [
                49
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                54
            ],
            "roles": [
                4
            ],
            "stillValid": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                49
            ],
            "tags": [
                49
            ],
            "__typename": [
                85
            ]
        },
        "AccessUserFilter": {
            "logins": [
                49
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                85
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                85
            ],
            "search": [
                85
            ],
            "self": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                49
            ],
            "label": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                49
            ],
            "label": [
                85
            ],
            "__typename": [
                85
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
                47
            ],
            "createdAt": [
                47
            ],
            "data": [
                54,
                {
                    "schemaVersion": [
                        85
                    ]
                }
            ],
            "dataVersion": [
                53
            ],
            "id": [
                49
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
                61,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "otherNotes": [
                61,
                {
                    "filter": [
                        30
                    ]
                }
            ],
            "period": [
                66
            ],
            "phase": [
                31
            ],
            "prompt": [
                79,
                {
                    "promptId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "status": [
                32
            ],
            "statusReason": [
                85
            ],
            "submittedAt": [
                47
            ],
            "updatedAt": [
                47
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                41
            ],
            "cancel": [
                41
            ],
            "close": [
                41
            ],
            "completeRequest": [
                41
            ],
            "completeReview": [
                41
            ],
            "createNote": [
                41
            ],
            "createPersistentNote": [
                41
            ],
            "reopen": [
                41
            ],
            "returnToApplicant": [
                41
            ],
            "returnToNonBlocking": [
                41
            ],
            "returnToOffer": [
                41
            ],
            "returnToReview": [
                41
            ],
            "review": [
                41
            ],
            "submit": [
                41
            ],
            "viewAcceptUI": [
                41
            ],
            "viewApplyUI": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestActivity": {
            "action": [
                85
            ],
            "appRequest": [
                22
            ],
            "createdAt": [
                47
            ],
            "data": [
                54
            ],
            "description": [
                85
            ],
            "id": [
                49
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                85
            ],
            "appRequestIds": [
                49
            ],
            "happenedAfter": [
                47
            ],
            "happenedBefore": [
                47
            ],
            "impersonated": [
                41
            ],
            "impersonatedBy": [
                49
            ],
            "impersonatedUsers": [
                49
            ],
            "users": [
                49
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestFilter": {
            "closed": [
                41
            ],
            "closedAfter": [
                47
            ],
            "closedBefore": [
                47
            ],
            "complete": [
                41
            ],
            "createdAfter": [
                47
            ],
            "createdBefore": [
                47
            ],
            "ids": [
                49
            ],
            "indexes": [
                29
            ],
            "logins": [
                49
            ],
            "own": [
                41
            ],
            "periodIds": [
                49
            ],
            "reviewStarted": [
                41
            ],
            "search": [
                85
            ],
            "status": [
                32
            ],
            "submittedAfter": [
                47
            ],
            "submittedBefore": [
                47
            ],
            "updatedAfter": [
                47
            ],
            "updatedBefore": [
                47
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                48
            ],
            "applicantDashboardPriority": [
                48
            ],
            "category": [
                85
            ],
            "categoryLabel": [
                85
            ],
            "listFiltersPriority": [
                48
            ],
            "listable": [
                41
            ],
            "reviewerDashboardPriority": [
                48
            ],
            "values": [
                51
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                85
            ],
            "tags": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                49
            ],
            "applicants": [
                85
            ],
            "ids": [
                49
            ],
            "__typename": [
                85
            ]
        },
        "AppRequestPhase": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                34
            ],
            "id": [
                49
            ],
            "ineligiblePhase": [
                52
            ],
            "navTitle": [
                85
            ],
            "nextWorkflowStage": [
                74
            ],
            "phase": [
                38
            ],
            "previousWorkflowStage": [
                74
            ],
            "programKey": [
                85
            ],
            "requirements": [
                39
            ],
            "status": [
                40
            ],
            "statusReason": [
                85
            ],
            "title": [
                85
            ],
            "workflowStage": [
                74
            ],
            "workflowStages": [
                74
            ],
            "__typename": [
                85
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                41
            ],
            "reverseWorkflow": [
                41
            ],
            "viewAsReviewer": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "ApplicationMetric": {
            "approved": [
                48
            ],
            "closed": [
                48
            ],
            "denied": [
                48
            ],
            "entries": [
                36
            ],
            "started": [
                48
            ],
            "submitted": [
                48
            ],
            "toDecision": [
                37
            ],
            "toSubmit": [
                37
            ],
            "__typename": [
                85
            ]
        },
        "ApplicationMetricEntry": {
            "appRequestId": [
                49
            ],
            "applicantFullname": [
                85
            ],
            "applicantId": [
                49
            ],
            "applicantLogin": [
                85
            ],
            "applicationId": [
                49
            ],
            "closedAt": [
                47
            ],
            "createdAt": [
                47
            ],
            "ineligiblePhase": [
                85
            ],
            "periodCode": [
                85
            ],
            "periodId": [
                49
            ],
            "periodName": [
                85
            ],
            "phase": [
                85
            ],
            "programKey": [
                85
            ],
            "status": [
                85
            ],
            "submittedAt": [
                47
            ],
            "updatedAt": [
                47
            ],
            "__typename": [
                85
            ]
        },
        "ApplicationMetricTiming": {
            "avg": [
                48
            ],
            "max": [
                48
            ],
            "min": [
                48
            ],
            "__typename": [
                85
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                33
            ],
            "configurationData": [
                54
            ],
            "description": [
                85
            ],
            "id": [
                49
            ],
            "key": [
                85
            ],
            "navTitle": [
                85
            ],
            "prompts": [
                79,
                {
                    "filter": [
                        81
                    ]
                }
            ],
            "smartTitle": [
                85
            ],
            "status": [
                82
            ],
            "statusReason": [
                85
            ],
            "title": [
                85
            ],
            "type": [
                83
            ],
            "workflowStage": [
                74
            ],
            "__typename": [
                85
            ]
        },
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                85
            ],
            "label": [
                85
            ],
            "tags": [
                43
            ],
            "useInFilters": [
                41
            ],
            "useInList": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "CategoryTag": {
            "label": [
                85
            ],
            "tag": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "Configuration": {
            "actions": [
                45
            ],
            "data": [
                54
            ],
            "fetchedData": [
                54
            ],
            "key": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "ConfigurationAccess": {
            "update": [
                41
            ],
            "view": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                49
            ],
            "keys": [
                85
            ],
            "periodCodes": [
                85
            ],
            "periodIds": [
                49
            ],
            "__typename": [
                85
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                48
            ],
            "applicantDashboardPriority": [
                48
            ],
            "category": [
                85
            ],
            "categoryLabel": [
                85
            ],
            "listFiltersPriority": [
                48
            ],
            "listable": [
                41
            ],
            "reviewerDashboardPriority": [
                48
            ],
            "values": [
                51,
                {
                    "inUse": [
                        41
                    ],
                    "search": [
                        85
                    ]
                }
            ],
            "__typename": [
                85
            ]
        },
        "IndexValue": {
            "label": [
                85
            ],
            "value": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "MetricAccessUserFilters": {
            "fullnames": [
                85
            ],
            "ids": [
                49
            ],
            "logins": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "MetricApplicationFilters": {
            "applicants": [
                55
            ],
            "applicationIds": [
                49
            ],
            "closedAfterDateTime": [
                47
            ],
            "closedBeforeDateTime": [
                47
            ],
            "periods": [
                57
            ],
            "startedAfterDateTime": [
                47
            ],
            "startedBeforeDateTime": [
                47
            ],
            "submittedAfterDateTime": [
                47
            ],
            "submittedBeforeDateTime": [
                47
            ],
            "__typename": [
                85
            ]
        },
        "MetricPeriodFilters": {
            "codes": [
                85
            ],
            "ids": [
                49
            ],
            "names": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "Mutation": {
            "acceptOffer": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                88,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ],
                    "content": [
                        85,
                        "String!"
                    ],
                    "persistent": [
                        41
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "advanceWorkflow": [
                86,
                {
                    "applicationId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ],
                    "dataVersion": [
                        53
                    ]
                }
            ],
            "closeAppRequest": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "createAppRequest": [
                86,
                {
                    "login": [
                        85,
                        "String!"
                    ],
                    "periodId": [
                        49,
                        "ID!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "createPeriod": [
                89,
                {
                    "copyPeriodId": [
                        85
                    ],
                    "period": [
                        73,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "deleteNote": [
                41,
                {
                    "noteId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "deletePeriod": [
                90,
                {
                    "periodId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                89,
                {
                    "periodId": [
                        49,
                        "ID!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "reopenAppRequest": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "returnToApplicant": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                86,
                {
                    "applicationId": [
                        49,
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
                        49,
                        "ID!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        49
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "roleDelete": [
                90,
                {
                    "roleId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        49,
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
                        49,
                        "ID!"
                    ],
                    "validateOnly": [
                        41
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
                        49,
                        "ID!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "submitAppRequest": [
                86,
                {
                    "appRequestId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "togglePersistence": [
                88,
                {
                    "noteId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "updateConfiguration": [
                87,
                {
                    "data": [
                        54,
                        "JsonData!"
                    ],
                    "key": [
                        85,
                        "String!"
                    ],
                    "periodId": [
                        49,
                        "ID!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "updateNote": [
                88,
                {
                    "content": [
                        85,
                        "String!"
                    ],
                    "noteId": [
                        49,
                        "ID!"
                    ]
                }
            ],
            "updatePeriod": [
                89,
                {
                    "periodId": [
                        49,
                        "ID!"
                    ],
                    "update": [
                        73,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "updatePeriodRequirement": [
                90,
                {
                    "disabled": [
                        41,
                        "Boolean!"
                    ],
                    "periodId": [
                        85,
                        "String!"
                    ],
                    "requirementKey": [
                        85,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                86,
                {
                    "data": [
                        54,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        53
                    ],
                    "promptId": [
                        49,
                        "ID!"
                    ],
                    "validateOnly": [
                        41
                    ]
                }
            ],
            "__typename": [
                85
            ]
        },
        "MutationMessage": {
            "arg": [
                85
            ],
            "message": [
                85
            ],
            "type": [
                60
            ],
            "__typename": [
                85
            ]
        },
        "MutationMessageType": {},
        "Note": {
            "actions": [
                62
            ],
            "appRequest": [
                22
            ],
            "author": [
                17
            ],
            "content": [
                85
            ],
            "createdAt": [
                47
            ],
            "id": [
                49
            ],
            "persistent": [
                41
            ],
            "updatedAt": [
                47
            ],
            "__typename": [
                85
            ]
        },
        "NoteActions": {
            "delete": [
                41
            ],
            "update": [
                41
            ],
            "updatePersistent": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "Pagination": {
            "page": [
                53
            ],
            "perPage": [
                53
            ],
            "__typename": [
                85
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                42
            ],
            "currentPage": [
                48
            ],
            "hasNextPage": [
                41
            ],
            "perPage": [
                48
            ],
            "totalItems": [
                48
            ],
            "__typename": [
                85
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                64
            ],
            "appRequests": [
                64
            ],
            "appRequestsActivity": [
                64
            ],
            "__typename": [
                85
            ]
        },
        "Period": {
            "actions": [
                67
            ],
            "archiveDate": [
                47
            ],
            "closeDate": [
                47
            ],
            "code": [
                85
            ],
            "configurations": [
                44,
                {
                    "filter": [
                        46
                    ]
                }
            ],
            "id": [
                49
            ],
            "name": [
                85
            ],
            "openDate": [
                47
            ],
            "programs": [
                69
            ],
            "prompts": [
                72
            ],
            "requirements": [
                71
            ],
            "reviewed": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                41
            ],
            "delete": [
                41
            ],
            "update": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                47
            ],
            "archiveBefore": [
                47
            ],
            "closesAfter": [
                47
            ],
            "closesBefore": [
                47
            ],
            "codes": [
                85
            ],
            "ids": [
                49
            ],
            "names": [
                85
            ],
            "openNow": [
                41
            ],
            "opensAfter": [
                47
            ],
            "opensBefore": [
                47
            ],
            "__typename": [
                85
            ]
        },
        "PeriodProgram": {
            "actions": [
                70
            ],
            "enabled": [
                41
            ],
            "key": [
                49
            ],
            "navTitle": [
                85
            ],
            "period": [
                66
            ],
            "requirements": [
                71
            ],
            "title": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                44
            ],
            "description": [
                85
            ],
            "enabled": [
                41
            ],
            "key": [
                85
            ],
            "navTitle": [
                85
            ],
            "prompts": [
                72
            ],
            "title": [
                85
            ],
            "type": [
                83
            ],
            "__typename": [
                85
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                44
            ],
            "description": [
                85
            ],
            "key": [
                85
            ],
            "navTitle": [
                85
            ],
            "periodId": [
                85
            ],
            "title": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                47
            ],
            "closeDate": [
                47
            ],
            "code": [
                85
            ],
            "name": [
                85
            ],
            "openDate": [
                47
            ],
            "__typename": [
                85
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                41
            ],
            "key": [
                85
            ],
            "title": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "Program": {
            "key": [
                49
            ],
            "navTitle": [
                85
            ],
            "title": [
                85
            ],
            "__typename": [
                85
            ]
        },
        "ProgramFilters": {
            "keys": [
                85
            ],
            "__typename": [
                85
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
                        63
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
                        85,
                        "String!"
                    ],
                    "paged": [
                        63
                    ]
                }
            ],
            "appRequestIndexes": [
                50,
                {
                    "categories": [
                        85,
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
                        63
                    ]
                }
            ],
            "applicationMetrics": [
                35,
                {
                    "filter": [
                        56
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "countAppRequests": [
                53,
                {
                    "filter": [
                        26
                    ]
                }
            ],
            "pageInfo": [
                65
            ],
            "periods": [
                66,
                {
                    "filter": [
                        68
                    ]
                }
            ],
            "programs": [
                75,
                {
                    "filter": [
                        76
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
                85
            ],
            "userIndexes": [
                50,
                {
                    "for": [
                        28
                    ]
                }
            ],
            "__typename": [
                85
            ]
        },
        "RequirementPrompt": {
            "actions": [
                80
            ],
            "answered": [
                41
            ],
            "configurationData": [
                54
            ],
            "data": [
                54,
                {
                    "schemaVersion": [
                        85
                    ]
                }
            ],
            "description": [
                85
            ],
            "fetchedData": [
                54,
                {
                    "schemaVersion": [
                        85
                    ]
                }
            ],
            "gatheredConfigData": [
                54
            ],
            "hasSavedData": [
                41
            ],
            "id": [
                49
            ],
            "invalidated": [
                41
            ],
            "invalidatedReason": [
                85
            ],
            "key": [
                85
            ],
            "moot": [
                41
            ],
            "navTitle": [
                85
            ],
            "optOut": [
                41
            ],
            "preloadData": [
                54,
                {
                    "schemaVersion": [
                        85
                    ]
                }
            ],
            "prestageData": [
                54,
                {
                    "schemaVersion": [
                        85
                    ]
                }
            ],
            "requirement": [
                39
            ],
            "title": [
                85
            ],
            "visibility": [
                77
            ],
            "__typename": [
                85
            ]
        },
        "RequirementPromptActions": {
            "update": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "RequirementPromptFilter": {
            "answered": [
                41
            ],
            "appRequestIds": [
                49
            ],
            "applicationIds": [
                49
            ],
            "ids": [
                49
            ],
            "promptKeys": [
                85
            ],
            "reachable": [
                41
            ],
            "requirementIds": [
                49
            ],
            "__typename": [
                85
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                41
            ],
            "update": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "String": {},
        "ValidatedAppRequestResponse": {
            "appRequest": [
                22
            ],
            "messages": [
                59
            ],
            "success": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                44
            ],
            "messages": [
                59
            ],
            "success": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "ValidatedNoteResponse": {
            "messages": [
                59
            ],
            "note": [
                61
            ],
            "success": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                59
            ],
            "period": [
                66
            ],
            "success": [
                41
            ],
            "__typename": [
                85
            ]
        },
        "ValidatedResponse": {
            "messages": [
                59
            ],
            "success": [
                41
            ],
            "__typename": [
                85
            ]
        }
    }
}