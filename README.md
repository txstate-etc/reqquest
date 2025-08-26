# Overview

ReqQuest is a flexible development platform for any time that an organization offers a
program that provides a benefit to applicants who prove themselves eligible. It's
especially helpful in situations with complex requirements and branching logic.

Each time we build a ReqQuest project, developers, business process analysts, and the
program administrators will break down the process they're trying to model into programs
(there could be more than one), requirements (that must be satisfied to prove eligibility),
and the data that must be collected to satisfy the requirements. Requirements are further
broken down into applicant and reviewer requirements, depending on whom we expect to provide
the data.

UX/UI experts will then do a (hopefully quick) pass to create prompts - web forms that
elicit the data from applicants and reviewers. They'll have flexibility to create multiple
prompts as needed and include clever functionality because each prompt is a Svelte component.

Let's talk about requirements in a little more detail for a second. It's natural to
start thinking about requirements in a kind of general way. For instance, "applicant
must have income below $50k/year". That requirement makes sense to read, but in ReqQuest
requirements are more specific, and probably get broken down into pairs. For instance,
"applicant must provide proof that they make less than $50k/year" and "reviewer must
evaluate proof that applicant makes less than $50k/year". There is no need for reviewers
to "check off" on the applicant's requirements, they simply fulfill their
own set of requirements.

Ideally, each requirement can be considered individually, without worrying too much about
other requirements in the system and the information they have already collected.

# Actors
* Applicant

  Submits an App Request stating eligibility to receive one or more benefits.
* Reviewer

  Reviews submitted applications and eventually gets them to approved status.
* Second Eyes Reviewer

  Fills out prompts in the workflow stage of one or more applications, in order to check
  the work of a reviewer.
* Administrator

  Creates new application windows, manages roles, manages configurations.

These are conceptual actors that we will use for the purposes of this document, but
be aware that the role system allows the creation of other types of actor. For instance,
each program might have its own set of reviewers, or you could have special "final
approval" reviewers to enforce an approval workflow. Administrators might be divided
into role management admins and configuration management admins.

# Multiple programs
One of ReqQuest's main distinguishing features is support for multiple programs in the same
App Request. By the same App Request, we mean that applicants submit to all programs in a single
submission.

ReqQuest's multi-program support is NOT intended to support multiple programs with
different deadlines and unrelated benefits. It's intended to support situations where
multiple programs are available to support one of the applicant's needs at a particular
time.

For instance, if you have 4 scholarships that are all available to help a student
pay for a semester of school, ReqQuest can help them apply once and get one or more of
the scholarships - as many as they qualify for.

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
which ones they should apply to. They start answering prompts and at the end of PREQUAL,
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

    The applicant will be shown all the data they have entered and return to prompt
    screens to make any desired changes. Changing answers may cause some applications or
    prompts to appear and/or disappear, but they should never have a prompt appear or disappear
    behind the spot that they are working.

4. PREAPPROVAL (optional) - In some ReqQuest projects, there will be requirements that can
be automatically evaluated instead of requiring a human reviewer. __If__ the reviewers would
prefer to wait for automated evaluations before they begin their work, the team may add PREAPPROVAL
requirements to the project. Prompts that belong to these requirements will never be edited by humans,
they will only receive data from automation processes.

    For instance, if a student is required to enroll in courses, they may submit their App Request before
    they have enrolled, and a PREAPPROVAL requirement can wait for their enrollment to show up in
    the Student Information System before their App Request is shown to reviewers as needing attention.

