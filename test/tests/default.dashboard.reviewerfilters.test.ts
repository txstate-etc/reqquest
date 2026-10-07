import { DateTime } from 'luxon'
import { expect, test } from './fixtures.js'

/**
 * The reviewer dashboard's toolbar replaces the old Awaiting/In Progress/Completed tabs with a search box
 * and three quick filters: Application status (the appRequest status), Program status (the per-program
 * application status, with Rescinded/Restored sub-options under the two statuses that can be rescinded)
 * and Program. Program status is a custom FloatingPortal control rather than a Carbon MultiSelect, and its
 * value is sent to the API as-is (`applicationStatuses: [{ status, rescindedStatus? }]`).
 */
test.describe.serial('Reviewer dashboard filter toolbar', { tag: '@default' }, () => {
  const timeZone = 'America/Chicago'
  const stamp = Date.now()
  const periodName = `Reviewer Dashboard Filters Period ${stamp}`
  const periodCode = `RDF${stamp}`
  const openDate = DateTime.now().setZone(timeZone).minus({ days: 1 }).toISO()
  const closeDate = DateTime.now().setZone(timeZone).plus({ days: 1 }).toISO()

  let periodId = ''
  let appRequestId = ''

  test('Admin - create period', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate: DateTime!, $closeDate: DateTime!) {
        createPeriod(period: { name: $name, code: $code, openDate: $openDate, closeDate: $closeDate }, validateOnly: false) {
          period { id }
          messages { message }
        }
      }
    `
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: string }, messages: { message: string }[] } }>(query, { name: periodName, code: periodCode, openDate, closeDate })
    periodId = createPeriod.period.id
    expect(periodId).toBeTruthy()
  })

  test('Admin - mark period reviewed so it accepts requests', async ({ adminRequest }) => {
    const query = `
      mutation MarkPeriodReviewed($periodId: ID!) {
        markPeriodReviewed(periodId: $periodId) { period { id reviewed } messages { message } }
      }
    `
    const { markPeriodReviewed } = await adminRequest.graphql<{ markPeriodReviewed: { period: { reviewed: boolean } } }>(query, { periodId })
    expect(markPeriodReviewed.period.reviewed).toEqual(true)
  })

  test('Applicant - create an unsubmitted app request', async ({ applicantRequest }) => {
    const create = `
      mutation CreateAppRequest($login: String!, $periodId: ID!) {
        createAppRequest(login: $login, periodId: $periodId, validateOnly: false) {
          appRequest { id status applications { programKey status } }
          messages { message }
        }
      }
    `
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: string, status: string, applications: { programKey: string, status: string }[] } | null, messages: { message: string }[] } }>(create, { login: 'applicant', periodId })
    expect(createAppRequest.appRequest, createAppRequest.messages.map(m => m.message).join('; ')).not.toBeNull()
    appRequestId = createAppRequest.appRequest!.id
    // nothing answered yet, so every program's application is PENDING - the Program status assertions below rely on that
    expect(createAppRequest.appRequest!.status).toEqual('STARTED')
    expect(createAppRequest.appRequest!.applications.every(a => a.status === 'PENDING')).toEqual(true)
  })

  test('Reviewer - bare visit lands on the default quick filters, tabs are gone', async ({ reviewerPage }) => {
    await reviewerPage.goto('/dashboards/reviewer')
    // the status quick filter holds groups of statuses (one option per label), hence the nested index
    await expect(reviewerPage).toHaveURL(/q\.status\.0\.0=/)
    const quickLabels = reviewerPage.locator('.quickfilters-form .bx--label')
    await expect(quickLabels.filter({ hasText: /^Application status$/ })).toBeVisible()
    await expect(quickLabels.filter({ hasText: /^Program status$/ })).toBeVisible()
    await expect(quickLabels.filter({ hasText: /^Program$/ })).toBeVisible()
    // the fields themselves carry the placeholder, the heading sits above them
    await expect(reviewerPage.locator('.quickfilters-form .bx--list-box__label', { hasText: 'Choose one or more' })).toHaveCount(3)
    await expect(reviewerPage.getByRole('radio', { name: 'Awaiting Review' })).toHaveCount(0)
    await expect(reviewerPage.getByRole('button', { name: /More filters/i })).toBeVisible()

    // PREAPPROVAL and APPROVAL share the "Review pending" label, so they appear as one option that filters both
    const statusSelect = reviewerPage.locator('.bx--multi-select__wrapper').filter({ has: reviewerPage.locator('.bx--label', { hasText: /^Application status$/ }) })
    await statusSelect.getByRole('combobox').click()
    const reviewPending = reviewerPage.getByRole('option', { name: 'Review pending' })
    await expect(reviewPending).toHaveCount(1)
    await reviewerPage.goto('/dashboards/reviewer?q.status.0.0=STARTED')
    await statusSelect.getByRole('combobox').click()
    await reviewPending.click()
    await expect(reviewerPage).toHaveURL(/q\.status\.1\.0=PREAPPROVAL/)
    await expect(reviewerPage).toHaveURL(/q\.status\.1\.1=APPROVAL/)
    await reviewerPage.keyboard.press('Escape')
  })

  test('Reviewer - Program and Program status filters narrow the list', async ({ reviewerPage }) => {
    // scope to this test's period and to unsubmitted requests so the fresh request shows regardless of other suites' data
    await reviewerPage.goto(`/dashboards/reviewer?q.status.0.0=STARTED&f.periodIds.0=${periodId}`)
    // ColumnList renders its cell tags as listitems; the trigger's selection-count badge is also a .bx--tag, so scope by role
    const requestTag = reviewerPage.locator('[role="listitem"].bx--tag', { hasText: new RegExp(`^\\s*${appRequestId}\\s*$`) })
    await expect(requestTag).toBeVisible()

    // Program: a Carbon MultiSelect. The request has an application for every program, so it stays listed.
    const programSelect = reviewerPage.locator('.bx--multi-select__wrapper').filter({ has: reviewerPage.locator('.bx--label', { hasText: /^Program$/ }) })
    await programSelect.getByRole('combobox').click()
    await reviewerPage.getByRole('option', { name: 'Adopt a Dog' }).click()
    await expect(reviewerPage).toHaveURL(/q\.programKeys\.0=adopt_a_dog_program/)
    await reviewerPage.keyboard.press('Escape')
    await expect(requestTag).toBeVisible()

    // Program status: the FloatingPortal control. Rescinded/Restored sit only under Offer accepted and Approved.
    const trigger = reviewerPage.locator('.quickfilters-form button[aria-haspopup="dialog"]')
    await expect(trigger).toContainText('Choose one or more')
    await trigger.click()
    const dialog = reviewerPage.getByRole('dialog', { name: 'Program status' })
    await expect(dialog).toBeVisible()
    const options = (await dialog.locator('label').allInnerTexts()).map(t => t.trim())
    expect(options).toEqual(['Offer accepted', 'Rescinded', 'Restored', 'Approved', 'Rescinded', 'Restored', 'Ineligible', 'Pending', 'Offer declined'])

    // Approved alone: the dog application is PENDING, so the request drops out
    await dialog.getByText('Approved', { exact: true }).click()
    await expect(reviewerPage).toHaveURL(/q\.applicationStatuses\.0\.status=ELIGIBLE/)
    await expect(requestTag).toHaveCount(0)

    // adding Pending brings it back (entries OR together)
    await dialog.getByText('Pending', { exact: true }).click()
    await expect(reviewerPage).toHaveURL(/q\.applicationStatuses\.1\.status=PENDING/)
    await expect(requestTag).toBeVisible()

    // a nested option carries the rescind state alongside its parent status
    await dialog.getByText('Rescinded', { exact: true }).nth(1).click()
    await expect(reviewerPage).toHaveURL(/q\.applicationStatuses\.2\.status=ELIGIBLE/)
    await expect(reviewerPage).toHaveURL(/q\.applicationStatuses\.2\.rescindedStatus=RESCINDED/)
    await expect(requestTag).toBeVisible()

    // Escape closes the portal and returns focus to the trigger, which now shows the selection count
    await reviewerPage.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await expect(trigger.locator('.bx--tag')).toHaveText('3')

    // the selection lives in the URL, so a reload restores it
    await reviewerPage.reload()
    await expect(reviewerPage.locator('.quickfilters-form button[aria-haspopup="dialog"] .bx--tag')).toHaveText('3')
    await expect(requestTag).toBeVisible()
  })

  test('Reviewer - Program column, two-line dates, expansion and bulk download', async ({ reviewerPage }) => {
    // autoHideColumns drops Last Updated at Playwright's default width, so widen for this test and restore afterwards
    const original = reviewerPage.viewportSize() ?? { width: 1280, height: 720 }
    await reviewerPage.setViewportSize({ width: 1800, height: 900 })
    await reviewerPage.goto(`/dashboards/reviewer?q.status.0.0=STARTED&f.periodIds.0=${periodId}`)
    const requestTag = reviewerPage.locator('[role="listitem"].bx--tag', { hasText: new RegExp(`^\\s*${appRequestId}\\s*$`) })
    const row = reviewerPage.locator('.column-list-row').filter({ has: requestTag })
    await expect(row).toBeVisible()

    // two programs render inline: title followed by its status tag
    const programCell = row.locator('.column-list-col.program')
    await expect(programCell).toContainText('Adopt a Dog')
    await expect(programCell).toContainText('Adopt a Cat')
    await expect(programCell.locator('[role="listitem"].bx--tag', { hasText: 'Pending' })).toHaveCount(2)
    await expect(programCell.locator('.bx--tag', { hasText: /programs$/ })).toHaveCount(0)

    // dates split into a date line and a time line
    await expect(row.locator('.column-list-col.dateSubmitted div')).toHaveCount(2)
    await expect(row.locator('.column-list-col.lastUpdated div')).toHaveCount(2)

    // the chevron expands to the full program list
    await row.getByRole('button', { name: 'Expand Row' }).click()
    const detail = row.locator('.column-list-expandable')
    await expect(detail).toContainText('Programs')
    await expect(detail).toContainText('Adopt a Dog')
    await expect(detail).toContainText('Adopt a Cat')
    await row.getByRole('button', { name: 'Collapse Row' }).click()
    await expect(detail).toHaveCount(0)

    // selecting a row reveals the bulk download action
    // carbon hides the input behind its label, so click the label and confirm the input toggled
    await row.locator('.column-list-col.checkbox label').click()
    await expect(row.getByLabel('select row')).toBeChecked()
    await expect(reviewerPage.getByRole('status').filter({ hasText: '1 row selected' })).toBeVisible()
    // ActionSet renders actions as menuitems with the label as the icon description
    await expect(reviewerPage.getByRole('menuitem', { name: 'Download selected' })).toBeVisible()
    await reviewerPage.setViewportSize(original)
  })
})
