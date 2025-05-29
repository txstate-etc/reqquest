<script lang="ts">
  /**
   * This page collects prompt data from the applicant. Only one route exists per
   * prompt, even if the prompt is shared between multiple applications. We should
   * be able to figure out which application we are in based on the full state of
   * the app request since the prompt should only be visible in a single spot.
   */

  import { Form } from '@txstate-mws/carbon-svelte'
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { Button } from 'carbon-components-svelte'
  import NextOutline from 'carbon-icons-svelte/lib/NextOutline.svelte'
  import Save from 'carbon-icons-svelte/lib/Save.svelte'
  import { afterNavigate, beforeNavigate, goto, invalidate } from '$app/navigation'
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { api, ButtonLoadingIcon } from '$lib'
  import { uiRegistry } from '../../../../../local/index.js'
  import type { PageData } from './$types.js'

  export let data: PageData
  $: ({ prompt, appRequestData } = data)
  $: def = uiRegistry.getPrompt($page.params.promptKey)

  let store: FormStore | undefined
  let continueAfterSave = false

  async function onSubmit (data: any) {
    const { success, messages } = await api.updatePrompt(prompt.id, data, false)
    return {
      success,
      messages,
      data
    }
  }

  async function onValidate (data: any) {
    const { messages } = await api.updatePrompt(prompt.id, data, true)
    return messages
  }

  async function onSaved () {
    const [nextPrompt] = await Promise.all([
      api.getNextPrompt($page.params.id, prompt.key),
      invalidate('request:apply')
    ])
    if (continueAfterSave) {
      if (nextPrompt) await goto(`${base}/requests/${$page.params.id}/apply/${nextPrompt.key}`)
      else await goto(`${base}/requests/${$page.params.id}/apply/review`)
    } else await store?.setData(appRequestData[prompt.key] as object)
  }

  // Remove the form from the DOM when navigating between prompts
  // to make sure state is reset
  let hideForm = false
  beforeNavigate(() => {
    hideForm = true
    store?.reset()
  })
  afterNavigate(() => {
    hideForm = false
  })
</script>

{#if !hideForm}
  <Form bind:store submitText="Save & Continue" submit={onSubmit} validate={onValidate} preload={appRequestData[prompt.key]} on:saved={onSaved} let:data>
    <svelte:component this={def.formComponent} {data} {appRequestData} fetched={prompt.fetchedData} configData={prompt.configurationRelatedData} />
    <svelte:fragment slot="submit" let:submitting>
      <div class='form-submit'>
        <Button icon={submitting && !continueAfterSave ? ButtonLoadingIcon : Save} type="submit" disabled={submitting} on:click={() => { continueAfterSave = false }}>Save</Button>
        <Button icon={submitting && continueAfterSave ? ButtonLoadingIcon : NextOutline} type="submit" disabled={submitting} on:click={() => { continueAfterSave = true }}>Save & Continue</Button>
      </div>
    </svelte:fragment>
  </Form>
{/if}

<style>
  .form-submit {
    text-align: right;
  }
</style>
