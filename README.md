# Overview

ReqQuest is a flexible development platform for any time that an organization offers a
program that provides a benefit to applicants who prove themselves eligible. It's
especially helpful in situations with complex requirements and branching logic.

Each time we build a ReqQuest project, developers, business process analysts, and the
program administrators will break down the process they're trying to model into programs
(there could be more than one), requirements (that must be satisfied to prove eligibility),
and the data that must be collected to satisfy the requirements. This breakdown inclues
both the applicant and reviewer process. They work much the same way - reviewers also
answer prompts that satisfy the review requirements.

UX/UI experts will then do a (hopefully quick) pass to create prompts - web forms that
elicit the data from applicants and reviewers. They'll have flexibility to create multiple
prompt screens and give each prompt clever functionality because each prompt is
a Svelte component.

Let's talk about requirements in a little more detail for a second. It's natural to
start thinking about requirements in a kind of general way. For instance, "applicant
must have income below $50k/year". That requirement makes sense to read, but in ReqQuest
requirements are more specific, and probably get broken down into pairs. For instance,
"applicant must provide proof that they make less than $50k/year" and "reviewer must
evaluate proof that applicant makes less than $50k/year". There is no need for reviewers
to "check off" on the applicant's requirements, they simply fulfill their
own set of review requirements.

Ideally, each requirement can be considered individually, without worrying too much about
other requirements in the system and the information they have already collected.

# Actors
* Applicant

  Submits an App Request stating eligibility to receive one or more benefits.
* Reviewer

  Reviews submitted applications and eventually gets them to approved status.
* Administrator

  Creates new application windows, manages roles, manages configurations.

These are conceptual actors that we will use for the purposes of this document, but
be aware that the role system allows the creation of other types of actor. For instance,
each program might have its own set of reviewers, or you could have special "final
approval" reviewers to enforce an approval workflow. Administrators might be divided
into role management admins and configuration management admins.

# Multiple programs
One of ReqQuest's main distinguishing features is support for multiple programs in the same
App Request. By the same App Request, I mean that applicants submit to all programs in a single
submission.

ReqQuest's multi-program support is NOT intended to support multiple programs with
different deadlines and unrelated benefits. It's intended to support situations where
multiple programs are available to support one of the applicant's needs at a particular
time.

For instance, if you have 4 scholarships that are all available to help a student
pay for a semester of school, that fits because ReqQuest can help them apply once and get
all the benefits they qualify for.

On the other hand, what if you have some processes that support faculty, like a
sabbatical request form and a request for a promotion to tenure? Those may seem related
because they are for faculty, but those programs are related to different faculty needs,
and require independent requests. They do not belong in the same ReqQuest project, but
you could absolutely create two ReqQuest projects and an overview webpage in your
CMS linking to each one.

## Quick Definition: Application
An application is the portion of an App Request that relates to a particular
program. For instance, if you have 4 scholarship programs, an applicant will create an App
Request that contains 4 applications - one for each scholarship.

# The App Request process

Each App Request goes through the following phases on its way through the system.

1. PREQUAL (optional) - In this phase, applicants do not know what programs are available or
which ones they should apply to. They start answering prompts and at the end of PREQUAL, the
ReqQuest will help them understand which programs are relevant to them. A ReqQuest project may
skip this phase entirely if they only have one program or if users will not be confused by
immediately choosing a program to begin working on.

2. QUALIFICATION - The main pre-submission phase is the QUALIFICATION phase. Applicants
fill out prompts that are organized beneath each of the programs. When they are done with this
phase, their request is ready to submit for review. If all applications are ineligible, the
App Request is stuck in this phase until closure or until the applicant changes their answers.

3. POSTQUAL (optional) - In some ReqQuest projects, there will be acknowledgements that the applicant
must agree to before they can submit their request, but they are not particularly related to any
of the programs. For instance, if the applicant must agree to a code of conduct or acknowledge
that they understand the system's privacy policy, those can be added as POSTQUAL requirements. They
will be shown to the applicant outside the context of any individual program, just before they
review their entire request and submit it.

3. READY TO SUBMIT - Once all applications are complete, and at least one application
is still eligible, the App Request becomes eligible to submit.

    The applicant will be prompted to review all the data they have entered and return to prompt
    screens to make any desired changes. Changing answers may cause some applications or
    prompts to appear and/or disappear, but they should never have a prompt appear or disappear
    behind the spot that they are working.

4. PREAPPROVAL (optional) - In some ReqQuest projects, there will be requirements that can
be automatically evaluated instead of requiring a human reviewer. __If__ the reviewers would
prefer to wait for automated evaluations before they begin their work, the team may add PREAPPROVAL
requirements to the project. Prompts that belong to these requirements will never be shown to humans,
they will only receive data from automation processes.

    For instance, if a student is required to enroll in courses, they may submit their App Request before
    they have enrolled, and a PREAPPROVAL requirement can wait for their enrollment to show up in
    the Student Information System before their App Request is allowed to proceed.

