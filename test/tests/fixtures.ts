import { test as base, type Page, type APIRequestContext } from '@playwright/test'

export async function loginAs (page: Page, netid: string) {
  await page.goto(process.env.AUTH_REDIRECT!)
  const username = page.locator('input[name="username"]')
  await username.waitFor()
  await username.pressSequentially(netid)
  const submit = page.getByRole('button', { name: 'login' })
  await submit.click()
  await page.waitForURL(/^http:\/\/ui/)
  await page.waitForTimeout(100)
}

interface RequestHelpers {
  get: <T = any>(path: string) => Promise<T>
  post: <T = any>(path: string, body: any) => Promise<T>
  graphql: <T = any>(query: string, variables?: Record<string, any>) => Promise<T>
  request: APIRequestContext
}

export type MyOptions = {
  login: string
}

type MyFixtures = {
  loginPage: Page
  reviewerPage: Page
  applicantPage: Page
  adminPage: Page
  suPage: Page
  request: RequestHelpers
  reviewerRequest: RequestHelpers
  applicantRequest: RequestHelpers
  adminRequest: RequestHelpers
  suRequest: RequestHelpers
}

function getWithRequest (request: APIRequestContext, token: string) {
  return async <T = any>(path: string) => {
    const resp = await request.get('http://api' + path, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    if (!resp.ok()) throw new Error((await resp.text()) || resp.statusText())
    return await resp.json() as T
  }
}

function postWithRequest (request: APIRequestContext, token: string) {
  return async <T = any>(path: string, body: any) => {
    const resp = await request.post('http://api' + path, {
      data: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!resp.ok()) throw new Error((await resp.text()) || resp.statusText())
    return await resp.json() as T
  }
}

function graphqlWithPost (post: (<T = any>(path: string, body: any) => Promise<T>)) {
  return async <T = any>(query: string, variables?: Record<string, any>) => {
    const resp = await post<{ data: T, errors?: string[] }>('/graphql', { query, variables })
    if (resp.errors) return resp
    return resp.data as T
  }
}

export const test = base.extend<{}, MyOptions & MyFixtures>({
  login: ['applicant', { option: true }], // default to applicant login
  loginPage: [async ({ browser, login }, use) => {
    const context = await browser.newContext()
    const loginPage = await context.newPage()
    await loginAs(loginPage, login)
    await use(loginPage)
    await context.close()
  }, { scope: 'test' }],
  request: [async ({ loginPage }, use) => {
    const token = (await loginPage.evaluate(() => sessionStorage.getItem('token')))!
    const request = await loginPage.context().request
    const post = postWithRequest(request, token)
    await use({ request, get: getWithRequest(request, token), post, graphql: graphqlWithPost(post) })
  }, { scope: 'test' }],
  reviewerPage: [async ({ browser }, use) => {
    const context = await browser.newContext()
    const reviewerPage = await context.newPage()
    await loginAs(reviewerPage, 'reviewer')
    await use(reviewerPage)
    await context.close()
  }, { scope: 'worker' }],
  reviewerRequest: [async ({ reviewerPage }, use) => {
    const token = (await reviewerPage.evaluate(() => sessionStorage.getItem('token')))!
    const reviewerRequest = await reviewerPage.context().request
    const post = postWithRequest(reviewerRequest, token)
    await use({ request: reviewerRequest, get: getWithRequest(reviewerRequest, token), post, graphql: graphqlWithPost(post) })
  }, { scope: 'worker' }],
  applicantPage: [async ({ browser }, use) => {
    const context = await browser.newContext()
    const applicantPage = await context.newPage()
    await loginAs(applicantPage, 'applicant')
    await use(applicantPage)
    await context.close()
  }, { scope: 'worker' }],
  applicantRequest: [async ({ applicantPage }, use) => {
    const token = (await applicantPage.evaluate(() => sessionStorage.getItem('token')))!
    const applicantRequest = await applicantPage.context().request
    const post = postWithRequest(applicantRequest, token)
    await use({ request: applicantRequest, get: getWithRequest(applicantRequest, token), post, graphql: graphqlWithPost(post) })
  }, { scope: 'worker' }],
  adminPage: [async ({ browser }, use) => {
    const context = await browser.newContext()
    const adminPage = await context.newPage()
    await loginAs(adminPage, 'admin')
    await use(adminPage)
    await context.close()
  }, { scope: 'worker' }],
  adminRequest: [async ({ adminPage }, use) => {
    const token = (await adminPage.evaluate(() => sessionStorage.getItem('token')))!
    const adminRequest = await adminPage.context().request
    const post = postWithRequest(adminRequest, token)
    await use({ request: adminRequest, get: getWithRequest(adminRequest, token), post, graphql: graphqlWithPost(post) })
  }, { scope: 'worker' }],
  suPage: [async ({ browser }, use) => {
    const context = await browser.newContext()
    const suPage = await context.newPage()
    await loginAs(suPage, 'su')
    await use(suPage)
    await context.close()
  }, { scope: 'worker' }],
  suRequest: [async ({ suPage }, use) => {
    const token = (await suPage.evaluate(() => sessionStorage.getItem('token')))!
    const suRequest = await suPage.context().request
    const post = postWithRequest(suRequest, token)
    await use({ request: suRequest, get: getWithRequest(suRequest, token), post, graphql: graphqlWithPost(post) })
  }, { scope: 'worker' }]
})

export const expect = test.expect
