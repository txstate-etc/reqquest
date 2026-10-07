export default {
    "scalars": [
        31,
        34,
        35,
        41,
        43,
        44,
        46,
        52,
        53,
        54,
        57,
        58,
        59,
        65,
        82,
        87,
        88,
        90
    ],
    "types": {
        "Access": {
            "createAppRequestOther": [
                46
            ],
            "createAppRequestSelf": [
                46
            ],
            "createPeriod": [
                46
            ],
            "createRole": [
                46
            ],
            "manageAnnouncements": [
                46
            ],
            "user": [
                17
            ],
            "viewAnnouncementManagement": [
                46
            ],
            "viewAppRequestList": [
                46
            ],
            "viewApplicantDashboard": [
                46
            ],
            "viewMetrics": [
                46
            ],
            "viewPeriodManagement": [
                46
            ],
            "viewReviewerInterface": [
                46
            ],
            "viewRoleManagement": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "AccessControl": {
            "description": [
                90
            ],
            "name": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                90
            ],
            "name": [
                90
            ],
            "tags": [
                15
            ],
            "title": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessGrantTag": {
            "category": [
                90
            ],
            "categoryLabel": [
                90
            ],
            "label": [
                90
            ],
            "tag": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessRole": {
            "actions": [
                89
            ],
            "description": [
                90
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                54
            ],
            "name": [
                90
            ],
            "scope": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                90
            ],
            "ids": [
                54
            ],
            "names": [
                90
            ],
            "scopes": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                46
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                90
            ],
            "id": [
                54
            ],
            "tags": [
                3
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                46
            ],
            "update": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                46
            ],
            "controlGroup": [
                90
            ],
            "controls": [
                90
            ],
            "tags": [
                16
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                46
            ],
            "controlGroup": [
                90
            ],
            "controls": [
                90
            ],
            "tags": [
                16
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                52
            ],
            "dateCreated": [
                52
            ],
            "groupName": [
                90
            ],
            "managers": [
                11
            ],
            "roleId": [
                54
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                90
            ],
            "fullname": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleInput": {
            "description": [
                90
            ],
            "groups": [
                90
            ],
            "name": [
                90
            ],
            "scope": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                64
            ],
            "success": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "AccessTag": {
            "label": [
                90
            ],
            "value": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessTagCategory": {
            "category": [
                90
            ],
            "description": [
                90
            ],
            "label": [
                90
            ],
            "listable": [
                46
            ],
            "tags": [
                14
            ],
            "__typename": [
                90
            ]
        },
        "AccessTagInput": {
            "category": [
                90
            ],
            "tag": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessUser": {
            "email": [
                90
            ],
            "fullname": [
                90
            ],
            "groups": [
                90
            ],
            "login": [
                54
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                59
            ],
            "roles": [
                4
            ],
            "stillValid": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                54
            ],
            "tags": [
                54
            ],
            "__typename": [
                90
            ]
        },
        "AccessUserFilter": {
            "logins": [
                54
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                90
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                90
            ],
            "search": [
                90
            ],
            "self": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                54
            ],
            "label": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                54
            ],
            "label": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "Announcement": {
            "body": [
                90
            ],
            "enabled": [
                46
            ],
            "end": [
                52
            ],
            "id": [
                54
            ],
            "isActive": [
                46
            ],
            "link": [
                90
            ],
            "linkText": [
                90
            ],
            "start": [
                52
            ],
            "subject": [
                90
            ],
            "type": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AnnouncementFilters": {
            "active": [
                46
            ],
            "enabled": [
                46
            ],
            "ids": [
                54
            ],
            "__typename": [
                90
            ]
        },
        "AnnouncementUpdate": {
            "body": [
                90
            ],
            "enabled": [
                46
            ],
            "end": [
                52
            ],
            "link": [
                90
            ],
            "linkText": [
                90
            ],
            "start": [
                52
            ],
            "subject": [
                90
            ],
            "type": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AppRequest": {
            "actions": [
                26
            ],
            "applicant": [
                17
            ],
            "applications": [
                36
            ],
            "awaitingCorrection": [
                46
            ],
            "closedAt": [
                52
            ],
            "createdAt": [
                52
            ],
            "data": [
                59,
                {
                    "schemaVersion": [
                        90
                    ]
                }
            ],
            "dataVersion": [
                58
            ],
            "id": [
                54
            ],
            "indexCategories": [
                30,
                {
                    "for": [
                        31
                    ]
                }
            ],
            "notes": [
                66,
                {
                    "filter": [
                        33
                    ]
                }
            ],
            "otherNotes": [
                66,
                {
                    "filter": [
                        33
                    ]
                }
            ],
            "period": [
                71
            ],
            "phase": [
                34
            ],
            "prompt": [
                84,
                {
                    "promptId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "status": [
                35
            ],
            "statusReason": [
                90
            ],
            "submittedAt": [
                52
            ],
            "updatedAt": [
                52
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                46
            ],
            "cancel": [
                46
            ],
            "close": [
                46
            ],
            "completeRequest": [
                46
            ],
            "completeReview": [
                46
            ],
            "createNote": [
                46
            ],
            "createPersistentNote": [
                46
            ],
            "reopen": [
                46
            ],
            "returnToApplicant": [
                46
            ],
            "returnToNonBlocking": [
                46
            ],
            "returnToOffer": [
                46
            ],
            "returnToReview": [
                46
            ],
            "review": [
                46
            ],
            "submit": [
                46
            ],
            "viewAcceptUI": [
                46
            ],
            "viewApplyUI": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestActivity": {
            "action": [
                90
            ],
            "appRequest": [
                25
            ],
            "createdAt": [
                52
            ],
            "data": [
                59
            ],
            "description": [
                90
            ],
            "id": [
                54
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                90
            ],
            "appRequestIds": [
                54
            ],
            "happenedAfter": [
                52
            ],
            "happenedBefore": [
                52
            ],
            "impersonated": [
                46
            ],
            "impersonatedBy": [
                54
            ],
            "impersonatedUsers": [
                54
            ],
            "search": [
                90
            ],
            "users": [
                54
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestFilter": {
            "applicationStatuses": [
                45
            ],
            "closed": [
                46
            ],
            "closedAfter": [
                52
            ],
            "closedBefore": [
                52
            ],
            "complete": [
                46
            ],
            "createdAfter": [
                52
            ],
            "createdBefore": [
                52
            ],
            "ids": [
                54
            ],
            "indexes": [
                32
            ],
            "logins": [
                54
            ],
            "own": [
                46
            ],
            "periodIds": [
                54
            ],
            "programKeys": [
                54
            ],
            "rescindedStatus": [
                43
            ],
            "reviewStarted": [
                46
            ],
            "search": [
                90
            ],
            "status": [
                35
            ],
            "submittedAfter": [
                52
            ],
            "submittedBefore": [
                52
            ],
            "updatedAfter": [
                52
            ],
            "updatedBefore": [
                52
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                53
            ],
            "applicantDashboardPriority": [
                53
            ],
            "category": [
                90
            ],
            "categoryLabel": [
                90
            ],
            "listFiltersPriority": [
                53
            ],
            "listable": [
                46
            ],
            "reviewerDashboardPriority": [
                53
            ],
            "values": [
                56
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                90
            ],
            "tags": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                54
            ],
            "applicants": [
                90
            ],
            "ids": [
                54
            ],
            "__typename": [
                90
            ]
        },
        "AppRequestPhase": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                37
            ],
            "applicantDescription": [
                90
            ],
            "awaitingCorrection": [
                46
            ],
            "eligibilityDescription": [
                90
            ],
            "id": [
                54
            ],
            "ineligiblePhase": [
                57
            ],
            "navTitle": [
                90
            ],
            "nextWorkflowStage": [
                79
            ],
            "phase": [
                41
            ],
            "previousWorkflowStage": [
                79
            ],
            "programKey": [
                90
            ],
            "requirements": [
                42
            ],
            "rescindedReason": [
                90
            ],
            "rescindedStatus": [
                43
            ],
            "restoredReason": [
                90
            ],
            "status": [
                44
            ],
            "statusReason": [
                90
            ],
            "title": [
                90
            ],
            "workflowStage": [
                79
            ],
            "workflowStages": [
                79
            ],
            "__typename": [
                90
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                46
            ],
            "rescindApplication": [
                46
            ],
            "restoreApplication": [
                46
            ],
            "reverseWorkflow": [
                46
            ],
            "viewAsReviewer": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "ApplicationMetric": {
            "approved": [
                53
            ],
            "closed": [
                53
            ],
            "denied": [
                53
            ],
            "entries": [
                39
            ],
            "rescinded": [
                53
            ],
            "started": [
                53
            ],
            "submitted": [
                53
            ],
            "toDecision": [
                40
            ],
            "toSubmit": [
                40
            ],
            "__typename": [
                90
            ]
        },
        "ApplicationMetricEntry": {
            "appRequestId": [
                54
            ],
            "applicantFullname": [
                90
            ],
            "applicantId": [
                54
            ],
            "applicantLogin": [
                90
            ],
            "applicationId": [
                54
            ],
            "closedAt": [
                52
            ],
            "createdAt": [
                52
            ],
            "ineligiblePhase": [
                90
            ],
            "periodCode": [
                90
            ],
            "periodId": [
                54
            ],
            "periodName": [
                90
            ],
            "phase": [
                90
            ],
            "programKey": [
                90
            ],
            "status": [
                90
            ],
            "submittedAt": [
                52
            ],
            "updatedAt": [
                52
            ],
            "__typename": [
                90
            ]
        },
        "ApplicationMetricTiming": {
            "avg": [
                53
            ],
            "max": [
                53
            ],
            "min": [
                53
            ],
            "__typename": [
                90
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                36
            ],
            "blame": [
                90
            ],
            "configurationData": [
                59
            ],
            "description": [
                90
            ],
            "id": [
                54
            ],
            "key": [
                90
            ],
            "navTitle": [
                90
            ],
            "prompts": [
                84,
                {
                    "filter": [
                        86
                    ]
                }
            ],
            "smartTitle": [
                90
            ],
            "status": [
                87
            ],
            "statusReason": [
                90
            ],
            "title": [
                90
            ],
            "type": [
                88
            ],
            "workflowStage": [
                79
            ],
            "__typename": [
                90
            ]
        },
        "ApplicationRescindedStatus": {},
        "ApplicationStatus": {},
        "ApplicationStatusFilter": {
            "rescindedStatus": [
                43
            ],
            "status": [
                44
            ],
            "__typename": [
                90
            ]
        },
        "Boolean": {},
        "Category": {
            "category": [
                90
            ],
            "label": [
                90
            ],
            "tags": [
                48
            ],
            "useInFilters": [
                46
            ],
            "useInList": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "CategoryTag": {
            "label": [
                90
            ],
            "tag": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "Configuration": {
            "actions": [
                50
            ],
            "data": [
                59
            ],
            "fetchedData": [
                59
            ],
            "key": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "ConfigurationAccess": {
            "update": [
                46
            ],
            "view": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                54
            ],
            "keys": [
                90
            ],
            "periodCodes": [
                90
            ],
            "periodIds": [
                54
            ],
            "__typename": [
                90
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                53
            ],
            "applicantDashboardPriority": [
                53
            ],
            "category": [
                90
            ],
            "categoryLabel": [
                90
            ],
            "listFiltersPriority": [
                53
            ],
            "listable": [
                46
            ],
            "reviewerDashboardPriority": [
                53
            ],
            "values": [
                56,
                {
                    "inUse": [
                        46
                    ],
                    "search": [
                        90
                    ]
                }
            ],
            "__typename": [
                90
            ]
        },
        "IndexValue": {
            "label": [
                90
            ],
            "value": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "MetricAccessUserFilters": {
            "fullnames": [
                90
            ],
            "ids": [
                54
            ],
            "logins": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "MetricApplicationFilters": {
            "applicants": [
                60
            ],
            "applicationIds": [
                54
            ],
            "closedAfterDateTime": [
                52
            ],
            "closedBeforeDateTime": [
                52
            ],
            "periods": [
                62
            ],
            "startedAfterDateTime": [
                52
            ],
            "startedBeforeDateTime": [
                52
            ],
            "submittedAfterDateTime": [
                52
            ],
            "submittedBeforeDateTime": [
                52
            ],
            "__typename": [
                90
            ]
        },
        "MetricPeriodFilters": {
            "codes": [
                90
            ],
            "ids": [
                54
            ],
            "names": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "Mutation": {
            "acceptOffer": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                94,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ],
                    "content": [
                        90,
                        "String!"
                    ],
                    "persistent": [
                        46
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "advanceWorkflow": [
                92,
                {
                    "applicationId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ],
                    "dataVersion": [
                        58
                    ]
                }
            ],
            "closeAppRequest": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "createAnnouncement": [
                91,
                {
                    "announcement": [
                        24,
                        "AnnouncementUpdate!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "createAppRequest": [
                92,
                {
                    "login": [
                        90,
                        "String!"
                    ],
                    "periodId": [
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "createPeriod": [
                95,
                {
                    "copyPeriodId": [
                        90
                    ],
                    "period": [
                        78,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "deleteAnnouncement": [
                96,
                {
                    "announcementId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "deleteNote": [
                46,
                {
                    "noteId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "deletePeriod": [
                96,
                {
                    "periodId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                95,
                {
                    "periodId": [
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "reopenAppRequest": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "rescind": [
                92,
                {
                    "applicationId": [
                        54,
                        "ID!"
                    ],
                    "reason": [
                        90,
                        "String!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "restore": [
                92,
                {
                    "applicationId": [
                        54,
                        "ID!"
                    ],
                    "reason": [
                        90,
                        "String!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "returnToApplicant": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                92,
                {
                    "applicationId": [
                        54,
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
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        54
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "roleDelete": [
                96,
                {
                    "roleId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        54,
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
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
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
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "submitAppRequest": [
                92,
                {
                    "appRequestId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "togglePersistence": [
                94,
                {
                    "noteId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "updateAnnouncement": [
                91,
                {
                    "announcement": [
                        24,
                        "AnnouncementUpdate!"
                    ],
                    "announcementId": [
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "updateConfiguration": [
                93,
                {
                    "data": [
                        59,
                        "JsonData!"
                    ],
                    "key": [
                        90,
                        "String!"
                    ],
                    "periodId": [
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "updateNote": [
                94,
                {
                    "content": [
                        90,
                        "String!"
                    ],
                    "noteId": [
                        54,
                        "ID!"
                    ]
                }
            ],
            "updatePeriod": [
                95,
                {
                    "periodId": [
                        54,
                        "ID!"
                    ],
                    "update": [
                        78,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "updatePeriodRequirement": [
                96,
                {
                    "disabled": [
                        46,
                        "Boolean!"
                    ],
                    "periodId": [
                        90,
                        "String!"
                    ],
                    "requirementKey": [
                        90,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                92,
                {
                    "data": [
                        59,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        58
                    ],
                    "overrideInvalidated": [
                        46
                    ],
                    "promptId": [
                        54,
                        "ID!"
                    ],
                    "validateOnly": [
                        46
                    ]
                }
            ],
            "__typename": [
                90
            ]
        },
        "MutationMessage": {
            "arg": [
                90
            ],
            "message": [
                90
            ],
            "type": [
                65
            ],
            "__typename": [
                90
            ]
        },
        "MutationMessageType": {},
        "Note": {
            "actions": [
                67
            ],
            "appRequest": [
                25
            ],
            "author": [
                17
            ],
            "content": [
                90
            ],
            "createdAt": [
                52
            ],
            "id": [
                54
            ],
            "persistent": [
                46
            ],
            "updatedAt": [
                52
            ],
            "__typename": [
                90
            ]
        },
        "NoteActions": {
            "delete": [
                46
            ],
            "update": [
                46
            ],
            "updatePersistent": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "Pagination": {
            "page": [
                58
            ],
            "perPage": [
                58
            ],
            "__typename": [
                90
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                47
            ],
            "currentPage": [
                53
            ],
            "hasNextPage": [
                46
            ],
            "perPage": [
                53
            ],
            "totalItems": [
                53
            ],
            "__typename": [
                90
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                69
            ],
            "appRequests": [
                69
            ],
            "appRequestsActivity": [
                69
            ],
            "__typename": [
                90
            ]
        },
        "Period": {
            "actions": [
                72
            ],
            "archiveDate": [
                52
            ],
            "closeDate": [
                52
            ],
            "code": [
                90
            ],
            "configurations": [
                49,
                {
                    "filter": [
                        51
                    ]
                }
            ],
            "id": [
                54
            ],
            "name": [
                90
            ],
            "openDate": [
                52
            ],
            "programs": [
                74
            ],
            "prompts": [
                77
            ],
            "requirements": [
                76
            ],
            "reviewed": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                46
            ],
            "delete": [
                46
            ],
            "update": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                52
            ],
            "archiveBefore": [
                52
            ],
            "closesAfter": [
                52
            ],
            "closesBefore": [
                52
            ],
            "codes": [
                90
            ],
            "ids": [
                54
            ],
            "names": [
                90
            ],
            "openNow": [
                46
            ],
            "opensAfter": [
                52
            ],
            "opensBefore": [
                52
            ],
            "__typename": [
                90
            ]
        },
        "PeriodProgram": {
            "actions": [
                75
            ],
            "applicantDescription": [
                90
            ],
            "eligibilityDescription": [
                90
            ],
            "enabled": [
                46
            ],
            "key": [
                54
            ],
            "navTitle": [
                90
            ],
            "period": [
                71
            ],
            "requirements": [
                76
            ],
            "title": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                49
            ],
            "description": [
                90
            ],
            "enabled": [
                46
            ],
            "key": [
                90
            ],
            "navTitle": [
                90
            ],
            "prompts": [
                77
            ],
            "title": [
                90
            ],
            "type": [
                88
            ],
            "__typename": [
                90
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                49
            ],
            "description": [
                90
            ],
            "key": [
                90
            ],
            "navTitle": [
                90
            ],
            "periodId": [
                90
            ],
            "title": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                52
            ],
            "closeDate": [
                52
            ],
            "code": [
                90
            ],
            "name": [
                90
            ],
            "openDate": [
                52
            ],
            "__typename": [
                90
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                46
            ],
            "key": [
                90
            ],
            "title": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "Program": {
            "applicantDescription": [
                90
            ],
            "eligibilityDescription": [
                90
            ],
            "key": [
                54
            ],
            "navTitle": [
                90
            ],
            "title": [
                90
            ],
            "__typename": [
                90
            ]
        },
        "ProgramFilters": {
            "keys": [
                90
            ],
            "__typename": [
                90
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
                        68
                    ]
                }
            ],
            "announcements": [
                22,
                {
                    "filter": [
                        23
                    ]
                }
            ],
            "appRequestActivity": [
                27,
                {
                    "filters": [
                        28
                    ],
                    "id": [
                        90,
                        "String!"
                    ],
                    "paged": [
                        68
                    ]
                }
            ],
            "appRequestIndexes": [
                55,
                {
                    "categories": [
                        90,
                        "[String!]"
                    ],
                    "for": [
                        31
                    ]
                }
            ],
            "appRequests": [
                25,
                {
                    "filter": [
                        29
                    ],
                    "paged": [
                        68
                    ]
                }
            ],
            "applicationMetrics": [
                38,
                {
                    "filter": [
                        61
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "countAppRequests": [
                58,
                {
                    "filter": [
                        29
                    ]
                }
            ],
            "pageInfo": [
                70
            ],
            "periods": [
                71,
                {
                    "filter": [
                        73
                    ]
                }
            ],
            "programs": [
                80,
                {
                    "filter": [
                        81
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
                90
            ],
            "userIndexes": [
                55,
                {
                    "for": [
                        31
                    ]
                }
            ],
            "__typename": [
                90
            ]
        },
        "RequirementPrompt": {
            "actions": [
                85
            ],
            "answered": [
                46
            ],
            "configurationData": [
                59
            ],
            "data": [
                59,
                {
                    "schemaVersion": [
                        90
                    ]
                }
            ],
            "description": [
                90
            ],
            "fetchedData": [
                59,
                {
                    "schemaVersion": [
                        90
                    ]
                }
            ],
            "gatheredConfigData": [
                59
            ],
            "hasSavedData": [
                46
            ],
            "id": [
                54
            ],
            "invalidated": [
                46
            ],
            "invalidatedReason": [
                90
            ],
            "key": [
                90
            ],
            "moot": [
                46
            ],
            "navTitle": [
                90
            ],
            "noDisplay": [
                46
            ],
            "optOut": [
                46
            ],
            "preloadData": [
                59,
                {
                    "schemaVersion": [
                        90
                    ]
                }
            ],
            "prestageData": [
                59,
                {
                    "schemaVersion": [
                        90
                    ]
                }
            ],
            "requirement": [
                42
            ],
            "title": [
                90
            ],
            "visibility": [
                82
            ],
            "__typename": [
                90
            ]
        },
        "RequirementPromptActions": {
            "update": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "RequirementPromptFilter": {
            "answered": [
                46
            ],
            "appRequestIds": [
                54
            ],
            "applicationIds": [
                54
            ],
            "ids": [
                54
            ],
            "promptKeys": [
                90
            ],
            "reachable": [
                46
            ],
            "requirementIds": [
                54
            ],
            "__typename": [
                90
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                46
            ],
            "update": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "String": {},
        "ValidatedAnnouncementResponse": {
            "announcement": [
                22
            ],
            "messages": [
                64
            ],
            "success": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "ValidatedAppRequestResponse": {
            "appRequest": [
                25
            ],
            "messages": [
                64
            ],
            "success": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                49
            ],
            "messages": [
                64
            ],
            "success": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "ValidatedNoteResponse": {
            "messages": [
                64
            ],
            "note": [
                66
            ],
            "success": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                64
            ],
            "period": [
                71
            ],
            "success": [
                46
            ],
            "__typename": [
                90
            ]
        },
        "ValidatedResponse": {
            "messages": [
                64
            ],
            "success": [
                46
            ],
            "__typename": [
                90
            ]
        }
    }
}