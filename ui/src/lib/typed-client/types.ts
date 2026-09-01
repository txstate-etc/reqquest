export default {
    "scalars": [
        31,
        34,
        35,
        41,
        43,
        44,
        45,
        51,
        52,
        53,
        56,
        57,
        58,
        64,
        81,
        86,
        87,
        89
    ],
    "types": {
        "Access": {
            "createAnnouncement": [
                45
            ],
            "createAppRequestOther": [
                45
            ],
            "createAppRequestSelf": [
                45
            ],
            "createPeriod": [
                45
            ],
            "createRole": [
                45
            ],
            "deleteAnnouncement": [
                45
            ],
            "updateAnnouncement": [
                45
            ],
            "user": [
                17
            ],
            "viewAppRequestList": [
                45
            ],
            "viewApplicantDashboard": [
                45
            ],
            "viewMetrics": [
                45
            ],
            "viewPeriodManagement": [
                45
            ],
            "viewReviewerInterface": [
                45
            ],
            "viewRoleManagement": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "AccessControl": {
            "description": [
                89
            ],
            "name": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                89
            ],
            "name": [
                89
            ],
            "tags": [
                15
            ],
            "title": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessGrantTag": {
            "category": [
                89
            ],
            "categoryLabel": [
                89
            ],
            "label": [
                89
            ],
            "tag": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessRole": {
            "actions": [
                88
            ],
            "description": [
                89
            ],
            "grants": [
                6
            ],
            "groups": [
                10
            ],
            "id": [
                53
            ],
            "name": [
                89
            ],
            "scope": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                89
            ],
            "ids": [
                53
            ],
            "names": [
                89
            ],
            "scopes": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleGrant": {
            "actions": [
                7
            ],
            "allow": [
                45
            ],
            "controlGroup": [
                2
            ],
            "controls": [
                89
            ],
            "id": [
                53
            ],
            "tags": [
                3
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleGrantActions": {
            "delete": [
                45
            ],
            "update": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                45
            ],
            "controlGroup": [
                89
            ],
            "controls": [
                89
            ],
            "tags": [
                16
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                45
            ],
            "controlGroup": [
                89
            ],
            "controls": [
                89
            ],
            "tags": [
                16
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleGroup": {
            "dateAdded": [
                51
            ],
            "dateCreated": [
                51
            ],
            "groupName": [
                89
            ],
            "managers": [
                11
            ],
            "roleId": [
                53
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                89
            ],
            "fullname": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleInput": {
            "description": [
                89
            ],
            "groups": [
                89
            ],
            "name": [
                89
            ],
            "scope": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessRoleValidatedResponse": {
            "accessRole": [
                4
            ],
            "messages": [
                63
            ],
            "success": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "AccessTag": {
            "label": [
                89
            ],
            "value": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessTagCategory": {
            "category": [
                89
            ],
            "description": [
                89
            ],
            "label": [
                89
            ],
            "listable": [
                45
            ],
            "tags": [
                14
            ],
            "__typename": [
                89
            ]
        },
        "AccessTagInput": {
            "category": [
                89
            ],
            "tag": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessUser": {
            "email": [
                89
            ],
            "fullname": [
                89
            ],
            "groups": [
                89
            ],
            "login": [
                53
            ],
            "otherIdentifiers": [
                20
            ],
            "otherInfo": [
                58
            ],
            "roles": [
                4
            ],
            "stillValid": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "AccessUserCategoryInput": {
            "category": [
                53
            ],
            "tags": [
                53
            ],
            "__typename": [
                89
            ]
        },
        "AccessUserFilter": {
            "logins": [
                53
            ],
            "otherCategoriesByLabel": [
                18
            ],
            "otherIdentifiers": [
                89
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                89
            ],
            "search": [
                89
            ],
            "self": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                53
            ],
            "label": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                53
            ],
            "label": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "Announcement": {
            "body": [
                89
            ],
            "enabled": [
                45
            ],
            "end": [
                51
            ],
            "id": [
                53
            ],
            "link": [
                89
            ],
            "linkText": [
                89
            ],
            "start": [
                51
            ],
            "subject": [
                89
            ],
            "type": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AnnouncementFilters": {
            "active": [
                45
            ],
            "enabled": [
                45
            ],
            "ids": [
                53
            ],
            "__typename": [
                89
            ]
        },
        "AnnouncementUpdate": {
            "body": [
                89
            ],
            "enabled": [
                45
            ],
            "end": [
                51
            ],
            "link": [
                89
            ],
            "linkText": [
                89
            ],
            "start": [
                51
            ],
            "subject": [
                89
            ],
            "type": [
                89
            ],
            "__typename": [
                89
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
                45
            ],
            "closedAt": [
                51
            ],
            "createdAt": [
                51
            ],
            "data": [
                58,
                {
                    "schemaVersion": [
                        89
                    ]
                }
            ],
            "dataVersion": [
                57
            ],
            "id": [
                53
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
                65,
                {
                    "filter": [
                        33
                    ]
                }
            ],
            "otherNotes": [
                65,
                {
                    "filter": [
                        33
                    ]
                }
            ],
            "period": [
                70
            ],
            "phase": [
                34
            ],
            "prompt": [
                83,
                {
                    "promptId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "status": [
                35
            ],
            "statusReason": [
                89
            ],
            "submittedAt": [
                51
            ],
            "updatedAt": [
                51
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestActions": {
            "acceptOffer": [
                45
            ],
            "cancel": [
                45
            ],
            "close": [
                45
            ],
            "completeRequest": [
                45
            ],
            "completeReview": [
                45
            ],
            "createNote": [
                45
            ],
            "createPersistentNote": [
                45
            ],
            "reopen": [
                45
            ],
            "returnToApplicant": [
                45
            ],
            "returnToNonBlocking": [
                45
            ],
            "returnToOffer": [
                45
            ],
            "returnToReview": [
                45
            ],
            "review": [
                45
            ],
            "submit": [
                45
            ],
            "viewAcceptUI": [
                45
            ],
            "viewApplyUI": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestActivity": {
            "action": [
                89
            ],
            "appRequest": [
                25
            ],
            "createdAt": [
                51
            ],
            "data": [
                58
            ],
            "description": [
                89
            ],
            "id": [
                53
            ],
            "impersonatedBy": [
                17
            ],
            "user": [
                17
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                89
            ],
            "appRequestIds": [
                53
            ],
            "happenedAfter": [
                51
            ],
            "happenedBefore": [
                51
            ],
            "impersonated": [
                45
            ],
            "impersonatedBy": [
                53
            ],
            "impersonatedUsers": [
                53
            ],
            "search": [
                89
            ],
            "users": [
                53
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestFilter": {
            "closed": [
                45
            ],
            "closedAfter": [
                51
            ],
            "closedBefore": [
                51
            ],
            "complete": [
                45
            ],
            "createdAfter": [
                51
            ],
            "createdBefore": [
                51
            ],
            "ids": [
                53
            ],
            "indexes": [
                32
            ],
            "logins": [
                53
            ],
            "own": [
                45
            ],
            "periodIds": [
                53
            ],
            "rescindedStatus": [
                43
            ],
            "reviewStarted": [
                45
            ],
            "search": [
                89
            ],
            "status": [
                35
            ],
            "submittedAfter": [
                51
            ],
            "submittedBefore": [
                51
            ],
            "updatedAfter": [
                51
            ],
            "updatedBefore": [
                51
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestIndexCategory": {
            "appRequestListPriority": [
                52
            ],
            "applicantDashboardPriority": [
                52
            ],
            "category": [
                89
            ],
            "categoryLabel": [
                89
            ],
            "listFiltersPriority": [
                52
            ],
            "listable": [
                45
            ],
            "reviewerDashboardPriority": [
                52
            ],
            "values": [
                55
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                89
            ],
            "tags": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                53
            ],
            "applicants": [
                89
            ],
            "ids": [
                53
            ],
            "__typename": [
                89
            ]
        },
        "AppRequestPhase": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                37
            ],
            "applicantDescription": [
                89
            ],
            "awaitingCorrection": [
                45
            ],
            "eligibilityDescription": [
                89
            ],
            "id": [
                53
            ],
            "ineligiblePhase": [
                56
            ],
            "navTitle": [
                89
            ],
            "nextWorkflowStage": [
                78
            ],
            "phase": [
                41
            ],
            "previousWorkflowStage": [
                78
            ],
            "programKey": [
                89
            ],
            "requirements": [
                42
            ],
            "rescindedReason": [
                89
            ],
            "rescindedStatus": [
                43
            ],
            "restoredReason": [
                89
            ],
            "status": [
                44
            ],
            "statusReason": [
                89
            ],
            "title": [
                89
            ],
            "workflowStage": [
                78
            ],
            "workflowStages": [
                78
            ],
            "__typename": [
                89
            ]
        },
        "ApplicationActions": {
            "advanceWorkflow": [
                45
            ],
            "rescindApplication": [
                45
            ],
            "restoreApplication": [
                45
            ],
            "reverseWorkflow": [
                45
            ],
            "viewAsReviewer": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "ApplicationMetric": {
            "approved": [
                52
            ],
            "closed": [
                52
            ],
            "denied": [
                52
            ],
            "entries": [
                39
            ],
            "rescinded": [
                52
            ],
            "started": [
                52
            ],
            "submitted": [
                52
            ],
            "toDecision": [
                40
            ],
            "toSubmit": [
                40
            ],
            "__typename": [
                89
            ]
        },
        "ApplicationMetricEntry": {
            "appRequestId": [
                53
            ],
            "applicantFullname": [
                89
            ],
            "applicantId": [
                53
            ],
            "applicantLogin": [
                89
            ],
            "applicationId": [
                53
            ],
            "closedAt": [
                51
            ],
            "createdAt": [
                51
            ],
            "ineligiblePhase": [
                89
            ],
            "periodCode": [
                89
            ],
            "periodId": [
                53
            ],
            "periodName": [
                89
            ],
            "phase": [
                89
            ],
            "programKey": [
                89
            ],
            "status": [
                89
            ],
            "submittedAt": [
                51
            ],
            "updatedAt": [
                51
            ],
            "__typename": [
                89
            ]
        },
        "ApplicationMetricTiming": {
            "avg": [
                52
            ],
            "max": [
                52
            ],
            "min": [
                52
            ],
            "__typename": [
                89
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                36
            ],
            "blame": [
                89
            ],
            "configurationData": [
                58
            ],
            "description": [
                89
            ],
            "id": [
                53
            ],
            "key": [
                89
            ],
            "navTitle": [
                89
            ],
            "prompts": [
                83,
                {
                    "filter": [
                        85
                    ]
                }
            ],
            "smartTitle": [
                89
            ],
            "status": [
                86
            ],
            "statusReason": [
                89
            ],
            "title": [
                89
            ],
            "type": [
                87
            ],
            "workflowStage": [
                78
            ],
            "__typename": [
                89
            ]
        },
        "ApplicationRescindedStatus": {},
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                89
            ],
            "label": [
                89
            ],
            "tags": [
                47
            ],
            "useInFilters": [
                45
            ],
            "useInList": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "CategoryTag": {
            "label": [
                89
            ],
            "tag": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "Configuration": {
            "actions": [
                49
            ],
            "data": [
                58
            ],
            "fetchedData": [
                58
            ],
            "key": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "ConfigurationAccess": {
            "update": [
                45
            ],
            "view": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                53
            ],
            "keys": [
                89
            ],
            "periodCodes": [
                89
            ],
            "periodIds": [
                53
            ],
            "__typename": [
                89
            ]
        },
        "DateTime": {},
        "Float": {},
        "ID": {},
        "IndexCategory": {
            "appRequestListPriority": [
                52
            ],
            "applicantDashboardPriority": [
                52
            ],
            "category": [
                89
            ],
            "categoryLabel": [
                89
            ],
            "listFiltersPriority": [
                52
            ],
            "listable": [
                45
            ],
            "reviewerDashboardPriority": [
                52
            ],
            "values": [
                55,
                {
                    "inUse": [
                        45
                    ],
                    "search": [
                        89
                    ]
                }
            ],
            "__typename": [
                89
            ]
        },
        "IndexValue": {
            "label": [
                89
            ],
            "value": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "MetricAccessUserFilters": {
            "fullnames": [
                89
            ],
            "ids": [
                53
            ],
            "logins": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "MetricApplicationFilters": {
            "applicants": [
                59
            ],
            "applicationIds": [
                53
            ],
            "closedAfterDateTime": [
                51
            ],
            "closedBeforeDateTime": [
                51
            ],
            "periods": [
                61
            ],
            "startedAfterDateTime": [
                51
            ],
            "startedBeforeDateTime": [
                51
            ],
            "submittedAfterDateTime": [
                51
            ],
            "submittedBeforeDateTime": [
                51
            ],
            "__typename": [
                89
            ]
        },
        "MetricPeriodFilters": {
            "codes": [
                89
            ],
            "ids": [
                53
            ],
            "names": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "Mutation": {
            "acceptOffer": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ],
                    "content": [
                        89,
                        "String!"
                    ],
                    "persistent": [
                        45
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "advanceWorkflow": [
                91,
                {
                    "applicationId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ],
                    "dataVersion": [
                        57
                    ]
                }
            ],
            "closeAppRequest": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "createAnnouncement": [
                90,
                {
                    "announcement": [
                        24,
                        "AnnouncementUpdate!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "createAppRequest": [
                91,
                {
                    "login": [
                        89,
                        "String!"
                    ],
                    "periodId": [
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "createPeriod": [
                94,
                {
                    "copyPeriodId": [
                        89
                    ],
                    "period": [
                        77,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "deleteAnnouncement": [
                95,
                {
                    "announcementId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "deleteNote": [
                45,
                {
                    "noteId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "deletePeriod": [
                95,
                {
                    "periodId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                94,
                {
                    "periodId": [
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "reopenAppRequest": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "rescind": [
                91,
                {
                    "applicationId": [
                        53,
                        "ID!"
                    ],
                    "reason": [
                        89,
                        "String!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "restore": [
                91,
                {
                    "applicationId": [
                        53,
                        "ID!"
                    ],
                    "reason": [
                        89,
                        "String!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "returnToApplicant": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                91,
                {
                    "applicationId": [
                        53,
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
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "roleCreate": [
                13,
                {
                    "copyRoleId": [
                        53
                    ],
                    "role": [
                        12,
                        "AccessRoleInput!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "roleDelete": [
                95,
                {
                    "roleId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "roleDeleteGrant": [
                13,
                {
                    "grantId": [
                        53,
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
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
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
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "submitAppRequest": [
                91,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "togglePersistence": [
                93,
                {
                    "noteId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "updateAnnouncement": [
                90,
                {
                    "announcement": [
                        24,
                        "AnnouncementUpdate!"
                    ],
                    "announcementId": [
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "updateConfiguration": [
                92,
                {
                    "data": [
                        58,
                        "JsonData!"
                    ],
                    "key": [
                        89,
                        "String!"
                    ],
                    "periodId": [
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "updateNote": [
                93,
                {
                    "content": [
                        89,
                        "String!"
                    ],
                    "noteId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "updatePeriod": [
                94,
                {
                    "periodId": [
                        53,
                        "ID!"
                    ],
                    "update": [
                        77,
                        "PeriodUpdate!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "updatePeriodRequirement": [
                95,
                {
                    "disabled": [
                        45,
                        "Boolean!"
                    ],
                    "periodId": [
                        89,
                        "String!"
                    ],
                    "requirementKey": [
                        89,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                91,
                {
                    "data": [
                        58,
                        "JsonData!"
                    ],
                    "dataVersion": [
                        57
                    ],
                    "overrideInvalidated": [
                        45
                    ],
                    "promptId": [
                        53,
                        "ID!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "__typename": [
                89
            ]
        },
        "MutationMessage": {
            "arg": [
                89
            ],
            "message": [
                89
            ],
            "type": [
                64
            ],
            "__typename": [
                89
            ]
        },
        "MutationMessageType": {},
        "Note": {
            "actions": [
                66
            ],
            "appRequest": [
                25
            ],
            "author": [
                17
            ],
            "content": [
                89
            ],
            "createdAt": [
                51
            ],
            "id": [
                53
            ],
            "persistent": [
                45
            ],
            "updatedAt": [
                51
            ],
            "__typename": [
                89
            ]
        },
        "NoteActions": {
            "delete": [
                45
            ],
            "update": [
                45
            ],
            "updatePersistent": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "Pagination": {
            "page": [
                57
            ],
            "perPage": [
                57
            ],
            "__typename": [
                89
            ]
        },
        "PaginationInfoWithTotalItems": {
            "categories": [
                46
            ],
            "currentPage": [
                52
            ],
            "hasNextPage": [
                45
            ],
            "perPage": [
                52
            ],
            "totalItems": [
                52
            ],
            "__typename": [
                89
            ]
        },
        "PaginationResponse": {
            "accessUsers": [
                68
            ],
            "appRequests": [
                68
            ],
            "appRequestsActivity": [
                68
            ],
            "__typename": [
                89
            ]
        },
        "Period": {
            "actions": [
                71
            ],
            "archiveDate": [
                51
            ],
            "closeDate": [
                51
            ],
            "code": [
                89
            ],
            "configurations": [
                48,
                {
                    "filter": [
                        50
                    ]
                }
            ],
            "id": [
                53
            ],
            "name": [
                89
            ],
            "openDate": [
                51
            ],
            "programs": [
                73
            ],
            "prompts": [
                76
            ],
            "requirements": [
                75
            ],
            "reviewed": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "PeriodActions": {
            "createAppRequest": [
                45
            ],
            "delete": [
                45
            ],
            "update": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "PeriodFilters": {
            "archiveAfter": [
                51
            ],
            "archiveBefore": [
                51
            ],
            "closesAfter": [
                51
            ],
            "closesBefore": [
                51
            ],
            "codes": [
                89
            ],
            "ids": [
                53
            ],
            "names": [
                89
            ],
            "openNow": [
                45
            ],
            "opensAfter": [
                51
            ],
            "opensBefore": [
                51
            ],
            "__typename": [
                89
            ]
        },
        "PeriodProgram": {
            "actions": [
                74
            ],
            "applicantDescription": [
                89
            ],
            "eligibilityDescription": [
                89
            ],
            "enabled": [
                45
            ],
            "key": [
                53
            ],
            "navTitle": [
                89
            ],
            "period": [
                70
            ],
            "requirements": [
                75
            ],
            "title": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                48
            ],
            "description": [
                89
            ],
            "enabled": [
                45
            ],
            "key": [
                89
            ],
            "navTitle": [
                89
            ],
            "prompts": [
                76
            ],
            "title": [
                89
            ],
            "type": [
                87
            ],
            "__typename": [
                89
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                48
            ],
            "description": [
                89
            ],
            "key": [
                89
            ],
            "navTitle": [
                89
            ],
            "periodId": [
                89
            ],
            "title": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "PeriodUpdate": {
            "archiveDate": [
                51
            ],
            "closeDate": [
                51
            ],
            "code": [
                89
            ],
            "name": [
                89
            ],
            "openDate": [
                51
            ],
            "__typename": [
                89
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                45
            ],
            "key": [
                89
            ],
            "title": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "Program": {
            "applicantDescription": [
                89
            ],
            "eligibilityDescription": [
                89
            ],
            "key": [
                53
            ],
            "navTitle": [
                89
            ],
            "title": [
                89
            ],
            "__typename": [
                89
            ]
        },
        "ProgramFilters": {
            "keys": [
                89
            ],
            "__typename": [
                89
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
                        67
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
                        89,
                        "String!"
                    ],
                    "paged": [
                        67
                    ]
                }
            ],
            "appRequestIndexes": [
                54,
                {
                    "categories": [
                        89,
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
                        67
                    ]
                }
            ],
            "applicationMetrics": [
                38,
                {
                    "filter": [
                        60
                    ]
                }
            ],
            "controlGroups": [
                2
            ],
            "countAppRequests": [
                57,
                {
                    "filter": [
                        29
                    ]
                }
            ],
            "pageInfo": [
                69
            ],
            "periods": [
                70,
                {
                    "filter": [
                        72
                    ]
                }
            ],
            "programs": [
                79,
                {
                    "filter": [
                        80
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
                89
            ],
            "userIndexes": [
                54,
                {
                    "for": [
                        31
                    ]
                }
            ],
            "__typename": [
                89
            ]
        },
        "RequirementPrompt": {
            "actions": [
                84
            ],
            "answered": [
                45
            ],
            "configurationData": [
                58
            ],
            "data": [
                58,
                {
                    "schemaVersion": [
                        89
                    ]
                }
            ],
            "description": [
                89
            ],
            "fetchedData": [
                58,
                {
                    "schemaVersion": [
                        89
                    ]
                }
            ],
            "gatheredConfigData": [
                58
            ],
            "hasSavedData": [
                45
            ],
            "id": [
                53
            ],
            "invalidated": [
                45
            ],
            "invalidatedReason": [
                89
            ],
            "key": [
                89
            ],
            "moot": [
                45
            ],
            "navTitle": [
                89
            ],
            "noDisplay": [
                45
            ],
            "optOut": [
                45
            ],
            "preloadData": [
                58,
                {
                    "schemaVersion": [
                        89
                    ]
                }
            ],
            "prestageData": [
                58,
                {
                    "schemaVersion": [
                        89
                    ]
                }
            ],
            "requirement": [
                42
            ],
            "title": [
                89
            ],
            "visibility": [
                81
            ],
            "__typename": [
                89
            ]
        },
        "RequirementPromptActions": {
            "update": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "RequirementPromptFilter": {
            "answered": [
                45
            ],
            "appRequestIds": [
                53
            ],
            "applicationIds": [
                53
            ],
            "ids": [
                53
            ],
            "promptKeys": [
                89
            ],
            "reachable": [
                45
            ],
            "requirementIds": [
                53
            ],
            "__typename": [
                89
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "RoleActions": {
            "delete": [
                45
            ],
            "update": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "String": {},
        "ValidatedAnnouncementResponse": {
            "announcement": [
                22
            ],
            "messages": [
                63
            ],
            "success": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "ValidatedAppRequestResponse": {
            "appRequest": [
                25
            ],
            "messages": [
                63
            ],
            "success": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "ValidatedConfigurationResponse": {
            "configuration": [
                48
            ],
            "messages": [
                63
            ],
            "success": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "ValidatedNoteResponse": {
            "messages": [
                63
            ],
            "note": [
                65
            ],
            "success": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "ValidatedPeriodResponse": {
            "messages": [
                63
            ],
            "period": [
                70
            ],
            "success": [
                45
            ],
            "__typename": [
                89
            ]
        },
        "ValidatedResponse": {
            "messages": [
                63
            ],
            "success": [
                45
            ],
            "__typename": [
                89
            ]
        }
    }
}