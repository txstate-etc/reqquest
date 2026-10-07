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
    await expect(reviewerPage).toHaveURL(/q\.status\.0=/)
    const quickLabels = reviewerPage.locator('.quickfilters-form .bx--label')
    await expect(quickLabels.filter({ hasText: /^Application status$/ })).toBeVisible()
    await expect(quickLabels.filter({ hasText: /^Program status$/ })).toBeVisible()
    await expect(quickLabels.filter({ hasText: /^Program$/ })).toBeVisible()
    // the fields themselves carry the placeholder, the heading sits above them
    await expect(reviewerPage.locator('.quickfilters-form .bx--list-box__label', { hasText: 'Choose one or more' })).toHaveCount(3)
    await expect(reviewerPage.getByRole('radio', { name: 'Awaiting Review' })).toHaveCount(0)
    await expect(reviewerPage.getByRole('button', { name: /More filters/i })).toBeVisible()
  })

  test('Reviewer - Program and Program status filters narrow the list', async ({ reviewerPage }) => {
    // scope to this test's period and to unsubmitted requests so the fresh request shows regardless of other suites' data
    await reviewerPage.goto(`/dashboards/reviewer?q.status.0=STARTED&f.periodIds.0=${periodId}`)
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
})
