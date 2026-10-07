import { DateTime } from 'luxon'
import { expect, test } from './fixtures.js'

/**
 * The reviewer dashboard's Program column lists each program with its status tags, but only up to two
 * programs inline. The complex demo has three programs (Adopt a Dog, Adopt a Cat, Foster a Pet), so a
 * fresh request collapses to a grey "3 programs" tag whose tooltip lists program: statuses, and the
 * expanded row shows the full list.
 */
test.describe.serial('Reviewer dashboard program rollup', { tag: '@complex' }, () => {
  const timeZone = 'America/Chicago'
  const stamp = Date.now()
  const periodName = `Reviewer Dashboard Rollup Period ${stamp}`
  const periodCode = `RDR${stamp}`
  const openDate = DateTime.now().setZone(timeZone).minus({ days: 1 }).toISO()
  const closeDate = DateTime.now().setZone(timeZone).plus({ days: 1 }).toISO()

  let periodId = ''
  let appRequestId = ''
  let programTitles: string[] = []

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

  test('Applicant - create an unsubmitted app request with three programs', async ({ applicantRequest }) => {
    const create = `
      mutation CreateAppRequest($login: String!, $periodId: ID!) {
        createAppRequest(login: $login, periodId: $periodId, validateOnly: false) {
          appRequest { id applications { title status } }
          messages { message }
        }
      }
    `
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: string, applications: { title: string, status: string }[] } | null, messages: { message: string }[] } }>(create, { login: 'applicant', periodId })
    expect(createAppRequest.appRequest, createAppRequest.messages.map(m => m.message).join('; ')).not.toBeNull()
    appRequestId = createAppRequest.appRequest!.id
    programTitles = createAppRequest.appRequest!.applications.map(a => a.title)
    expect(programTitles.length).toBeGreaterThanOrEqual(3)
    expect(createAppRequest.appRequest!.applications.every(a => a.status === 'PENDING')).toEqual(true)
  })

  test('Reviewer - three programs collapse to a rollup tag with a tooltip', async ({ reviewerPage }) => {
    await reviewerPage.goto(`/dashboards/reviewer?q.status.0=STARTED&f.periodIds.0=${periodId}`)
    const requestTag = reviewerPage.locator('[role="listitem"].bx--tag', { hasText: new RegExp(`^\\s*${appRequestId}\\s*$`) })
    const row = reviewerPage.locator('.column-list-row').filter({ has: requestTag })
    await expect(row).toBeVisible()

    const programCell = row.locator('.column-list-col.program')
    const rollup = programCell.locator('.bx--tag', { hasText: `${programTitles.length} programs` })
    await expect(rollup).toBeVisible()
    for (const title of programTitles) await expect(programCell).not.toContainText(title)

    // hovering lists every program with its status labels; the tooltip is portalled to the body
    await rollup.hover()
    const tooltip = reviewerPage.locator('.bx--tooltip [role="dialog"]')
    await expect(tooltip).toBeVisible()
    for (const title of programTitles) await expect(tooltip).toContainText(`${title}: Pending`)

    // the expanded row shows the full list without the rollup
    await row.getByRole('button', { name: 'Expand Row' }).click()
    const detail = row.locator('.column-list-expandable')
    for (const title of programTitles) await expect(detail).toContainText(title)
    await expect(detail.locator('[role="listitem"].bx--tag', { hasText: 'Pending' })).toHaveCount(programTitles.length)
  })
})
