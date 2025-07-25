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

6. APPROVED / NOT_APPROVED - Once the reviewer has answered all appropriate prompts, each application
will automatically be designated as APPROVED or NOT_APPROVED. If at least one application is APPROVED, the
App Request as a whole will be marked as APPROVED, otherwise it will be marked as NOT_APPROVED. This
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

  All pre-submission requirements have been evaluated as passing (MET, WARNING, or NOT_APPLICABLE). The application is ready to be submitted.

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

Within the context of an individual application, we will store a PromptAnswer for each Prompt.
This represents the information collected from the user, and has a status of "answered" or not.

The Requirement is not given the information from the Prompt until it has been
fully answered. We don't want requirements making decisions based on incomplete or invalid
data. It is the responsibility of the project developer to write javascript code determining whether the
prompt has been sufficiently answered or is still incomplete. Note: generally the user is allowed to
save incomplete data and come back later. The project developer has discretion to disallow saving certain
data, like a large invalid upload, since that could have consequences.

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
