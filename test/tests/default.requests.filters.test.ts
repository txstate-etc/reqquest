import { DateTime } from 'luxon'
import { expect, test } from './fixtures.js'
import { createSubmittedClosedRequest } from './default.submitclose.js'

/**
 * All Applications carries the filter toolbar: a search box and three quick filters. Application status is
 * the appRequest status (one option per label, so PREAPPROVAL and APPROVAL share "Review pending"), Program
 * status is the per-program application status (a FloatingPortal control with Rescinded/Restored under the
 * two statuses that can be rescinded, sent to the API as `applicationStatuses: [{ status, rescindedStatus? }]`),
 * and Program is the program key. The old request-level Rescind status filter is gone. The list shares the
 * reviewer dashboard's design: Program column, two-line dates, row checkboxes with a bulk download, and
 * expandable rows.
 */
test.describe.serial('All Applications filters and list', { tag: '@default' }, () => {
  const timeZone = 'America/Chicago'
  const stamp = Date.now()
  const periodName = `All Applications Filters Period ${stamp}`
  const periodCode = `AAF${stamp}`
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
    // nothing answered yet, so every program's application is PENDING - the Program status assertions below rely on that
    expect(createAppRequest.appRequest!.status).toEqual('STARTED')
    expect(createAppRequest.appRequest!.applications.every(a => a.status === 'PENDING')).toEqual(true)
  })

  let closedRequestId = ''

  test('Applicant2 - submit a request, Reviewer - close it', async ({ applicant2Request, reviewerRequest }) => {
    closedRequestId = await createSubmittedClosedRequest(applicant2Request, reviewerRequest, 'applicant2', periodId)
  })

  test('Reviewer - toolbar has the three quick filters with grouped, program-safe status labels', async ({ reviewerPage }) => {
    // wide enough that the toolbar stays on one line, so the alignment check below compares items in the same row
    const original = reviewerPage.viewportSize() ?? { width: 1280, height: 720 }
    await reviewerPage.setViewportSize({ width: 2400, height: 900 })
    await reviewerPage.goto('/requests')
    const quickLabels = reviewerPage.locator('.quickfilters-form .bx--label')
    await expect(quickLabels.filter({ hasText: /^Application status$/ })).toBeVisible()
    await expect(quickLabels.filter({ hasText: /^Program status$/ })).toBeVisible()
    await expect(quickLabels.filter({ hasText: /^Program$/ })).toBeVisible()
    await expect(quickLabels.filter({ hasText: /^Rescind status$/ })).toHaveCount(0)
    await expect(reviewerPage.locator('.quickfilters-form .bx--list-box__label', { hasText: 'Choose one or more' })).toHaveCount(3)
    // the search box and More filters button sit level with the dropdown fields, not with the labels above them
    const bottoms = await Promise.all([
      reviewerPage.getByRole('searchbox').boundingBox(),
      reviewerPage.getByRole('button', { name: /More filters/i }).boundingBox(),
      reviewerPage.locator('.quickfilters-form').getByRole('combobox').first().boundingBox()
    ].map(async b => { const box = (await b)!; return box.y + box.height }))
    expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThan(6)
    // the intro subtitle uses the panel's full width instead of wrapping at the library's 28rem cap
    const subtitleBox = (await reviewerPage.locator('.intro-subtitle').boundingBox())!
    expect(subtitleBox.height).toBeLessThan(24)
    // the list toolbar shares the intro panel's background and sits flush beneath it, reading as one block
    const [panelBg, headerBg] = await Promise.all(['.intro-panel', '.column-list-header'].map(async sel => await reviewerPage.locator(sel).evaluate(el => getComputedStyle(el).backgroundColor)))
    expect(headerBg).toEqual(panelBg)
    const [panelBox, headerBox] = await Promise.all([reviewerPage.locator('.intro-panel').boundingBox(), reviewerPage.locator('.column-list-header').boundingBox()])
    expect(Math.abs(headerBox!.y - (panelBox!.y + panelBox!.height))).toBeLessThan(1.5)

    // PREAPPROVAL and APPROVAL share the "Review pending" label, so they appear as one option that filters both
    const statusSelect = reviewerPage.locator('.bx--multi-select__wrapper').filter({ has: reviewerPage.locator('.bx--label', { hasText: /^Application status$/ }) })
    await statusSelect.getByRole('combobox').click()
    const reviewPending = reviewerPage.getByRole('option', { name: 'Review pending' })
    await expect(reviewPending).toHaveCount(1)
    // request-level roll-ups never borrow per-program wording ("Ineligible", "Offer accepted", "Offer declined")
    await expect(reviewerPage.getByRole('option', { name: 'Not approved' })).toHaveCount(1)
    await expect(reviewerPage.getByRole('option', { name: 'Ineligible' })).toHaveCount(0)
    for (const name of ['Awaiting acceptance', 'Ready to accept', 'Accepted', 'Declined']) await expect(reviewerPage.getByRole('option', { name, exact: true })).toHaveCount(1)
    for (const name of ['Offer pending', 'Almost accepted', 'Offer accepted', 'Offer declined']) await expect(reviewerPage.getByRole('option', { name, exact: true })).toHaveCount(0)
    await reviewPending.click()
    await expect(reviewerPage).toHaveURL(/q\.status\.0\.0=PREAPPROVAL/)
    await expect(reviewerPage).toHaveURL(/q\.status\.0\.1=APPROVAL/)
    await reviewerPage.keyboard.press('Escape')
    await reviewerPage.setViewportSize(original)
  })

  test('Reviewer - Program and Program status filters narrow the list', async ({ reviewerPage }) => {
    // scope to this test's period and to unsubmitted requests so the fresh request shows regardless of other suites' data
    await reviewerPage.goto(`/requests?q.status.0.0=STARTED&f.periodIds.0=${periodId}`)
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

    // checking a child auto-checks its parent and narrows it: the bare ELIGIBLE entry is replaced by the rescinded one
    const approved = dialog.getByRole('checkbox', { name: 'Approved', exact: true })
    const offerAccepted = dialog.getByRole('checkbox', { name: 'Offer accepted', exact: true })
    const approvedRescinded = dialog.getByText('Rescinded', { exact: true }).nth(1)
    await approvedRescinded.click()
    await expect(approved).toBeChecked()
    await expect(reviewerPage).toHaveURL(/q\.applicationStatuses\.0\.status=PENDING/)
    await expect(reviewerPage).toHaveURL(/q\.applicationStatuses\.1\.status=ELIGIBLE&q\.applicationStatuses\.1\.rescindedStatus=RESCINDED|q\.applicationStatuses\.1\.rescindedStatus=RESCINDED&q\.applicationStatuses\.1\.status=ELIGIBLE/)
    await expect(reviewerPage).not.toHaveURL(/q\.applicationStatuses\.2\./)
    await expect(requestTag).toBeVisible()

    // unchecking the last child leaves the parent selected on its own
    await approvedRescinded.click()
    await expect(approved).toBeChecked()
    await expect(reviewerPage).toHaveURL(/q\.applicationStatuses\.1\.status=ELIGIBLE/)
    // the filter URL updates after a debounce, so poll rather than read it once
    await expect(reviewerPage).not.toHaveURL(/rescindedStatus/)

    // re-narrow, then unchecking the parent clears it and its child together
    await approvedRescinded.click()
    await expect(reviewerPage).toHaveURL(/rescindedStatus=RESCINDED/)
    await dialog.getByText('Approved', { exact: true }).click()
    await expect(approved).not.toBeChecked()
    await expect(reviewerPage).not.toHaveURL(/ELIGIBLE/)

    // a child picked on its own checks its parent too; only the child is sent
    await dialog.getByText('Restored', { exact: true }).nth(0).click()
    await expect(offerAccepted).toBeChecked()
    await expect(reviewerPage).toHaveURL(/status=ACCEPTED/)
    await expect(reviewerPage).toHaveURL(/rescindedStatus=RESTORED/)
    await expect(requestTag).toBeVisible()

    // Escape closes the portal and returns focus to the trigger, which counts the stored entries (Pending, Offer accepted > Restored)
    await reviewerPage.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await expect(trigger.locator('.bx--tag')).toHaveText('2')

    // the selection lives in the URL, so a reload restores it
    await reviewerPage.reload()
    await expect(reviewerPage.locator('.quickfilters-form button[aria-haspopup="dialog"] .bx--tag')).toHaveText('2')
    await expect(requestTag).toBeVisible()
  })

  test('Reviewer - Program column, two-line dates, expansion and bulk download', async ({ reviewerPage }) => {
    // autoHideColumns drops Last Updated at narrower widths (this list also carries index columns), so widen for this test
    const original = reviewerPage.viewportSize() ?? { width: 1280, height: 720 }
    await reviewerPage.setViewportSize({ width: 2400, height: 900 })
    await reviewerPage.goto(`/requests?q.status.0.0=STARTED&f.periodIds.0=${periodId}`)
    const requestTag = reviewerPage.locator('[role="listitem"].bx--tag', { hasText: new RegExp(`^\\s*${appRequestId}\\s*$`) })
    const row = reviewerPage.locator('.column-list-row').filter({ has: requestTag })
    await expect(row).toBeVisible()

    const programCell = row.locator('.column-list-col.program')
    await expect(programCell).toContainText('Adopt a Dog')
    await expect(programCell).toContainText('Adopt a Cat')
    await expect(programCell.locator('[role="listitem"].bx--tag', { hasText: 'Pending' })).toHaveCount(2)

    await expect(row.locator('.column-list-col.dateSubmitted div')).toHaveCount(2)
    await expect(row.locator('.column-list-col.lastUpdated div')).toHaveCount(2)

    await row.getByRole('button', { name: 'Expand Row' }).click()
    const detail = row.locator('.column-list-expandable')
    await expect(detail).toContainText('Programs')
    await expect(detail).toContainText('Adopt a Dog')
    await expect(detail).toContainText('Adopt a Cat')
    await row.getByRole('button', { name: 'Collapse Row' }).click()
    await expect(detail).toHaveCount(0)

    await row.locator('.column-list-col.checkbox label').click()
    await expect(row.getByLabel('select row')).toBeChecked()
    await expect(reviewerPage.getByRole('status').filter({ hasText: '1 row selected' })).toBeVisible()
    await expect(reviewerPage.getByRole('menuitem', { name: 'Download selected' })).toBeVisible()
    await reviewerPage.setViewportSize(original)
  })

  test('Reviewer - Closed filters from Application status and shows as a tag; quick filters move into the dialog when narrow', async ({ reviewerPage }) => {
    const original = reviewerPage.viewportSize() ?? { width: 1280, height: 720 }
    await reviewerPage.setViewportSize({ width: 2400, height: 900 })
    await reviewerPage.goto(`/requests?f.periodIds.0=${periodId}`)
    const idTag = (id: string) => reviewerPage.locator('[role="listitem"].bx--tag', { hasText: new RegExp(`^\\s*${id}\\s*$`) })
    const rowFor = (id: string) => reviewerPage.locator('.column-list-row').filter({ has: idTag(id) })
    // All Applications lists open and closed requests alike until filtered
    await expect(idTag(closedRequestId)).toBeVisible()
    await expect(idTag(appRequestId)).toBeVisible()
    // closing is request-level: one Closed tag in the Programs section of the closed request only
    const closedTagIn = (id: string) => rowFor(id).locator('.column-list-col.program [role="listitem"].bx--tag', { hasText: /^\s*Closed\s*$/ })
    await expect(closedTagIn(closedRequestId)).toHaveCount(1)
    await expect(closedTagIn(appRequestId)).toHaveCount(0)

    // Closed is an Application status option; picking it narrows to closed requests, and the dialog copy follows
    const quickStatus = reviewerPage.locator('.quickfilters-form .bx--multi-select__wrapper').filter({ has: reviewerPage.locator('.bx--label', { hasText: /^Application status$/ }) })
    await quickStatus.getByRole('combobox').click()
    await reviewerPage.getByRole('option', { name: 'Closed', exact: true }).click()
    await reviewerPage.keyboard.press('Escape')
    await expect(reviewerPage).toHaveURL(/q\.status\.0\.0=CLOSED/)
    await expect(idTag(closedRequestId)).toBeVisible()
    await expect(idTag(appRequestId)).toHaveCount(0)

    // at full width the quick filters stay in the bar, so the More filters dialog opens with Periods
    await reviewerPage.getByRole('button', { name: /^(More filters|\d+ filters?)$/ }).click()
    const dialog = reviewerPage.locator('dialog[open]')
    let labels = (await dialog.locator('.bx--label').allInnerTexts()).map(t => t.trim()).filter(Boolean)
    expect(labels[0]).toEqual('Periods')
    for (const label of ['Application status', 'Program status', 'Program']) expect(labels).not.toContain(label)
    // index filters (the default demo has State) follow Periods in the dialog, not the quick bar
    const quickLabels = (await reviewerPage.locator('.quickfilters-form .bx--label').allInnerTexts()).map(t => t.trim()).filter(Boolean)
    expect(quickLabels).toEqual(['Application status', 'Program status', 'Program'])
    const indexLabels = labels.slice(1, labels.findIndex(l => l === 'Created After'))
    for (const label of indexLabels) expect(quickLabels).not.toContain(label)
    await dialog.getByRole('button', { name: 'Cancel' }).click()

    // on a narrow screen FilterUI moves the quick filters into the dialog, and Periods trails Program
    await reviewerPage.setViewportSize({ width: 700, height: 900 })
    await reviewerPage.getByRole('button', { name: /^(Add filters|\d+ filters?)$/ }).click()
    labels = (await dialog.locator('.bx--label').allInnerTexts()).map(t => t.trim()).filter(Boolean)
    expect(labels.slice(0, 4)).toEqual(['Application status', 'Program status', 'Program', 'Periods'])
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await reviewerPage.setViewportSize(original)
  })
})