5. APPROVAL - This is the main review phase. Reviewers are able to begin answering their
prompts (and depending on permissions, editing/correcting the applicant's prompts). This phase continues
until the applications are all approved or denied.

6. BLOCKING WORKFLOW (optional) - Each application can independently be configured for a second set
of eyes to confirm the review _before_ the result is released to the applicant. This phase is not visible
at the app request level, it just appears to be in the APPROVAL phase. Each application can be in its own
workflow stage. A workflow stage contains requirements and prompts just like the rest of the review process,
so it can be as simple as one prompt ("yes this all looks good") or many prompts (one for each major portion
of the review).

7. REVIEW_COMPLETE - Once the reviewer (and blocking workflow reviewers) have answered all appropriate prompts,
each application will automatically be designated as ELIGIBLE or INELIGIBLE instead of PENDING. Once no
applications are PENDING, the App Request as a whole will be marked as REVIEW_COMPLETE. A reviewer is now able
to publish the results to the applicant.

8. APPROVED / NOT_APPROVED - Once the app request results are published to the applicant, the app request
will be marked as either APPROVED or NOT_APPROVED. It is APPROVED if at least one application was found
to be ELIGIBLE. This is mostly for display purposes, the actual approvals at the application level are
more important.

9. ACCEPTANCE (optional) - In some projects, there may be an acceptance step where the approval
is actually an offer of benefits, and the applicant must accept the offer. In these cases,
there will be at least one Requirement with type ACCEPTANCE. ReqQuest will recognize this and set the app
request status to ACCEPTANCE instead of APPROVED after the results are published to the applicant. From
there, the applicant will have more prompts to answer (e.g. "yes, I accept" or perhaps "yes I accept $500
out of the $1000 offered"). Automated integrations should wait on the ACCEPTED status instead of APPROVED.

10. NON-BLOCKING WORKFLOW (optional) - In some systems, we will have a need for a second set of eyes to
come into each app request and ensure that everything was done correctly. This could be for training purposes
or to satisfy audit requirements, but does not interfere with the main app request process - the user will
be awarded or denied the benefit before non-blocking workflow starts.

11. CLOSED - All App Requests are automatically CLOSED after their period's Archive date. They
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

### Application Status
Application status represents the current state of the eligibility of the application.
* PENDING

  The application is usually in this status while it is being entered or reviewed.
* ELIGIBLE

  The application is currently eligible for the benefit offered by the program, but there could
  be further review or blocking workflow stages.
* INELIGIBLE

  The application is currently ineligible for the benefit offered by the program. Blocking
  workflow stages should still be completed.
* ACCEPTED

  An offer was made to the applicant, and they accepted or partially accepted it.
* REJECTED

  An offer was made to the applicant, but they rejected it.

Occasionally when the application is ready to move to a new phase, the status will change
temporarily to ELIGIBLE or INELIGIBLE, only to return to PENDING in the new phase. For example,
when the application is READY_TO_SUBMIT, it may briefly become ELIGIBLE before being submitted,
but then go back to PENDING while the reviewers are doing their part.

### Application Phase
Application phase represents where the application is in the process, regardless of whether it is
currently eligible or ineligible for the benefit. Even rejected applications continue to work through
the phases, since we need to perform blocking and non-blocking workflow stages on all applications, not
just the ones that are awarded a benefit.

* PREQUAL

  The appRequest has not finished pre-qualification yet. Since pre-qualification determines which applications
  are relevant, this application is not yet relevant and should not appear in the applicant UI. This status is only
  possible if there is at least one PREQUAL requirement.
* QUALIFICATION

  The application has been pre-qualified and is awaiting further input from the applicant.
* READY_TO_SUBMIT

  All pre-submission requirements have been evaluated as passing (MET, WARNING, or NOT_APPLICABLE). The application
  is ready to be submitted. Applications that do not qualify for the benefit remain in whichever phase they were
  disqualified in.
* PREAPPROVAL

  The application has been submitted and at least one PREAPPROVAL requirement exists and is PENDING.
* APPROVAL

  The application has been submitted, has passed preapproval, and is awaiting approval.
* READY_FOR_WORKFLOW

  All review requirements have been resolved as non-PENDING, the application is ready to be moved into
  the first non-blocking workflow stage. If there is no non-blocking workflow, this phase is skipped
  and we proceed to REVIEW_COMPLETE.

  This phase is also used for applications that are in a workflow stage and all its requirements are
  passing. The application is ready to move to the next non-blocking workflow. If there are no later non-blocking
  workflow stages, this phase is skipped and we proceed to REVIEW_COMPLETE.
* WORKFLOW_BLOCKING

  The application is currently in a blocking workflow stage with one or more PENDING requirements. We are waiting
  on the workflow stage reviewer to come and answer prompts.
* REVIEW_COMPLETE

  The application has been reviewed and all requirements are non-PENDING. This application is ready to be released
  to the applicant. It will wait in this phase for all other applications to reach REVIEW_COMPLETE, then the whole
  app request may be released to the applicant by a reviewer.
* ACCEPTANCE

  The application has been released to the applicant and there is at least one ACCEPTANCE requirement that is PENDING. We are waiting for the applicant to come and answer acceptance prompts.
* READY_TO_ACCEPT
  All ACCEPTANCE requirements have been satisfied and are non-PENDING. The applicant may now finalize the
  application by submitting their acceptance.
* WORKFLOW_NONBLOCKING
  Now that the application results have been revealed to the applicant, and the applicant accepted the benefit,
  the application proceeds through any non-blocking workflow stages. In the current workflow stage, there are
  PENDING requirements that must be resolved before the application can move forward to the next workflow stage.

  The READY_FOR_WORKFLOW status will re-appear at the end of each non-blocking workflow stage, when the application
  is ready to move to the next one. When the last non-blocking workflow stage is complete, the application will
  move to the COMPLETE phase.
* COMPLETE

  There is nothing left to do on this application. Other applications may still be working through their own
  non-blocking workflow stages.

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
* WORKFLOW

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

### Requirement Order
_This is an advanced topic, feel free to skip it until you're more comfortable with ReqQuest._

Requirements are added to the system in a specific order, but this order is mostly for display purposes. The
first prompt from each requirement will be shown to the user, regardless of the status of any previous
requirements.

Some requirements will have `promptKeysAnyOrder`. All prompts listed this way will be treated as the
first prompt and all will be displayed.

In situations where we have override prompts or other prompts that should not be shown until the user
has answered another prompt, we can depend on that other prompt first. This way the later prompts will
stay hidden until the first prompt is answered. The prompt will not appear twice on the same form just because
two different requirements depended on it.

## Prompts and PromptAnswers
Prompts represent the collection of data from our users (both applicants and reviewers). Each
prompt defines a webform which fits on a single screen (though it could use a tabbed UI to feel
like multiple screens). It could be as simple as a yes-or-no question, or as complicated as
uploading a document and answering a series of questions about its content.

Individual prompts can also handle some shallow branching logic, like you answer
a yes-or-no question and based on the answer the Prompt asks you a followup question. Branching
logic can also be handled with additional Requirements. It will be up to the developers and
designers to decide what's most appropriate.

Within the context of an individual application, we will store a PromptAnswer for each Prompt.
This represents the information collected from the user, and has a status of "answered" or not.

The Requirement is not given the information from the Prompt until it has been
fully answered. We don't want requirements making decisions based on incomplete or invalid
data. It is the responsibility of the project developer to write javascript code determining whether the
prompt has been sufficiently answered or is still incomplete. Note: generally the user is allowed to
save incomplete data and come back later. The project developer has discretion to disallow saving certain
data, like a large invalid upload, since that could have consequences.

## Workflow Stages
A workflow stage is defined by a set of requirements. These requirements are oriented around reviewing
the review process itself, so that each application can be evaluated by two people.

One major distinguishing factor for workflow stages is that they will be completed regardless of
whether the application was found to be eligible or ineligible. Even denied applications need to
be reviewed for correctness.

Each program can have as many workflow stages as needed, so we can set it up for multiple rounds
of reviews. They are defined by the developer in a specific order.

Once all the requirements in a workflow stage have been met, any reviewer can push a button to
move the application to the next stage (or out of workflow and into acceptance or completion).

### Blocking vs Non-Blocking Workflow Stages
Each workflow stage may be designated as blocking or non-blocking. Blocking stages must be fully
completed before the application result can be shown to the applicant, while non-blocking stages
will be completed after the applicant has received the result and (if applicable) accepted or
rejected the offer.

So blocking workflow is for situations where the benefit should not be granted until the second
person has evaluated the application for correctness, while non-blocking workflow is for situations
where the correctness evaluation is only there for training and reporting purposes.

Non-blocking workflow is ideal when the desire is not to slow down the overall process with reviews,
and when it's not necessary to review every submission.

## Roles
Roles represent a set of access privileges that can be assigned to a group of users. Each
Role is linked to one or more groups (e.g. loaded from ActiveDirectory). Membership in the groups
is managed outside ReqQuest, but which groups go with which Roles is managed within ReqQuest. If
the Role lists multiple groups, the group memberships are merged and everyone has the Role.

Each Role has a list of Grants and Exceptions.

## Grants
Each Grant bestows one or more controls from a single Control Group.

### Controls and Control Groups
A control is a specific permission that allows the user to perform a specific action
in a specific circumstance. For instance, "create a new app request for myself" is one control,
while "create a new app request for others" is an entirely separate control. See below for a full
list of controls.

Some permissions are granted implicitly, like "view your own app requests", "submit your own app requests",
and "view applicant-phase prompt data from your own app requests". You won't find controls for these because
disallowing them would make no sense.

Control Groups are a way to group related controls together to make the process of creating grants
more convenient. Controls can only live in the same group if they work on the same type of data and have
the same set of available restrictions (see below for more on restrictions).

Groups should be further split so that it would make sense to grant all the controls at the same time. For
instance, "create a new app request for myself" and "create a new app request for others" are in different groups
because one is for applicants and the other is for staff members. "create an app request for yourself" isn't a
a common permission for staff members, so for clarity, it shouldn't get mixed in. You can still make a role
that has both permissions, but you would create two separate grants.

### Restrictions / Tags
Each time you grant a control, you can restrict your grant to a specific set of Tags. These tags
vary from control group to control group, because different permissions have different ways that you
might want to restrict them.

For instance, if you grant permission to answer prompts, you might want to restrict your grant to
prompts that are part of a specific program, or restrict it to a specific prompt (like a "final approval"
prompt).

ReqQuest provides downstream project developers with the ability to define their own tags, by adding
code to one of the prompts that they create. For instance, if you have a faculty leave request
application, you might want to restrict some permissions to a specific department or college. The
developer can write code that produces a list of all the departments and colleges, and then
assigns tags to App Requests based on the department and college that the applicant selects in a
"Confirm Your Info" prompt.

These tags can then be used by role administrators to restrict grants, for instance, creating a
role that is a reviewer for all App Requests that have been tagged as College of Engineering.

Administrators __cannot__ create new ways of tagging - that would take a developer and a software
update.

## Exceptions
Grants add permissions to a role, possibly with restrictions. But what if you want to
grant a permission for everything __except__ a specific set of tags? For instance, you
might want to create a role that allows a user to review all App Requests NOT tagged as
"College of Engineering". This is where exceptions come in.

First you create a grant that allows the user to review all App Requests, with no restrictions.
Then you create an exception, and select the same control group and controls as your grant.
To finish, you select a set of tags to define the exception. In our example, you would select
the "College of Engineering" tag.

Once you save your exception, the role __cannot__ grant the permission to review App Requests
tagged with "College of Engineering", no matter how many grants you add. So the combined
effect of your grant and your exception is that the user can review all App Requests except
those tagged with "College of Engineering".

A major advantage to this approach is that as new colleges are added to the system, the role
automatically gets access to them, without needing to update the role. If you had
created a grant that whitelisted access to an exhaustive list of colleges but not engineering,
you would have to update the role every time a new college was added.

### Exceptions and users with multiple roles
Keep in mind, exceptions only apply to the __role__. Once the role has resolved all of
its grants and exceptions, the role itself can only _add_ permissions to the user.

For instance, consider a system with two reviewer roles: one that grants "update" on all Prompts
_except_ reviewing driver's licenses, and another granting the review of driver's licenses. A
user could be placed in the first role to review everything except driver's licenses, and then added
to the second role to add the ability to review driver's licenses. Now they are able to review
everything, including driver's licenses.

Note: If a user has both applicant and reviewer roles, the actions available to them will
be based on which screen they are on. For instance, there is an applicant dashboard and a
reviewer dashboard - separate screens. In addition, there are a set of screens for submitting
as an applicant and a separate set of screens for reviewing an application.

### List of Control Groups / Controls

#### AppRequestOwn (Applicant - Applicant Phase, *no restrictions/tags*)
- create — Create an appRequest for oneself.
- cancel — Cancel one's own appRequest while in the applicant phase.
- uncancel — Re-open one's own appRequest that was cancelled in the applicant phase.

#### AppRequestOwnReview (Applicant - Reviewer Phase, *tags: AppRequest tags*)
- withdraw — Withdraw one's own appRequest while in the reviewer phase.
- unwithdraw — Re-open one's own withdrawn appRequest (one that was cancelled while in the reviewer phase).

#### AppRequest (Reviewer - Review Phase, *tags: AppRequest tags*)
- submit — Submit an appRequest when all requirements pass, even if you are not the applicant.
- close — Close an appRequest to further edits. Each application and requirement will keep their current status. This will happen automatically when the period's archive date is reached, but can also be done manually by a reviewer.
- reopen — Reopen an appRequest that has been closed (must be in a valid period).
- reopen_any — Reopen any appRequest that has been closed, even in an old period or when it was withdrawn by the applicant.
- return — Return an appRequest in the reviewer phase to the applicant phase.
- review — See an appRequest in the reviewer list interface.
- review_own — Allow reviewers to act as reviewers on their own requests. Any permission they have, from any role, related to reviewing will now also apply to their own appRequests. Use with caution.
- offer — Make an offer to the applicant (move the request from the review phase to the acceptance phase). Only applies in projects/periods where there is at least one enabled ACCEPTANCE requirement.

#### AppRequestPreReview (Reviewer - Applicant Phase, *no restrictions/tags*)
- create — Create an appRequest on someone else's behalf.
- uncancel — Re-open any appRequest that was cancelled in the applicant phase.

#### Application (Reviewer - View Applications, *tags: program, AppRequest tags*)
- view — View application as a reviewer in an AppRequest (requires AppRequest.review to see the reviewer interface).

#### ApplicationRequirement (Reviewer - Requirement Statuses, *tags: requirement, AppRequest tags*)
- view — View requirement status in an AppRequest (requires AppRequest.review to see the reviewer interface).

#### PromptAnswer (Reviewer - View and Update Prompt Data, *tags: prompt, AppRequest tags*)
- view — View prompt data as a reviewer in an AppRequest.
- update — Update any individual appRequest's prompt data during the review phase.
- update_anytime — Update this prompt as a reviewer even if the appRequest is not yet submitted or awaiting acceptance or pre-approval automations.

#### Prompt (Admin - Configure Prompts, *tags: prompt*)
- view — View the configuration management interface and see prompt configuration data.
- configure — Configure the way that a prompt works for all appRequests in a period.

#### Requirement (Admin - Configure Requirements, *tags: requirement, program*)
- view — View requirement configuration data.
- configure — Configure the way that a requirement works for all appRequests.
- disable — Disable/Enable a requirement for all appRequests in a period.

#### Program (Admin - Configure Programs, *tags: program*)
- view — See the current configuration for this program.
- configure — Configure the way that a program works for all appRequests in a given period.
- disable — Disable/Enable a program for all appRequests in a given period.

#### Period (Admin - Manage Periods, *no restrictions/tags*)
- view — View the period management interface and see all the periods.
- view_configuration — View the configuration management interface for a period.
- create — Create new periods.
- update — Update existing periods.
- delete — Delete existing periods.

#### Role (Admin - Manage Roles, *no restrictions/tags*)
- view — View the role management interface and see all the roles, grants, exceptions, groups, and users associated with each.
- create — Create new roles.
- update — Update existing roles.
- delete — Delete existing roles.

# Activities

This section summarizes the main activities users can perform in ReqQuest. Activities are grouped by user type for clarity.

**Applicant Activities**
- Create a new App Request
- Update and answer prompts
- Review and finalize entered data before submission
- Cancel or uncancel an App Request before submission
- Submit an App Request for review
- View prior and current App Requests and their statuses on a dashboard
- Review submitted App Requests and see all entered data
- Withdraw or unwithdraw a submitted App Request during the reviewer phase
- Accept or decline an offer (if applicable) by filling out acceptance prompts

**Reviewer Activities**
- View the list of App Requests with filters
- View dashboards highlighting App Requests needing attention
- Review and update prompt data during the review phase
- Return an App Request to the applicant phase
- Close or reopen App Requests
- Make an offer to the applicant (if applicable)
- View and update application and requirement statuses
- Send App Request back to applicant for edits

**Administrator Activities**
- Create, update, or delete Periods
- Create, update, or delete Roles
- Create, update, or delete Grants and Exceptions within Roles
- Update Prompt configurations for upcoming periods
- Update Requirement configurations for upcoming periods
- Enable or disable Requirements or Programs in a period

If your project has additional phases or custom activities, be sure to add them here to keep this list up to date.
