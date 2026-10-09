import { expect, test } from './fixtures.js'

/**
 * The site-wide announcement banner is persistent page content, so it must be a labelled
 * landmark (role="region"), not a live region (role="alert"). Under role="alert" NVDA read the
 * banner's link three times: once in the alert announcement, once as the cursor passed it and
 * once on focus. These tests pin the semantics for both the applicant dashboard and the admin
 * preview on the management page.
 */
test.describe.serial('Announcement banner', { tag: '@all' }, () => {
  const subject = 'Know someone in trouble?'
  const body = 'Submit a CARES alert to the Dean of Students Office to have a dedicated staff member assist them.'
  const link = 'https://www.example.edu/dean-of-students'
  const linkText = 'Dean of Students Office'
  let announcementId: string | undefined

  test.beforeAll(async ({ adminRequest }) => {
    const query = `
      mutation CreateAnnouncement($announcement: AnnouncementUpdate!) {
        createAnnouncement(announcement: $announcement, validateOnly: false) {
          success
          announcement { id }
          messages { message }
        }
      }
    `
    const variables = { announcement: { subject, body, link, linkText, enabled: true, type: 'toggle' } }
    const { createAnnouncement } = await adminRequest.graphql<{ createAnnouncement: { success: boolean, announcement: { id: string } | null, messages: { message: string }[] } }>(query, variables)
    expect(createAnnouncement.success).toBe(true)
    announcementId = createAnnouncement.announcement!.id
  })

  test.afterAll(async ({ adminRequest }) => {
    if (!announcementId) return
    const query = `
      mutation DeleteAnnouncement($announcementId: ID!) {
        deleteAnnouncement(announcementId: $announcementId) { success }
      }
    `
    await adminRequest.graphql(query, { announcementId })
  })

  test('Applicant - dashboard banner is a labelled region with a single link', async ({ applicantPage }) => {
    await applicantPage.goto('/dashboards/applicant')
    const banner = applicantPage.getByRole('region', { name: 'Announcement' })
    await expect(banner).toBeVisible()
    await expect(banner).toHaveClass(/time-sensitive-banner/)
    await expect(banner).toContainText(subject)
    await expect(banner).toContainText(body)

    // Not a live region: neither the banner nor anything inside it is an alert.
    await expect(banner.getByRole('alert')).toHaveCount(0)
    await expect(applicantPage.getByRole('alert').filter({ hasText: subject })).toHaveCount(0)

    // The link appears exactly once and points where the admin said.
    const links = banner.getByRole('link', { name: linkText })
    await expect(links).toHaveCount(1)
    await expect(links).toHaveAttribute('href', link)
    await expect(banner.getByText(linkText, { exact: true })).toHaveCount(1)
  })

  test('Admin - management page preview uses the same region semantics', async ({ adminPage }) => {
    await adminPage.goto('/announcement')
    const preview = adminPage.getByRole('region', { name: 'Announcement' })
    await expect(preview).toBeVisible()
    await expect(preview).toContainText(subject)
    await expect(preview.getByRole('alert')).toHaveCount(0)
    const links = preview.getByRole('link', { name: linkText })
    await expect(links).toHaveCount(1)
    await expect(links).toHaveAttribute('href', link)
  })
})
