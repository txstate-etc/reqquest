# Overview

ReqQuest is a flexible development platform that helps us build applications
with complex requirements and branching logic. Each time we build an application,
which we'll call an Instance App, we will start by defining a list of requirements,
then consider what kind of information we will collect to help the users prove the
applicant meets the requirements, then design out the UX of collecting the information.

Ideally, each requirement can be considered individually, without worrying too much about
other requirements in the system and the information they have already collected.

It's hard to predict how best to read this document. It starts out with a lot of
definitions that are pretty important, but some readers may benefit from skipping
to [the application process](#the-application-process).

# Actors
* Applicant
* Reviewer
* Administrator

These are not quite the same as roles, they are more conceptual. You
might have several types of reviewer that each have access to their own
set of prompts, or several types of administrator managing roles or prompt
configurations.

# Work Objects
* App Requests
  * Programs / Applications
    * Requirements / ApplicationRequirements
      * Prompts / RequirementPrompts
* Roles
  * Grants
    * SubjectType, Subject, (Proposed) Category, Permission
  * Exceptions

## App Requests
App Requests represent the entirety of an applicant's submission during a time window.
If the system includes multiple Programs, the App Request acts as a container for all of them,
and automatically generates Applications to each.

## Programs and Applications
Programs represent benefits that the applicant may be eligible to receive. Each program
has its own set of Requirements, though requirements may be shared among multiple programs.

Within the context of a single App Request, each program has an Application. For
example, if the Program represents an "In-State Tuition Grant" program, the Application
represents the information Jennifer gave us to prove she's eligible for the grant, and the
status of her request.

Applications are not submitted independently for review. App Requests are submitted as a
whole in one action. ReqQuest's support for multiple programs is intended to help applicants
narrow a set of related benefit programs down to the ones they're eligible for. If those
programs are only loosely related or have drastically different application deadlines/cadence,
we should probably split them into separate ReqQuest projects. However, we should be able to
accommodate slight deadline differences in various ways (like creating a "deadline has not
passed" requirement on any programs that have earlier deadlines).

### Application Statuses
* PREQUAL
* FAILED_PREQUAL
* QUALIFICATION
* FAILED_QUALIFICATION
* PREAPPROVAL
* APPROVAL
* APPROVED
* NOT_APPROVED
* CANCELLED
* ACCEPTED
* NOT_ACCEPTED

## Requirements and ApplicationRequirements
Requirements are business rules that govern whether an applicant will be eligible for
a program.

While it's easy to think of requirements as logical, like "the applicant must
have income below $50k/year", they should be thought of as more procedural, like "the
applicant must provide proof that they make less than $50k/year" or even "the applicant
must affirm that they make less than $50k/year". Now we know what kind of information
to collect.

Furthermore, we probably want a similar requirement on the review side like "reviewer
must affirm that proof of income is valid and indicates less than $50k/year". One logical
requirement becomes two procedural requirements.

To collect the necessary information, each Requirement depends on a list of Prompts. The
Prompts will be presented to the user in a specific order. After each one is answered,
the requirement will analyze the information gathered and come up with a status (see
ApplicationRequirement Statuses below). The developer is responsible for writing javascript
code that implements a Requirement's logic.

Once a requirement is resolved as anything other than PENDING, further prompts will be
unnecessary and they will not appear beneath this requirement.

Requirements are allowed to share Prompts. The Prompt will appear in navigation under
the first applicable Requirement that depends on it.

Within the context of an individual's Application, what we are dealing with is known as an
ApplicationRequirement. This object represents the status of the Requirement within the Application.

### Requirement Types
Each requirement belongs to a certain phase of the application process. These phases will
be discussed in detail later, but the general idea is that some requirements are intended
for the applicant to resolve, and some the reviewer(s).
* PREQUAL
* QUALIFICATION
* PREAPPROVAL
* APPROVAL
* ACCEPTANCE

### ApplicationRequirement Statuses
Status is updated each time we collect new Prompt data.
* PENDING - The applicant has not yet answered enough of our Prompts to determine their
eligibility for the program.
* MET - The requirement is met based on the data collected so far in the process.
* DISQUALIFYING - The applicant fails this requirement and is not eligible for the program.
* WARNING - The applicant has answered our Prompts, but there is insufficient evidence that
they are eligible. They will be allowed to proceed as if they are eligible, and the reviewer
will sort it out. The applicant will be shown a custom message describing the problem.
* NOT_APPLICABLE - Based on the data collected so far, this requirement does not apply to the
applicant. They will proceed as if the requirement has been met.

### Never-Disqualifying Requirements
Generally, the applicant (and reviewers) must proceed through requirements in strict order,
as one requirement returning DISQUALIFYING renders the rest of the application moot, and we
don't want to waste time asking further questions.

However, some requirements are merely procedural - it's required to upload your photo,
but the only way to fail the requirement is to fail to upload a valid photo (uploading a 300x200
when we asked for a 600x400 isn't DISQUALIFYING, it would actually keep the ApplicationRequirement
in PENDING status until you correct your submission).

We refer to this type of Requirement as "never-disqualifying" because it's logically
impossible for it to receive the DISQUALIFYING status. Developers may flag it
as such, and given this information, ReqQuest knows that it can allow users to proceed to
the next requirement for now, and come back to this requirement later. This gives users
maximum flexibility to see more of the information that is required, partially fill the
application, save, and return later after acquiring more information or documentation.

In situations with minimal branching logic, the user could complete the application in any
order.

## Prompts and RequirementPrompts
Prompts represent the collection of data from our users (both applicants and reviewers). Each
prompt defines a webform which fits on a single screen (though it could use a tabbed UI to feel
like multiple screens). It could be as simple as a yes-or-no question, or as complicated as
uploading a document and answering a series of questions about its content.

Individual prompts can also handle some shallow branching logic, like you answer
a yes-or-no question and based on the answer the Prompt asks you a followup question. Branching
logic can also be handled with additional Requirements. It will be up to the developers and
designers to decide what's most appropriate.

Within the context of an ApplicationRequirement, we will store a RequirementPrompt.
This represents the information collected from users, and has a status of "answered" or not.

The Requirement is not given the information from the Prompt until it has been
fully answered. We don't want requirements making decisions based on incomplete or invalid
data. It is the responsibility of the developer to write javascript code determining whether the
prompt has been sufficiently answered or is still incomplete. Note: the user is allowed to
save invalid data and come back later to make it valid.

## Roles
Roles represent a set of access privileges in the system. Each Role is linked to one or more
ActiveDirectory groups. Membership in the groups is managed outside the system, but which groups
go with which Roles is managed within the system. If the Role lists multiple groups, the
group memberships are merged and everyone has the Role.

Each Role has a list of Grants and Exceptions.

## Grants and Exceptions
Each Grant bestows one permission, pertaining to one subject from the list below. The UI
may make creation of multiple grants more convenient/friendly.

In the case of Prompts, it is possible to grant a permission on ALL Prompts or a single
prompt. If you choose ALL Prompts, you may then add Exceptions that remove a permission from
a single Prompt.

Each Role _adds_ permissions to the user after removing exceptions. For instance, consider
a system with two reviewer roles: one that grants Update on all Prompts except reviewing
driver's licenses, and another granting the review of driver's licenses. A user could be
granted both roles and now they are able to review everything including driver's licenses.

Note: If a user has both applicant and reviewer roles, the actions available to them will
be based on which screen they are on. For instance, there is an applicant dashboard and a
reviewer dashboard - separate screens. In addition, there are a set of screens for submitting
as an applicant and a separate set of screens for reviewing an application.

### SubjectTypes and Subjects
A SubjectType represents a certain type of data, many of which we've already discussed,
like Prompt and Requirement.

A Subject represents one example of a SubjectType, so for instance, if "Prompt" is the SubjectType,
one of the Subjects might be the "Upload your Driver's License" Prompt.

When you create a Grant, you'll always choose a SubjectType for the Grant. If that SubjectType
also has Subjects, you'll either choose one or leave it blank to make the Grant affect ALL Subjects.
I explained this above in the "Grants and Exceptions" section in terms of Prompts, but generically
speaking, it's possible for other SubjectTypes to have Subjects (none are planned at present).

Other SubjectTypes do theoretically have Subjects, but too many to add them individually to Roles.
For example the SubjectType "AppRequest" will eventually number in the tens of thousands in the
database, but creating a role to allow access to a single applicant's request would be
ridiculous, so the system doesn't allow it. Roles are similar, there could eventually be dozens
or hundreds of Roles in the system, so making _another_ role to grant access to manipulate another
specific Role is a little silly. Maybe we'll find a reason to allow it in the future.

### (Proposed) Categories

Since it is sometimes not feasible to create roles for each Subject in a SubjectType like "AppRequest",
we'll need to divide them into categories instead. For example, in a faculty leave request,
maybe we need to categorize by department or college (or both) so that we can create separate
Roles for each department and/or college.

Developers will have the opportunity to provide a piece of code logic that can produce the full
list of possible categories for a given SubjectType, and another piece of code to examine an
individual subject. Administrators will be able to create roles for any of the possible categories,
but Administrators __cannot__ create new ways of categorizing - that would take a developer
and a software update.

As an example, let's think about that faculty leave request. The faculty leave request application
developer will provide two functions:
+ One to produce all the possible departments and colleges. It would fulfill this with a live
  request to the Student Information System, and spit out something like:
  `["department: Anthropology", "department: History", "college: Liberal Arts", ...]`
  The specific text of each category would be completely up to the developer working on
  the faculty leave request application - ReqQuest only demands that they are all unique.
+ One to examine an App Request and determine which department and college it belongs to.
  * For stability and performance, we would probably create a "Confirm Your Info" Prompt
    to gather this information before the applicant submits, and store it permanently inside the
    application data. So if the applicant was in Engineering when they confirmed their info,
    they keep the Engineering category for the life of the application, or until they re-save
    that Prompt.
  * Knowing that the information exists in the "Confirm Your Info" Prompt, the developer can
    write a function that takes the App Request data and spits out
    `["department: Engineering", "college: College of Engineering"]`.

Now when an Administrator creates a Role, they can add a Grant that targets either ALL categories
or a single category. Similarly, they can make Exceptions that target all categories or a single
category.

### List of SubjectTypes / Permissions
* AppRequest (no Subjects, does have Tags)
  * View Others (ability to view your own is implicit and does not need to be granted)
  * Create/Submit/Accept Own (MVP has no capability to create on behalf of an applicant - become user may fill this anyway)
  * Submit Others (ability to submit your own is implicit)
  * Cancel Own
  * Cancel Others
  * Return Others
  * Return Own
* Prompt (has both Subjects and Tags)
  * View Own As Reviewer (view own as applicant is implicit)
  * View Others As Reviewer
  * Update Own As Reviewer (update own as applicant is implicit, no need to grant it)
  * Update Others As Reviewer (reviewers can be granted access to write over applicant prompts
    if desired but they never see the applicant's view)
  * (Phase 2) Configure (for instance, an Administrator could customize the question or help text that appears on a Prompt)
* Role (no Subjects, no Tags)
  * Manage Groups (group _membership_ is handled outside the system, each group has managers who can add/remove)
  * Manage Grants (must have both Manage Groups AND Manage Grants to create new roles)
* Requirement
  * (Phase 2) Configure (for instance, if there's an income limit, an Administrator may change the dollar amount)
  * (Proposed) Disable (stop evaluating this requirement or asking its prompts in all open requests)

# Activities
These are pretty well represented in the above discussion of Roles and Grants, but we'll
keep this section up to date so we have a simplified view for quicker understanding.

* Applicant creates new App Request
* Applicant updates Prompts
* Applicant does final review of entered data prior to submission
* Applicant submits App Request for review
* Applicant views prior App Requests on a dashboard
* Applicant views status of current App Request on a dashboard
* Applicant reviews their submitted App Request and sees all entered data
* Reviewer views list of App Requests with various filters
* Reviewer views a dashboard highlighting App Requests that need their attention
* Reviewer updates Prompts
* Reviewer sends App Request back to applicant for edits
* Reviewer closes App Request
* Administrator creates/updates Roles
* Administrator creates/updates Grants within Roles
* (phase 2) Applicant accepts an approved offer
* (phase 2) Administrator updates Prompt configurations
* (phase 2) Administrator updates Requirement configurations
* (proposed) Administrator disables/re-enables Requirements

# The application process

1. PREQUAL - In this phase, applicants do not know what programs are available. They
just start answering prompts.

2. QUALIFICATION - Once all PREQUAL prompts are answered, the applicant is presented with the
programs they may be eligible for. They are now in the QUALIFICATION phase. They now
have an application to fill out for each remaining program. They may also go backwards
in the process and change their answers if they think there's a mistake.

3. ELIGIBLE TO SUBMIT - Once all applications are complete, and at least one application
is still eligible, the App Request becomes eligible to submit but is still in the
QUALIFICATION phase. Ineligible applications remain unsubmitted and may be edited at any
time until the application deadline passes.

    The applicant will be prompted to review all the data they have entered and return to prompt
    screens to make desired changes. Changing answers may cause some applications or
    prompts to appear and/or disappear, but they should never have a prompt appear or disappear
    behind the spot that they are working.

4. PREAPPROVAL - After the applicant submits the App Request, it moves to the PREAPPROVAL phase.
In this phase, we are waiting for outside information systems to provide data. For instance, we
might be waiting on the Dynamic Forms tool to put a document in BDMS, or for Banner to show that
the applicant has enrolled in classes. Reviewers are not able to begin their process until these requirements
are met. Developers may opt to make requirements like this into APPROVAL requirements instead if
they want reviewers to begin their work immediately.

5. APPROVAL - Once all PREAPPROVAL requirements (if any) are met, we move to the APPROVAL phase.
Reviewers are able to access the Reviewer Detail screen, which shows a summary of all the Applications,
ApplicationRequirements, and RequirementPrompts. This includes RequirementPrompts answered by
the applicant, in addition to the next available ApplicationRequirements and RequirementPrompts
that need a response from the reviewer.

6. APPROVED - Once the reviewer has answered all appropriate prompts for an Application, it will automatically
move to APPROVED status (assuming no requirements came up DISQUALIFYING). Further automations
could pick up on this status and send information on to Banner or another outside system. Note:
if we want the reviewers to have a final manual approval, that can be a requirement like "reviewer affirms
that application is approved".

7. ACCEPTED - In some systems, there may be an acceptance step where the approval is actually an
offer of a benefit, and the applicant must accept the offer. In these cases, there will be at least
one Requirement with type ACCEPTANCE, and ReqQuest will add this step to the workflow. Automations
would wait on this status instead of APPROVED.

8. CLOSED - An automation process will CLOSE App Requests based on custom logic. Maybe
everything closes at the end of an application window, or 30 days after being approved/denied. This
will change from customer to customer so is outside the scope of ReqQuest. Once marked
as CLOSED, an App Request can no longer be updated without being re-opened, and all
determinations of eligibility are frozen in time. Changing the logic for a requirement will
not impact closed App Requests, however, an App Request that is re-opened must satisfy the
current logic. We will not preserve and apply historical logic.
