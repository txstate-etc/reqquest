import { DateTime } from 'luxon'
import { expect, test } from './fixtures.js'
import { promptMapApplicantQualified } from './default.promptdata.js'

interface AddNoteResponse {
  addNote: {
    success: boolean
    messages: { message: string, type: string, arg: string | null }[]
    note: { id: string, content: string, persistent: boolean } | null
  }
}

interface UpdateNoteResponse {
  updateNote: {
    success: boolean
    messages: { message: string, type: string, arg: string | null }[]
    note: { id: string, content: string } | null
  }
}

interface TogglePersistenceResponse {
  togglePersistence: {
    success: boolean
    messages: { message: string, type: string, arg: string | null }[]
    note: { id: string, persistent: boolean } | null
  }
}

const ADD_NOTE_MUTATION = `
  mutation AddNote($appRequestId: ID!, $content: String!, $persistent: Boolean, $validateOnly: Boolean) {
    addNote(appRequestId: $appRequestId, content: $content, persistent: $persistent, validateOnly: $validateOnly) {
      success
      messages { message type arg }
      note { id content persistent }
    }
  }
`

const UPDATE_NOTE_MUTATION = `
  mutation UpdateNote($noteId: ID!, $content: String!) {
    updateNote(noteId: $noteId, content: $content) {
      success
      messages { message type arg }
      note { id content }
    }
  }
`

const TOGGLE_PERSISTENCE_MUTATION = `
  mutation TogglePersistence($noteId: ID!) {
    togglePersistence(noteId: $noteId) {
      success
      messages { message type arg }
      note { id persistent }
    }
  }
`

const DELETE_NOTE_MUTATION = `
  mutation DeleteNote($noteId: ID!) {
    deleteNote(noteId: $noteId)
  }
`

const NOTES_QUERY = `
  query AppRequestNotes($appRequestIds: [ID!]) {
    appRequests(filter: { ids: $appRequestIds }) {
      notes { id content }
    }
  }
`

function warningMessages (messages: { message: string, type: string }[]) {
  return messages.filter(m => m.type === 'warning').map(m => m.message)
}