5. APPROVAL - This is the main post-submission phase. Reviewers are able to begin answering their
prompts (and depending on permissions, editing/correcting the applicant's prompts). This phase continues
until the applications are all approved or denied.

6. APPROVED / DISQUALIFIED - Once the reviewer has answered all appropriate prompts, each application
will automatically be designated as APPROVED or DISQUALIFIED. If at least one application is APPROVED, the
App Request as a whole will be marked as APPROVED, otherwise it will be marked as DISQUALIFIED. This
designation at the App Request level is mostly for display convenience so that it's easy to tell the
difference between requests that ended in benefits and those that ended without benefits. Automations
would likely be configured to respond to individual applications and their status. Automations can also
be configured to wait for the App Request to be closed.

    Note: An App Request can "jump" to this phase if all applications are disqualified early.

7. ACCEPTANCE (optional) - In some projects, there may be an acceptance step where the approval
is actually an offer of benefits, and the applicant must accept the offer. In these cases,
there will be at least one Requirement with type ACCEPTANCE, and ReqQuest will add this step
to the workflow. Automations would wait on the ACCEPTED status instead of APPROVED.

8. CLOSED - All App Requests are automatically CLOSED after their period's Archive date. They
can also be manually closed by reviewers with the appropriate permission. Once marked as CLOSED, an
App Request can no longer be updated without being re-opened (re-open is unavailable
after the associated period's archive date). All collected data and determinations of eligibility
are frozen in time. Changing the code for a requirement will not impact closed App Requests;
however, an App Request that is re-opened must satisfy the current logic. We will not preserve and
apply historical code, but we DO preserve and apply historical configurations (like an income
threshold on an income-related requirement).

    Note: CLOSED is an independent status for the App Request. It does not change the status that the
    App Request had pre-closure. For instance, an App Request that was in the APPROVAL phase, still
    being reviewed, at the time of closure will keep its APPROVAL status forever. It will just also
    be marked as closed. If we had CLOSED overwrite the status, we would have a hard time figuring out
    whether the App Request was APPROVED or DISQUALIFIED or ACCEPTED before closure.

# Role Management
ReqQuest has a rich role management system that allows administrators to create flexible
roles for a variety of situations. We dive into the details in the Detailed Definitions section,
but to give you a brief idea, it is be possible to permission each prompt in the system individually,
so you can make roles like "final approver", where most reviewers do not have permission to the
"final approval" prompt, but the "final approver" role does.

Additionally, it is possible for developers to assign special "tags" to App Requests that can
then be used to further restrict access. So for example, you could create a prompt that asks the applicant
what state they live in, a developer could set up the system to use their answer to tag the App Request with
their state, and you could create a role that only has final approval rights for applicants who live in Texas.

# Detailed Definitions
* App Requests
  * Programs / Applications
    * Requirements / ApplicationRequirements
      * Prompts / PromptAnswers
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

### Application Statuses
* PREQUAL

  The appRequest has not finished pre-qualification yet. Since pre-qualification determines which applications
  are relevant, this application is not yet relevant and should not appear in the applicant UI. This status is only
  possible if there is at least one PREQUAL requirement.

* QUALIFICATION

  The application has been pre-qualified and is awaiting further input from the applicant.

* READY_TO_SUBMIT

  All pre-submission requirements have been evaluated as MET or NOT_APPLICABLE. The application is ready to be submitted.

* PREAPPROVAL

  The application has been submitted and at least one PREAPPROVAL requirement exists and is PENDING.

* APPROVAL

  The application has been submitted, has passed preapproval, and is awaiting approval.

* APPROVED

  The application has passed all requirements.

* FAILED_PREQUAL

  The applicant is ineligible for the program according to the pre-qual requirements. The application/program should no longer be visible in the navigation for this appRequest, but may still be visible on the PreQual Review screen.

* FAILED_QUALIFICATION

  The applicant is ineligible for the program according to the qualification requirements. The application/program should remain visible in the UI and any applicable statusReason from the associated requirements should be displayed.

* NOT_APPROVED

  The applicant will not be receiving the benefit because they failed a requirement in the pre-review or review phase. We
  should be careful not to use strong language like DENIED or DISQUALIFIED because it's possible they simply did not
  make the cut in a competitive pool of applicants. The statusReason can provide more information.

* ACCEPTANCE

  The application has been approved and an offer has been submitted for applicant acceptance.
  This status is only possible for programs with at least one ACCEPTANCE requirement.

* ACCEPTED

  The application\'s benefit has been accepted by the applicant. This status is only possible for programs with at least one ACCEPTANCE requirement.

* NOT_ACCEPTED

  The application\'s benefit was rejected by the applicant. This status is only possible for programs with at least one ACCEPTANCE requirement.

* CANCELLED

  The App Request (and thus all applications inside it) has been cancelled by the applicant. Individual
  applications cannot be cancelled. If you want applicants to be able to opt out of individual programs,
  you should add a requirement to each program to the effect of "applicant must not opt-out". In this
  case, the application status would be FAILED_QUALIFICATION instead of CANCELLED. The statusReason can
  explain in sentence form that the applicant opted out.

* WITHDRAWN

  The App Request (and thus all applications inside it) was withdrawn after being submitted. If it is re-opened, it will re-open in submitted state.

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

To collect the necessary information, each Requirement depends on a list of Prompts. After
each prompt is answered, the requirement will analyze the information gathered and come up
with a status (see ApplicationRequirement Statuses below) and a statusReason (a brief sentence
or two describing why the requirement was marked the way that it was, especially when it
is marked as disqualifying). The developer is responsible for writing javascript
code that implements a Requirement's logic.

Requirements are allowed to share Prompts. The Prompt will appear in navigation under
the first applicable Requirement that depends on it. For example, you might not do it
this way, but you could create an "applicant is under 6 feet tall" requirement and a second
"applicant is over 5 feet tall" requirement, and both requirements could share a "how tall
are you" prompt.

Within the context of an individual Application, we have an ApplicationRequirement. The
ApplicationRequirement represents the current status of a Requirement within a particular
applicant's Application.

### Requirement Types
Each requirement belongs to a certain phase of the application process. These phases were
discussed in detail above, but the general idea is that some requirements are intended
for the applicant to resolve, and some the reviewer(s).
* PREQUAL
* QUALIFICATION
* POSTQUAL
* PREAPPROVAL
* APPROVAL
* ACCEPTANCE

### ApplicationRequirement Statuses
Status is updated on each requirement, each time we collect new Prompt data. The status
should be PENDING until we are confident about one of the other statuses. Collecting data
from future prompts should not change the status, but of course changing answers in past
prompts could change the status.

* PENDING
* MET
* DISQUALIFYING
* WARNING - This status gives us a little bit of wiggle room in our process. It's meant to
communicate to the user that they _probably_ do not qualify, but they can continue to enter
information, and another requirement will allow a reviewer to make the final decision on their
eligibility. The applicant will be shown a custom message describing the problem.
* NOT_APPLICABLE - This requirement does not apply to the applicant. They will be allowed to
proceed as if the requirement has been met.

### Never-Disqualifying Requirements
_This is an advanced topic, feel free to skip it until you're more comfortable with ReqQuest._

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

## Prompts and PromptAnswers
Prompts represent the collection of data from our users (both applicants and reviewers). Each
prompt defines a webform which fits on a single screen (though it could use a tabbed UI to feel
like multiple screens). It could be as simple as a yes-or-no question, or as complicated as
uploading a document and answering a series of questions about its content.

Individual prompts can also handle some shallow branching logic, like you answer
a yes-or-no question and based on the answer the Prompt asks you a followup question. Branching
logic can also be handled with additional Requirements. It will be up to the developers and
designers to decide what's most appropriate.

Within the context of an individual application, we will store a PromptAnswer.
This represents the information collected from users, and has a status of "answered" or not.

The Requirement is not given the information from the Prompt until it has been
fully answered. We don't want requirements making decisions based on incomplete or invalid
data. It is the responsibility of the developer to write javascript code determining whether the
prompt has been sufficiently answered or is still incomplete. Note: generally the user is allowed to
save incomplete data and come back later. The developer has discretion to disallow saving certain
data, like a large invalid upload, since that could have consequences.

## Roles
Roles represent a set of access privileges that can be assigned to a group of users. Each
Role is linked to one or more ActiveDirectory groups. Membership in the groups is managed
outside the system, but which groups go with which Roles is managed within the system. If
the Role lists multiple groups, the group memberships are merged and everyone has the Role.

Each Role has a list of Grants and Exceptions.

### SubjectTypes and Subjects
A SubjectType represents a certain type of data, many of which we've already discussed,
like Prompt and Requirement.

A Subject represents one example of a SubjectType, so for instance, if "Prompt" is the SubjectType,
one of the Subjects might be the "Upload your Driver's License" Prompt.

When you create a Grant, you'll always choose a SubjectType for the Grant. If that SubjectType
also has Subjects, you'll either choose one or leave it blank to make the Grant affect ALL Subjects.

Some SubjectTypes do theoretically have Subjects, but too many to add them individually to Roles.
For example the SubjectType "AppRequest" will eventually number in the tens of thousands in the
database, but creating a role to allow access to a single applicant's request would be
ridiculous, so the system doesn't allow it.

## Grants and Exceptions
Each Grant bestows permission on one SubjectType. You may then select one or more Subjects
of that SubjectType, or leave it blank to make the grant apply to everything.

If you choose ALL subjects, you may save your Grant and then add an Exception that removes
the same permission from a single subject.

Once the role has all of its grants and exceptions, it only _adds_ permissions to the user,
after removing exceptions.

For instance, consider a system with two reviewer roles: one that grants update on all Prompts
except reviewing driver's licenses, and another granting the review of driver's licenses. A
user could be placed in both roles and now they are able to review everything including
driver's licenses.

Note: If a user has both applicant and reviewer roles, the actions available to them will
be based on which screen they are on. For instance, there is an applicant dashboard and a
reviewer dashboard - separate screens. In addition, there are a set of screens for submitting
as an applicant and a separate set of screens for reviewing an application.

### Tags
There are two cases where being able to choose individual subjects is not enough. One is when the
subject list is theoretically infinite. We're absolutely not going to create a role that can only
update a single App Request. Two is when we want to restrict on two things at once. For instance, if
I want to allow a reviewer to update a single prompt for App Requests where the applicant lives
in Texas, I've got two restrictions, one for the Prompt subject type and a specific Prompt subject,
and another for App Requests filed from Texas.

To support these cases, developers will have the opportunity to provide code that assigns "tags"
to App Requests. Now while granting permissions to a role, the administrator will be able to limit
their grant to one or more of the tags available in the system. Administrators __cannot__ create new
ways of tagging - that would take a developer and a software update.

As an example, let's think about that faculty leave request. The faculty leave request application
developer will provide two functions:
+ One to produce all the possible departments and colleges. It would fulfill this with a live
  request to the Student Information System, and spit out something like:
  `["department: Anthropology", "department: History", "college: Liberal Arts", ...]`
  * The specific text of each tag would be completely up to the developer working on
    the faculty leave request application - ReqQuest only demands that they are all unique.
+ One to examine an App Request and determine which department and college it belongs to.
  * We would create a "Confirm Your Info" Prompt to gather this information before the applicant
    submits, and store it permanently inside the application data. So if the applicant was in
    Engineering when they confirmed their info, they keep the "department: Engineering" tag for
    the life of the application, or until they re-save that Prompt.
  * Knowing that the information exists in the "Confirm Your Info" Prompt, the developer can
    write a function that takes the App Request data and spits out
    `["department: Engineering", "college: College of Engineering"]`.

Now when an Administrator creates a Role, they can add a Grant that targets either ALL tags
or a single tag. Similarly, they can make Exceptions that target all tags or a single
tag.

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
  * Configure (for instance, an Administrator could customize the question or help text that appears on a Prompt)
* Role (no Subjects, no Tags)
  * Manage Groups (group _membership_ is handled outside the system, each group has managers who can add/remove)
  * Manage Grants (must have both Manage Groups AND Manage Grants to create new roles)
* Requirement
  * Configure (for instance, if there's an income limit, an Administrator may change the dollar amount)
  * (Proposed) Disable (stop evaluating this requirement or asking its prompts in all open requests)

# Activities
These are pretty well represented in the above discussion of Roles and Grants, but we'll
keep this section up to date so we have a simplified view for quicker understanding.

* Applicant creates new App Request
* Applicant updates Prompts
* Applicant does final review of entered data prior to submission
* Applicant cancels request before submitting it
* Applicant un-cancels request
* Applicant submits App Request for review
* Applicant views prior App Requests on a dashboard
* Applicant views status of current App Request on a dashboard
* Applicant reviews their submitted App Request and sees all entered data
* Applicant withdraws request after submitting it
* (phase 2) Applicant accepts an approved offer
* Reviewer views list of App Requests with various filters
* Reviewer views a dashboard highlighting App Requests that need their attention
* Reviewer updates Prompts
* Reviewer sends App Request back to applicant for edits
* Reviewer closes App Request
* Reviewer re-opens App Request
* (phase 2) Reviewer sends App Request to applicant with an offer to be accepted
* Administrator creates/updates Periods
* Administrator creates/updates Roles
* Administrator creates/updates Grants and Exceptions within Roles
* Administrator updates Prompt configurations within an upcoming period
* Administrator updates Requirement configurations within an upcoming period
* (phase 2) Administrator disables/re-enables a Requirement in a period
* (phase 2) Administrator disables/re-enables a Program in a period
