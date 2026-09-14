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
        82,
        87,
        88,
        89,
        91
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
                91
            ]
        },
        "AccessControl": {
            "description": [
                91
            ],
            "name": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessControlGroup": {
            "controls": [
                1
            ],
            "description": [
                91
            ],
            "name": [
                91
            ],
            "tags": [
                15
            ],
            "title": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessGrantTag": {
            "category": [
                91
            ],
            "categoryLabel": [
                91
            ],
            "label": [
                91
            ],
            "tag": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessRole": {
            "actions": [
                90
            ],
            "description": [
                91
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
                91
            ],
            "scope": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessRoleFilter": {
            "groups": [
                91
            ],
            "ids": [
                53
            ],
            "names": [
                91
            ],
            "scopes": [
                91
            ],
            "__typename": [
                91
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
                91
            ],
            "id": [
                53
            ],
            "tags": [
                3
            ],
            "__typename": [
                91
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
                91
            ]
        },
        "AccessRoleGrantCreate": {
            "allow": [
                45
            ],
            "controlGroup": [
                91
            ],
            "controls": [
                91
            ],
            "tags": [
                16
            ],
            "__typename": [
                91
            ]
        },
        "AccessRoleGrantUpdate": {
            "allow": [
                45
            ],
            "controlGroup": [
                91
            ],
            "controls": [
                91
            ],
            "tags": [
                16
            ],
            "__typename": [
                91
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
                91
            ],
            "managers": [
                11
            ],
            "roleId": [
                53
            ],
            "__typename": [
                91
            ]
        },
        "AccessRoleGroupManager": {
            "email": [
                91
            ],
            "fullname": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessRoleInput": {
            "description": [
                91
            ],
            "groups": [
                91
            ],
            "name": [
                91
            ],
            "scope": [
                91
            ],
            "__typename": [
                91
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
                91
            ]
        },
        "AccessTag": {
            "label": [
                91
            ],
            "value": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessTagCategory": {
            "category": [
                91
            ],
            "description": [
                91
            ],
            "label": [
                91
            ],
            "listable": [
                45
            ],
            "tags": [
                14
            ],
            "__typename": [
                91
            ]
        },
        "AccessTagInput": {
            "category": [
                91
            ],
            "tag": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessUser": {
            "email": [
                91
            ],
            "fullname": [
                91
            ],
            "groups": [
                91
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
                91
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
                91
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
                91
            ],
            "otherIdentifiersByLabel": [
                21
            ],
            "roles": [
                91
            ],
            "search": [
                91
            ],
            "self": [
                45
            ],
            "__typename": [
                91
            ]
        },
        "AccessUserIdentifier": {
            "id": [
                53
            ],
            "label": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AccessUserIdentifierInput": {
            "id": [
                53
            ],
            "label": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "Announcement": {
            "body": [
                91
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
                91
            ],
            "linkText": [
                91
            ],
            "start": [
                51
            ],
            "subject": [
                91
            ],
            "type": [
                91
            ],
            "__typename": [
                91
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
                91
            ]
        },
        "AnnouncementUpdate": {
            "body": [
                91
            ],
            "enabled": [
                45
            ],
            "end": [
                51
            ],
            "link": [
                91
            ],
            "linkText": [
                91
            ],
            "start": [
                51
            ],
            "subject": [
                91
            ],
            "type": [
                91
            ],
            "__typename": [
                91
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
                        91
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
                84,
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
                91
            ],
            "submittedAt": [
                51
            ],
            "updatedAt": [
                51
            ],
            "__typename": [
                91
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
                91
            ]
        },
        "AppRequestActivity": {
            "action": [
                91
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
                91
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
                91
            ]
        },
        "AppRequestActivityFilters": {
            "actions": [
                91
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
                91
            ],
            "users": [
                53
            ],
            "__typename": [
                91
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
                91
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
                91
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
                91
            ],
            "categoryLabel": [
                91
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
                91
            ]
        },
        "AppRequestIndexDestination": {},
        "AppRequestIndexFilter": {
            "category": [
                91
            ],
            "tags": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "AppRequestNoteFilters": {
            "appRequestIds": [
                53
            ],
            "applicants": [
                91
            ],
            "ids": [
                53
            ],
            "__typename": [
                91
            ]
        },
        "AppRequestPhase": {},
        "AppRequestStatus": {},
        "Application": {
            "actions": [
                37
            ],
            "applicantDescription": [
                91
            ],
            "awaitingCorrection": [
                45
            ],
            "eligibilityDescription": [
                91
            ],
            "id": [
                53
            ],
            "ineligiblePhase": [
                56
            ],
            "navTitle": [
                91
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
                91
            ],
            "requirements": [
                42
            ],
            "rescindedReason": [
                91
            ],
            "rescindedStatus": [
                43
            ],
            "restoredReason": [
                91
            ],
            "reviewSections": [
                81
            ],
            "status": [
                44
            ],
            "statusReason": [
                91
            ],
            "title": [
                91
            ],
            "workflowStage": [
                78
            ],
            "workflowStages": [
                78
            ],
            "__typename": [
                91
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
                91
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
                91
            ]
        },
        "ApplicationMetricEntry": {
            "appRequestId": [
                53
            ],
            "applicantFullname": [
                91
            ],
            "applicantId": [
                53
            ],
            "applicantLogin": [
                91
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
                91
            ],
            "periodCode": [
                91
            ],
            "periodId": [
                53
            ],
            "periodName": [
                91
            ],
            "phase": [
                91
            ],
            "programKey": [
                91
            ],
            "status": [
                91
            ],
            "submittedAt": [
                51
            ],
            "updatedAt": [
                51
            ],
            "__typename": [
                91
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
                91
            ]
        },
        "ApplicationPhase": {},
        "ApplicationRequirement": {
            "application": [
                36
            ],
            "blame": [
                91
            ],
            "configurationData": [
                58
            ],
            "description": [
                91
            ],
            "id": [
                53
            ],
            "key": [
                91
            ],
            "navTitle": [
                91
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
                91
            ],
            "status": [
                87
            ],
            "statusReason": [
                91
            ],
            "title": [
                91
            ],
            "type": [
                88
            ],
            "workflowStage": [
                78
            ],
            "__typename": [
                91
            ]
        },
        "ApplicationRescindedStatus": {},
        "ApplicationStatus": {},
        "Boolean": {},
        "Category": {
            "category": [
                91
            ],
            "label": [
                91
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
                91
            ]
        },
        "CategoryTag": {
            "label": [
                91
            ],
            "tag": [
                91
            ],
            "__typename": [
                91
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
                91
            ],
            "__typename": [
                91
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
                91
            ]
        },
        "ConfigurationFilters": {
            "ids": [
                53
            ],
            "keys": [
                91
            ],
            "periodCodes": [
                91
            ],
            "periodIds": [
                53
            ],
            "__typename": [
                91
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
                91
            ],
            "categoryLabel": [
                91
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
                        91
                    ]
                }
            ],
            "__typename": [
                91
            ]
        },
        "IndexValue": {
            "label": [
                91
            ],
            "value": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "IneligiblePhases": {},
        "Int": {},
        "JsonData": {},
        "MetricAccessUserFilters": {
            "fullnames": [
                91
            ],
            "ids": [
                53
            ],
            "logins": [
                91
            ],
            "__typename": [
                91
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
                91
            ]
        },
        "MetricPeriodFilters": {
            "codes": [
                91
            ],
            "ids": [
                53
            ],
            "names": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "Mutation": {
            "acceptOffer": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "addNote": [
                95,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ],
                    "content": [
                        91,
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
                93,
                {
                    "applicationId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "cancelAppRequest": [
                93,
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
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "completeRequest": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "completeReview": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "createAnnouncement": [
                92,
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
                93,
                {
                    "login": [
                        91,
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
                96,
                {
                    "copyPeriodId": [
                        91
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
                97,
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
                97,
                {
                    "periodId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "markPeriodReviewed": [
                96,
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
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "rescind": [
                93,
                {
                    "applicationId": [
                        53,
                        "ID!"
                    ],
                    "reason": [
                        91,
                        "String!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "restore": [
                93,
                {
                    "applicationId": [
                        53,
                        "ID!"
                    ],
                    "reason": [
                        91,
                        "String!"
                    ],
                    "validateOnly": [
                        45
                    ]
                }
            ],
            "returnToApplicant": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "returnToNonBlocking": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "returnToOffer": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "returnToReview": [
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "reverseWorkflow": [
                93,
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
                97,
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
                93,
                {
                    "appRequestId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "togglePersistence": [
                95,
                {
                    "noteId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "updateAnnouncement": [
                92,
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
                94,
                {
                    "data": [
                        58,
                        "JsonData!"
                    ],
                    "key": [
                        91,
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
                95,
                {
                    "content": [
                        91,
                        "String!"
                    ],
                    "noteId": [
                        53,
                        "ID!"
                    ]
                }
            ],
            "updatePeriod": [
                96,
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
                97,
                {
                    "disabled": [
                        45,
                        "Boolean!"
                    ],
                    "periodId": [
                        91,
                        "String!"
                    ],
                    "requirementKey": [
                        91,
                        "String!"
                    ]
                }
            ],
            "updatePrompt": [
                93,
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
                91
            ]
        },
        "MutationMessage": {
            "arg": [
                91
            ],
            "message": [
                91
            ],
            "type": [
                64
            ],
            "__typename": [
                91
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
                91
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
                91
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
                91
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
                91
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
                91
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
                91
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
                91
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
                91
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
                91
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
                91
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
                91
            ],
            "ids": [
                53
            ],
            "names": [
                91
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
                91
            ]
        },
        "PeriodProgram": {
            "actions": [
                74
            ],
            "applicantDescription": [
                91
            ],
            "eligibilityDescription": [
                91
            ],
            "enabled": [
                45
            ],
            "key": [
                53
            ],
            "navTitle": [
                91
            ],
            "period": [
                70
            ],
            "requirements": [
                75
            ],
            "title": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "PeriodProgramActions": {
            "configure": [
                45
            ],
            "__typename": [
                91
            ]
        },
        "PeriodProgramRequirement": {
            "configuration": [
                48
            ],
            "description": [
                91
            ],
            "enabled": [
                45
            ],
            "key": [
                91
            ],
            "navTitle": [
                91
            ],
            "prompts": [
                76
            ],
            "title": [
                91
            ],
            "type": [
                88
            ],
            "__typename": [
                91
            ]
        },
        "PeriodPrompt": {
            "configuration": [
                48
            ],
            "description": [
                91
            ],
            "key": [
                91
            ],
            "navTitle": [
                91
            ],
            "periodId": [
                91
            ],
            "title": [
                91
            ],
            "__typename": [
                91
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
                91
            ],
            "name": [
                91
            ],
            "openDate": [
                51
            ],
            "__typename": [
                91
            ]
        },
        "PeriodWorkflowStage": {
            "blocking": [
                45
            ],
            "key": [
                91
            ],
            "title": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "Program": {
            "applicantDescription": [
                91
            ],
            "eligibilityDescription": [
                91
            ],
            "key": [
                53
            ],
            "navTitle": [
                91
            ],
            "title": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "ProgramFilters": {
            "keys": [
                91
            ],
            "__typename": [
                91
            ]
        },
        "ProgramReviewSection": {
            "requirementKeys": [
                91
            ],
            "section": [
                89
            ],
            "title": [
                91
            ],
            "workflowStageKey": [
                91
            ],
            "__typename": [
                91
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
                        91,
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
                        91,
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
                91
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
                91
            ]
        },
        "RequirementPrompt": {
            "actions": [
                85
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
                        91
                    ]
                }
            ],
            "description": [
                91
            ],
            "fetchedData": [
                58,
                {
                    "schemaVersion": [
                        91
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
                91
            ],
            "key": [
                91
            ],
            "moot": [
                45
            ],
            "navTitle": [
                91
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
                        91
                    ]
                }
            ],
            "prestageData": [
                58,
                {
                    "schemaVersion": [
                        91
                    ]
                }
            ],
            "requirement": [
                42
            ],
            "title": [
                91
            ],
            "visibility": [
                82
            ],
            "__typename": [
                91
            ]
        },
        "RequirementPromptActions": {
            "update": [
                45
            ],
            "__typename": [
                91
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
                91
            ],
            "reachable": [
                45
            ],
            "requirementIds": [
                53
            ],
            "__typename": [
                91
            ]
        },
        "RequirementStatus": {},
        "RequirementType": {},
        "ReviewDefaultSection": {},
        "RoleActions": {
            "delete": [
                45
            ],
            "update": [
                45
            ],
            "__typename": [
                91
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
                91
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
                91
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
                91
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
                91
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
                91
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
                91
            ]
        }
    }
}