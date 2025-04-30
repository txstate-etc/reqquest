import type { APIRequestContext, Page } from '@playwright/test'

const tokens = new Map<string, Promise<string>>()

export async function loginAs (page: Page, netid: string) {
  if (!tokens.has(netid)) tokens.set(netid, loginAsUncached(page, netid))
  return await tokens.get(netid)!
}

async function loginAsUncached (page: Page, netid: string) {
  await page.goto('http://fakeauth/login?clientId=reqquest&returnUrl=http://localhost')
  const username = page.locator('input[name="username"]')
  const password = page.locator('input[type="password"]')
  await username.waitFor()
  await username.pressSequentially(netid)
  await password.pressSequentially('abc123')
  const submit = page.getByRole('button', { name: 'login' })
  const reqPromise = page.waitForRequest(/http:\/\/localhost\/?\?unifiedJwt=.*/)
  await submit.click()
  const req = await reqPromise
  const m = req.url().match(/unifiedJwt=([^&]+)/)
  return m![1]
}

export async function gotoAs (page: Page, url: string, netid: string) {
  const token = await loginAs(page, netid)
  await page.goto('/?unifiedJwt=' + token + '&requestedUrl=' + encodeURIComponent(url))
}

export async function getAs <T = any> (page: Page, request: APIRequestContext, netid: string, path: string) {
  const token = await loginAs(page, netid)
  const resp = await request.get('http://api' + path, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!resp.ok()) throw new Error((await resp.text()) || resp.statusText())
  return await resp.json() as T
}

export async function postAs <T = any> (page: Page, request: APIRequestContext, netid: string, path: string, body: any) {
  const token = await loginAs(page, netid)
  const resp = await request.post('http://api' + path, {
    data: body,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!resp.ok()) throw new Error((await resp.text()) || resp.statusText())
  return await resp.json() as T
}

export async function putAs <T = any> (page: Page, request: APIRequestContext, netid: string, path: string, body: any) {
  const token = await loginAs(page, netid)
  const resp = await request.put('http://api' + path, {
    data: body,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!resp.ok()) throw new Error((await resp.text()) || resp.statusText())
  return await resp.json() as T
}

export async function patchAs <T = any> (page: Page, request: APIRequestContext, netid: string, path: string, body: any) {
  const token = await loginAs(page, netid)
  const resp = await request.patch('http://api' + path, {
    data: body,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!resp.ok()) throw new Error((await resp.text()) || resp.statusText())
  return await resp.json() as T
}

export async function deleteAs <T = any> (page: Page, request: APIRequestContext, netid: string, path: string) {
  const token = await loginAs(page, netid)
  const resp = await request.delete('http://api' + path, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (!resp.ok()) throw new Error((await resp.text()) || resp.statusText())
  return await resp.json() as T
}

export async function graphqlAs <T = any> (page: Page, request: APIRequestContext, netid: string, query: string, variables?: any) {
  const { data, errors } = await postAs<{ data: T, errors: { message: string }[] }>(page, request, netid, '/graphql', { query, variables })
  if (errors?.length) throw new Error(errors.map(e => e.message).join('\n'))
  return data
}
