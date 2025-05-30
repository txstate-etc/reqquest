* Applicant Dashboard (entry point for applicants)
  * Create a new App Request
    * Select a period to create the app request in, if more than one is open
  * View list of open / relevant / recent app requests
    * Ability to cancel / withdraw an app request
  * Navigate to App Request Applicant UI, if app request is open and in applicant phase
    * Prompt screens for all applicant-phase prompts, in sequence, with some ability to navigate
      * Fill in any number of form fields making up the prompt, as designed by the downstream ReqQuest project developers/designers
      * Ability to save answers and return later
      * Ability to go back to previous prompts
    * A program review screen showing all programs applicant pre-qualified for
      * Navigate to first prompt in each program
    * An App Request Summary screen
      * Quickly review all answers provided in previous screens
      * View each pre-qualified program and its status (pending, ineligible, ready to submit)
      * Submit App Request for Review
* Reviewer Dashboard (entry point for reviewers)
  * View list of open / relevant / recent app requests
  * Navigate to App Request Reviewer UI
    * Sidebar full of useful information about the App Request
      * Applicant information
      * App Request indexed data / tags
      * Period information
      * Overall App Request status
    * Sidebar for App Request Actions
      * Ability to send the App Request back to the applicant for more information
      * Ability to move the App Request to the acceptance phase, if applicable
      * Ability to close / reopen / uncancel the App Request
    * Program screens for each program in the system
      * View all requirements associated with the program
        * View the status of each requirement
        * View all prompts that provide information the requirement needs to make its decision
          * Some prompts will be repeated from earlier requirements, repeated prompts may have an abbreviated display
          * Dialog to edit the prompt answer, depending on reviewer's permissions
    * Activity Log screen
      * View all activity related to the app request
    * Manage Email screen
      * View all emails sent related to the app request
      * Send new emails to the applicant
* View / Search App Requests
  * View all app requests in the system
    * Search by applicant name
    * Filter by period, status, indexed app request attributes
    * View abbreviated details about the app request
      * Applicant information
      * App Request indexed attributes
      * Period information
      * Overall App Request status
    * Navigate to App Request Reviewer UI
* Manage Periods
  * Period Detail / Edit Screen
    * Ability to name the period, set its external ID (like a term code)
    * Ability to set the start, end, and archive dates of the period
  * Period Configuration Screen
    * View all programs in the system
      * Ability to configure the program for the period
      * Ability to disable the program in the period
      * View all requirements associated with the program
        * Some requirements may be repeated from earlier programs, repeated requirements may have an abbreviated display
        * Ability to configure the requirement for the period
        * Ability to disable the requirement in the period
        * View all prompts associated with the requirement
          * Some prompts may be repeated from earlier requirements, repeated prompts may have an abbreviated display
          * Ability to configure the prompt for the period
* Manage Roles
  * Create New Roles
  * Navigate to Role Detail / Edit Screen
    * View Associated Groups / Users
    * View List of Grants and Exceptions
    * Create / Edit Grants and Exceptions
      * Select Multiple Controls/Permissions per Grant/Exception
      * Limit the Grant/Exception based on Programs, Requirements, Prompts, or AppRequest attributes
  * Navigate to View All Users Screen
    * List all users or search for specific users
    * Navigate User Detail Screen
      * View User Groups / Roles
* Manage Emails
  * View All Automated Email Types (e.g. applicant has submitted, reviewer has sent back for more info, etc.)
    * Edit the template for each email type
    * Enable or disable the email type