test.describe.serial('Notes - XSS sanitization', { tag: '@default' }, () => {
  const periodName = '2025 Notes XSS'
  const periodCode = 'NOTES_XSS-001'
  const timeZone = 'America/Chicago'
  const openDate = '2025-07-01T00:00:00.000-05:00'
  const dateTomorrow = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setMilliseconds(0)).toISOString()
  const closeDate = DateTime.fromISO(dateTomorrow).setZone(timeZone).toISO()
  const applicantLogin = 'applicant'

  let periodId = 0
  let appRequestId = 0

  test('Admin - create period for notes XSS tests', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate: DateTime!, $closeDate: DateTime!) {
        createPeriod(period: { name: $name, code: $code, openDate: $openDate, closeDate: $closeDate }, validateOnly: false) {
          period { id name code openDate closeDate reviewed }
          messages { message }
        }
      }
    `
    const variables = { name: periodName, code: periodCode, openDate, closeDate }
    const response = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    periodId = response.createPeriod.period.id
    expect(response.createPeriod.period.name).toEqual(periodName)
    expect(response.createPeriod.period.code).toEqual(periodCode)
  })

  test('Admin - mark period reviewed', async ({ adminRequest }) => {
    const query = `
      mutation MarkPeriodReviewed($periodId: ID!) {
        markPeriodReviewed(periodId: $periodId) {
          period { id reviewed }
          messages { message }
        }
      }
    `
    const { markPeriodReviewed } = await adminRequest.graphql<{ markPeriodReviewed: { period: { id: number, reviewed: boolean }, messages: { message: string }[] } }>(query, { periodId })
    expect(markPeriodReviewed.period.reviewed).toEqual(true)
  })

  test('Applicant - create app request', async ({ applicantRequest }) => {
    const query = `
      mutation CreateAppRequest($login: String!, $periodId: ID!) {
        createAppRequest(login: $login, periodId: $periodId, validateOnly: false) {
          appRequest { id applicant { login } }
          messages { message }
        }
      }
    `
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, { login: applicantLogin, periodId })
    appRequestId = createAppRequest.appRequest.id
    expect(createAppRequest.appRequest.applicant.login).toEqual(applicantLogin)
  })

  test('Applicant - fill prompts with qualified data', async ({ applicantRequest }) => {
    let availableUnansweredPromptsExist = true
    let iterations = 0
    while (availableUnansweredPromptsExist && iterations < promptMapApplicantQualified.size) {
      iterations++
      const getPrompts = `
        query GetPrompts($appRequestIds: [ID!]) {
          appRequests(filter: { ids: $appRequestIds }) {
            applications {
              requirements {
                prompts { id key answered visibility }
              }
            }
          }
        }
      `
      const updatePrompt = `
        mutation UpdatePrompt($promptId: ID!, $data: JsonData!, $validateOnly: Boolean) {
          updatePrompt(promptId: $promptId, data: $data, validateOnly: $validateOnly) {
            success
            messages { message }
          }
        }
      `
      const response = await applicantRequest.graphql<{ appRequests: { applications: { requirements: { prompts: { id: number, key: string, answered: string, visibility: string }[] }[] }[] }[] }>(getPrompts, { appRequestIds: [appRequestId] })
      const available = response.appRequests.flatMap(r => r.applications.flatMap(a => a.requirements.flatMap(req => req.prompts.filter(p => !p.answered && p.visibility === 'AVAILABLE'))))
      if (available.length < 1) {
        availableUnansweredPromptsExist = false
        break
      }
      for (const prompt of available) {
        const promptData = promptMapApplicantQualified.get(prompt.key)
        if (!promptData) continue
        for (const value of promptData) {
          const { updatePrompt: result } = await applicantRequest.graphql<{ updatePrompt: { success: boolean, messages: { message: string }[] } }>(updatePrompt, { promptId: prompt.id, data: value[1], validateOnly: false })
          expect(result.success).toEqual(true)
        }
      }
    }
  })

  test('Applicant - submit app request', async ({ applicantRequest }) => {
    const query = `
      mutation SubmitAppRequest($appRequestId: ID!) {
        submitAppRequest(appRequestId: $appRequestId) {
          success
          messages { message type arg }
          appRequest { id status }
        }
      }
    `
    const { submitAppRequest } = await applicantRequest.graphql<{ submitAppRequest: { appRequest: { id: string, status: string }, messages: { message: string, type: string, arg: string }[], success: boolean } }>(query, { appRequestId })
    expect(submitAppRequest.success).toEqual(true)
  })

  test('Reviewer - script tag is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<p>safe</p><script>alert(1)</script>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).toContain('<p>safe</p>')
    expect(addNote.note?.content).not.toContain('<script')
    expect(warningMessages(addNote.messages)).toContain('<script> tags will be removed.')
  })

  test('Reviewer - iframe is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<p>before</p><iframe srcdoc="<script>alert(1)</script>"></iframe><p>after</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('<iframe')
    expect(addNote.note?.content).not.toContain('srcdoc')
    expect(warningMessages(addNote.messages)).toContain('<iframe> tags will be removed.')
  })

  test('Reviewer - object tag is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<p>ok</p><object data="x.svg"></object>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('<object')
    expect(warningMessages(addNote.messages)).toContain('<object> tags will be removed.')
  })

  test('Reviewer - embed tag is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<p>ok</p><embed src="x.svg">'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('<embed')
    expect(warningMessages(addNote.messages)).toContain('<embed> tags will be removed.')
  })

  test('Reviewer - style tag is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<style>body{display:none}</style><p>visible</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('<style')
    expect(addNote.note?.content).toContain('<p>visible</p>')
    expect(warningMessages(addNote.messages)).toContain('<style> tags will be removed.')
  })

  test('Reviewer - stylesheet link is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<link rel="stylesheet" href="evil.css"><p>ok</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toMatch(/<link[^>]*stylesheet/i)
    expect(warningMessages(addNote.messages)).toContain('Stylesheet <link> tags will be removed.')
  })

  test('Reviewer - inline style attribute is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<p style="color:red">red text</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('style=')
    expect(addNote.note?.content).toContain('red text')
    expect(warningMessages(addNote.messages)).toContain('Inline style attributes will be removed.')
  })

  test('Reviewer - onclick attribute is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<a href="https://example.com" onclick="alert(1)">link</a>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('onclick')
    expect(addNote.note?.content).toContain('href="https://example.com"')
    expect(warningMessages(addNote.messages)).toContain('Inline event handlers (e.g. onclick) will be removed.')
  })

  test('Reviewer - javascript: URL in href is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<a href="javascript:alert(1)">click me</a>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('javascript:')
    expect(addNote.note?.content).toContain('click me')
    expect(warningMessages(addNote.messages)).toContain('javascript: URLs will be removed.')
  })

  test('Reviewer - control-char obfuscated javascript: URL is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<a href="j\tavascript:alert(1)">click me</a>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toMatch(/href=["'][^"']*avascript:/i)
    expect(warningMessages(addNote.messages)).toContain('javascript: URLs will be removed.')
  })

  test('Reviewer - broken obfuscated script tag is left broken and properly closed without warning', async ({ reviewerRequest }) => {
    const content = '<scrip<script>const fake=1</script>t>alert("test")</script>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).toContain('<scrip<script>const fake=1t&gt;alert(\"test\")</scrip<script>')
  })

  test('Reviewer - javascript: URL in formaction is stripped with warning', async ({ reviewerRequest }) => {
    const content = '<form><button formaction="javascript:alert(1)">go</button></form>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).not.toContain('javascript:')
    expect(warningMessages(addNote.messages)).toContain('javascript: URLs will be removed.')
  })

  test('Reviewer - mixed XSS payload triggers multiple warnings', async ({ reviewerRequest }) => {
    const content = '<style>x{}</style><p style="color:red" onclick="alert(1)"><a href="javascript:alert(1)">x</a></p><script>alert(1)</script>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    const warnings = warningMessages(addNote.messages)
    expect(warnings).toContain('<script> tags will be removed.')
    expect(warnings).toContain('<style> tags will be removed.')
    expect(warnings).toContain('Inline style attributes will be removed.')
    expect(warnings).toContain('Inline event handlers (e.g. onclick) will be removed.')
    expect(warnings).toContain('javascript: URLs will be removed.')
    expect(addNote.note?.content).not.toContain('<script')
    expect(addNote.note?.content).not.toContain('<style')
    expect(addNote.note?.content).not.toContain('style=')
    expect(addNote.note?.content).not.toContain('onclick')
    expect(addNote.note?.content).not.toContain('javascript:')
  })

  test('Reviewer - clean HTML persists unchanged with no warnings', async ({ reviewerRequest }) => {
    const content = '<p>This is a perfectly normal note with <strong>bold</strong> and <em>italic</em> text.</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.content).toContain('<strong>bold</strong>')
    expect(addNote.note?.content).toContain('<em>italic</em>')
    expect(warningMessages(addNote.messages)).toEqual([])
  })

  test('Reviewer - validateOnly returns warnings without persisting note', async ({ reviewerRequest }) => {
    const before = await reviewerRequest.graphql<{ appRequests: { notes: { id: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    const beforeCount = before.appRequests[0].notes.length

    const content = '<script>alert(1)</script><p style="color:red">x</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content, validateOnly: true })
    const warnings = warningMessages(addNote.messages)
    expect(warnings).toContain('<script> tags will be removed.')
    expect(warnings).toContain('Inline style attributes will be removed.')

    const after = await reviewerRequest.graphql<{ appRequests: { notes: { id: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    expect(after.appRequests[0].notes.length).toEqual(beforeCount)
  })

  test('Reviewer - validateOnly returns svg javacript link warnings without persisting note', async ({ reviewerRequest }) => {
    const before = await reviewerRequest.graphql<{ appRequests: { notes: { id: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    const beforeCount = before.appRequests[0].notes.length

    const content = '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="javascript:alert(1)" x="10" y="10" /></svg><p>x</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content, validateOnly: true })
    const warnings = warningMessages(addNote.messages)
    expect(warnings).toContain('javascript: URLs will be removed.')

    const after = await reviewerRequest.graphql<{ appRequests: { notes: { id: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    expect(after.appRequests[0].notes.length).toEqual(beforeCount)
  })

  test('Reviewer - blank-after-clean payload returns error, not warning', async ({ reviewerRequest }) => {
    const content = '<script>alert(1)</script>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(false)
    const errors = addNote.messages.filter(m => m.type === 'error').map(m => m.message)
    expect(errors).toContain('Message is required.')
  })

  test('Reviewer - updateNote sanitizes XSS and returns warnings', async ({ reviewerRequest }) => {
    const cleanContent = '<p>original clean note</p>'
    const created = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: cleanContent })
    expect(created.addNote.success).toEqual(true)
    const noteId = created.addNote.note!.id

    const xssContent = '<p>updated</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>'
    const { updateNote } = await reviewerRequest.graphql<UpdateNoteResponse>(UPDATE_NOTE_MUTATION, { noteId, content: xssContent })
    expect(updateNote.success).toEqual(true)
    expect(updateNote.note?.content).toContain('<p>updated</p>')
    expect(updateNote.note?.content).not.toContain('<script')
    expect(updateNote.note?.content).not.toContain('javascript:')
    const warnings = warningMessages(updateNote.messages)
    expect(warnings).toContain('<script> tags will be removed.')
    expect(warnings).toContain('javascript: URLs will be removed.')
  })

  test('Reviewer - updateNote with clean HTML persists changes without warnings', async ({ reviewerRequest }) => {
    const created = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: '<p>original content</p>' })
    expect(created.addNote.success).toEqual(true)
    const noteId = created.addNote.note!.id

    const newContent = '<p>edited content with <strong>bold</strong></p>'
    const { updateNote } = await reviewerRequest.graphql<UpdateNoteResponse>(UPDATE_NOTE_MUTATION, { noteId, content: newContent })
    expect(updateNote.success).toEqual(true)
    expect(updateNote.note?.id).toEqual(noteId)
    expect(updateNote.note?.content).toContain('edited content')
    expect(updateNote.note?.content).toContain('<strong>bold</strong>')
    expect(warningMessages(updateNote.messages)).toEqual([])
  })

  test('Reviewer - updateNote with blank content returns error', async ({ reviewerRequest }) => {
    const created = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: '<p>note to attempt blanking</p>' })
    const noteId = created.addNote.note!.id

    const { updateNote } = await reviewerRequest.graphql<UpdateNoteResponse>(UPDATE_NOTE_MUTATION, { noteId, content: '   ' })
    expect(updateNote.success).toEqual(false)
    const errors = updateNote.messages.filter(m => m.type === 'error').map(m => m.message)
    expect(errors).toContain('Note content may not be blank. Delete the note instead.')
  })

  test('Reviewer - deleteNote removes the note', async ({ reviewerRequest }) => {
    const created = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: '<p>note to be deleted</p>' })
    expect(created.addNote.success).toEqual(true)
    const noteId = created.addNote.note!.id

    const before = await reviewerRequest.graphql<{ appRequests: { notes: { id: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    expect(before.appRequests[0].notes.find(n => n.id === noteId)).toBeTruthy()

    const { deleteNote } = await reviewerRequest.graphql<{ deleteNote: boolean }>(DELETE_NOTE_MUTATION, { noteId })
    expect(deleteNote).toEqual(true)

    const after = await reviewerRequest.graphql<{ appRequests: { notes: { id: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    expect(after.appRequests[0].notes.find(n => n.id === noteId)).toBeUndefined()
  })

  test('Reviewer - can add a persistent note', async ({ reviewerRequest }) => {
    const content = '<p>persistent reviewer note</p>'
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content, persistent: true })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.persistent).toEqual(true)
    expect(addNote.note?.content).toContain('persistent reviewer note')
  })

  test('Reviewer - can toggle note persistence on and off', async ({ reviewerRequest }) => {
    const { addNote } = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: '<p>note for toggle cycle</p>' })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.persistent).toEqual(false)
    const noteId = addNote.note!.id

    const first = await reviewerRequest.graphql<TogglePersistenceResponse>(TOGGLE_PERSISTENCE_MUTATION, { noteId })
    expect(first.togglePersistence.success).toEqual(true)
    expect(first.togglePersistence.note?.persistent).toEqual(true)

    const second = await reviewerRequest.graphql<TogglePersistenceResponse>(TOGGLE_PERSISTENCE_MUTATION, { noteId })
    expect(second.togglePersistence.success).toEqual(true)
    expect(second.togglePersistence.note?.persistent).toEqual(false)
  })

  test('Commentator - can add a regular non-persistent note', async ({ commentatorRequest }) => {
    const content = '<p>commentator non-persistent note</p>'
    const { addNote } = await commentatorRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content })
    expect(addNote.success).toEqual(true)
    expect(addNote.note?.id).toBeTruthy()
    expect(addNote.note?.content).toContain('commentator non-persistent note')
  })

  test('Commentator - cannot add a persistent note', async ({ commentatorRequest }) => {
    const content = '<p>commentator persistent attempt</p>'
    const resp = await commentatorRequest.graphql<any>(ADD_NOTE_MUTATION, { appRequestId, content, persistent: true })
    expect(resp.errors).toBeDefined()
    expect(resp.errors[0].message).toMatch(/may not add a persistent note/i)
  })

  test('Commentator - cannot toggle persistence on an existing note', async ({ reviewerRequest, commentatorRequest }) => {
    const created = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: '<p>note created by reviewer for toggle test</p>' })
    const noteId = created.addNote.note!.id

    const resp = await commentatorRequest.graphql<any>(TOGGLE_PERSISTENCE_MUTATION, { noteId })
    expect(resp.errors).toBeDefined()
    expect(resp.errors[0].message).toMatch(/may not update this note's persistence/i)
  })

  test('Applicant - cannot update an existing note', async ({ reviewerRequest, applicantRequest }) => {
    const created = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: '<p>note for applicant update attempt</p>' })
    const noteId = created.addNote.note!.id

    const resp = await applicantRequest.graphql<any>(UPDATE_NOTE_MUTATION, { noteId, content: '<p>applicant tried to edit</p>' })
    expect(resp.errors).toBeDefined()
    expect(resp.errors[0].message).toMatch(/may not update this note|note not found/i)

    const after = await reviewerRequest.graphql<{ appRequests: { notes: { id: string, content: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    const note = after.appRequests[0].notes.find(n => n.id === noteId)
    expect(note?.content).toContain('note for applicant update attempt')
  })

  test('Applicant - cannot delete an existing note', async ({ reviewerRequest, applicantRequest }) => {
    const created = await reviewerRequest.graphql<AddNoteResponse>(ADD_NOTE_MUTATION, { appRequestId, content: '<p>note for applicant delete attempt</p>' })
    const noteId = created.addNote.note!.id

    const resp = await applicantRequest.graphql<any>(DELETE_NOTE_MUTATION, { noteId })
    expect(resp.errors).toBeDefined()
    expect(resp.errors[0].message).toMatch(/may not delete this note|note not found/i)

    const after = await reviewerRequest.graphql<{ appRequests: { notes: { id: string }[] }[] }>(NOTES_QUERY, { appRequestIds: [appRequestId] })
    expect(after.appRequests[0].notes.find(n => n.id === noteId)).toBeTruthy()
  })

})
