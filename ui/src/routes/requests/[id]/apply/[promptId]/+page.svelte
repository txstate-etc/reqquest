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
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import { afterNavigate, beforeNavigate, goto, invalidate } from '$app/navigation'
  import type { ResolvedPathname } from '$app/types'
  import { api, ButtonLoadingIcon } from '$lib'
  import { uiRegistry } from '../../../../../local/index.js'
  import type { PageData } from './$types.js'

  export let data: PageData
  $: ({ prompt, appRequestData, dataVersion, appRequestForExport } = data)
  $: def = uiRegistry.getPrompt(prompt.key)
  const nextHref = getContext<Writable<{ nextHref: ResolvedPathname, prevHref: ResolvedPathname | undefined }>>('nextHref')

  let store: FormStore | undefined
  let continueAfterSave = false
  let hasPreviousPrompt = false

  function checkPreviousPrompt () {
    hasPreviousPrompt = $nextHref.prevHref != null
  }

  async function handleBack () {
    const previousHref = $nextHref.prevHref
    if (previousHref) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- already resolved
      await goto(previousHref)
    }
  }

  async function onSubmit (data: any) {
    const { success, messages } = await api.updatePrompt(prompt.id, data, false, dataVersion)
    return {
      success: !messages.some(m => m.type === 'error' || m.type === 'system'),
      messages,
      data
    }
  }

  async function onValidate (data: any) {
    const { messages } = await api.updatePrompt(prompt.id, data, true)
    return messages
  }

  async function onSaved () {
    await invalidate('request:apply')
    if (continueAfterSave && prompt.answered) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- already resolved
      await goto($nextHref.nextHref)
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
    checkPreviousPrompt()
  })
</script>

{#if !hideForm}
<div class="prompt-intro flow max-w-screen-md mx-auto pt-10 px-6">
    <h2 id="prompt-title" class="font-medium text-xl text-center">{prompt.title}</h2>
    <p class="text-center"> {prompt.description}</p>
</div>
  <Form bind:store submitText="Save & Continue" submit={onSubmit} validate={onValidate} preload={appRequestData[prompt.key]} on:saved={onSaved} let:data>
    <svelte:component this={def!.formComponent} {data} appRequestId={appRequestForExport.id} {appRequestData} fetched={prompt.fetchedData} configData={prompt.relatedConfigData[prompt.key]} relatedConfigData={prompt.relatedConfigData} />
    <svelte:fragment slot="submit" let:submitting>
      <div class='form-submit flex gap-12 justify-center mt-16'>
        {#if hasPreviousPrompt}
          <Button kind="ghost" on:click={handleBack}>Back</Button>
        {/if}
        <Button icon={submitting && !continueAfterSave ? ButtonLoadingIcon : null} type="submit" kind="secondary" disabled={submitting} on:click={() => { continueAfterSave = false }}>Save</Button>
        <Button icon={submitting && !continueAfterSave ? ButtonLoadingIcon : null} type="submit" disabled={submitting} on:click={() => { continueAfterSave = true }}>Continue</Button>
      </div>
    </svelte:fragment>
  </Form>
{/if}

<style>

</style>
