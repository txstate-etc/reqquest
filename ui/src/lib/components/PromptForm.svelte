<script lang="ts">
  import { base } from '$app/paths'
  import { Form } from '@txstate-mws/carbon-svelte'
  import type { SubmitResponse, Feedback } from '@txstate-mws/svelte-forms'
  import { Button } from 'carbon-components-svelte'
  import { Save, NextOutline } from 'carbon-icons-svelte'
  import { createEventDispatcher } from 'svelte'
  import { api } from '../api.js'
  import { findNextApplyPrompt } from '../util.js'
  import { uiRegistry } from '../../local/index.js'

  const dispatch = createEventDispatcher()

  type T = $$Generic<Record<string, any>>
  type F = $$Generic<any>

  export let promptId: string
  export let promptKey: string
  export let preload: T
  export let fetched: F

  const promptDefinition = uiRegistry.getPrompt(promptKey)
  const promptComponent = promptDefinition.formComponent

  let continueAfterSave = false
  let nextRoute: string | undefined
  async function submit (data: T): Promise<SubmitResponse<T>> {
    console.log('submit', data)
    const { success, messages, appRequest } = await api.updatePrompt(promptId, data)
    if (success) {
      nextRoute = findNextApplyPrompt(appRequest, promptId, promptKey, base)
    }
    return {
      success,
      messages,
      data
    }
  }

  async function validate (data: T): Promise<Feedback[]> {
    console.log('validate', data)
    const { messages } = await api.validatePrompt(promptId, data)
    return messages
  }

  function onSaved () {
    if (continueAfterSave && nextRoute) {
      dispatch('continue', nextRoute)
    } else {
      dispatch('saved')
    }
  }
</script>

<Form {submit} {validate} {preload} let:data on:saved={onSaved}>
  <svelte:component this={promptComponent} {data} {fetched} />
  <svelte:fragment slot="submit" let:hasUnsavedChanges let:submitting>
    <div class='text-right'>
      <Button icon={Save} type="submit" disabled={!hasUnsavedChanges || submitting}>Save</Button>
      <Button icon={NextOutline} type="submit" disabled={!hasUnsavedChanges || submitting} on:click={() => { continueAfterSave = true }}>Save & Continue</Button>
    </div>
  </svelte:fragment>
</Form>
