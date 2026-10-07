import { DateTime } from 'luxon'
import { expect, test } from './fixtures.js'

/**
 * The reviewer dashboard filters by review stage through three status-based tabs: Review Pending
 * (PREAPPROVAL + APPROVAL), In Review (REVIEW_IN_PROGRESS) and Review Complete (REVIEW_COMPLETE onward).
 * There is no search box and no quick filter; the submitted-date filters live in the "More filters" dialog.
 * The list itself shows each program with its status tag(s), two-line dates, row checkboxes with a bulk
 * download, and expandable rows listing every program.
 */
test.describe.serial('Reviewer dashboard tabs and list', { tag: '@default' }, () => {
  const timeZone = 'America/Chicago'
  const stamp = Date.now()
  const periodName = `Reviewer Dashboard Tabs Period ${stamp}`
  const periodCode = `RDT${stamp}`
  const openDate = DateTime.now().setZone(timeZone).minus({ days: 1 }).toISO()
  const closeDate = DateTime.now().setZone(timeZone).plus({ days: 1 }).toISO()

  let periodId = ''
  let appRequestId = ''

  test('Admin - create and review period', async ({ adminRequest }) => {
    const create = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate: DateTime!, $closeDate: DateTime!) {
        createPeriod(period: { name: $name, code: $code, openDate: $openDate, closeDate: $closeDate }, validateOnly: false) {
          period { id }
          messages { message }
        }
      }
    `
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: string } } }>(create, { name: periodName, code: periodCode, openDate, closeDate })
    periodId = createPeriod.period.id
    expect(periodId).toBeTruthy()
    const review = `
      mutation MarkPeriodReviewed($periodId: ID!) {
        markPeriodReviewed(periodId: $periodId) { period { id reviewed } messages { message } }
      }
    `
    const { markPeriodReviewed } = await adminRequest.graphql<{ markPeriodReviewed: { period: { reviewed: boolean } } }>(review, { periodId })
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
    expect(createAppRequest.appRequest!.status).toEqual('STARTED')
    expect(createAppRequest.appRequest!.applications.every(a => a.status === 'PENDING')).toEqual(true)
  })

  test('Reviewer - bare visit lands on Review Pending; tabs are the only filter control', async ({ reviewerPage }) => {
    await reviewerPage.goto('/dashboards/reviewer')
    await expect(reviewerPage).toHaveURL(/t\.status\.0=PREAPPROVAL/)
    await expect(reviewerPage).toHaveURL(/t\.status\.1=APPROVAL/)
    for (const name of ['Review Pending', 'In Review', 'Review Complete']) await expect(reviewerPage.getByRole('radio', { name })).toBeVisible()
    await expect(reviewerPage.getByRole('radio', { name: 'Review Pending' })).toBeChecked()
    await expect(reviewerPage.getByRole('radio', { name: 'Awaiting Review' })).toHaveCount(0)
    // no search box, no quick filters
    await expect(reviewerPage.locator('.quickfilters-form')).toHaveCount(0)
    await expect(reviewerPage.getByRole('combobox')).toHaveCount(0)
    await expect(reviewerPage.locator('.nested-multiselect')).toHaveCount(0)
    await expect(reviewerPage.getByRole('heading', { name: 'Review pending' })).toBeVisible()

    await reviewerPage.getByRole('radio', { name: 'In Review' }).click()
    await expect(reviewerPage).toHaveURL(/t\.status\.0=REVIEW_IN_PROGRESS/)
    expect(reviewerPage.url()).not.toMatch(/PREAPPROVAL/)
    await expect(reviewerPage.getByRole('heading', { name: 'In review' })).toBeVisible()

    await reviewerPage.getByRole('radio', { name: 'Review Complete' }).click()
    await expect(reviewerPage).toHaveURL(/t\.status\.0=REVIEW_COMPLETE/)
    await expect(reviewerPage).toHaveURL(/NOT_APPROVED/)
    await expect(reviewerPage.getByRole('heading', { name: 'Review complete' })).toBeVisible()

    // the submitted-date filters survive in the dialog (FilterUI labels the button "Add filters" when there are no quick filters)
    await reviewerPage.getByRole('button', { name: /(More|Add) filters/i }).click()
    await expect(reviewerPage.getByLabel('Submitted After')).toBeVisible()
    await expect(reviewerPage.getByLabel('Submitted Before')).toBeVisible()
    await reviewerPage.keyboard.press('Escape')
  })

  test('Reviewer - Program column, two-line dates, expansion and bulk download', async ({ reviewerPage }) => {
    // autoHideColumns drops Last Updated at Playwright's default width, so widen for this test and restore afterwards
    const original = reviewerPage.viewportSize() ?? { width: 1280, height: 720 }
    await reviewerPage.setViewportSize({ width: 1800, height: 900 })
    // dialog-key filters: scope to this test's period and to unsubmitted requests without implying a tab
    await reviewerPage.goto(`/dashboards/reviewer?f.status.0=STARTED&f.periodIds.0=${periodId}`)
    // ColumnList renders its cell tags as listitems; the trigger's selection-count badge is also a .bx--tag, so scope by role
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
