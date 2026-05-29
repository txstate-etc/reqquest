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
  import { afterNavigate, beforeNavigate, goto, invalidate, invalidateAll } from '$app/navigation'
  import type { ResolvedPathname } from '$app/types'
  import { uiRegistry } from '../../local/index.js'
  import { api } from '../api.js'
  import type { PageData } from '../../routes/requests/[id]/apply/[promptId]/$types.js'
  import ButtonLoadingIcon from './ButtonLoadingIcon.svelte'
  import { Loading } from "carbon-components-svelte";

  export let data: PageData
  $: ({ prompt, appRequestForExport, dataVersion } = data)
  $: def = uiRegistry.getPrompt(prompt.key)
  $: unsavedWarningCheck = true // TODO: Temp fix to prevent unsavedWarn check from triggering after save and continue
  const nextHref = getContext<Writable<{ nextHref: ResolvedPathname, prevHref: ResolvedPathname | undefined }>>('nextHref')

  let store: FormStore | undefined
  let continueAfterSave = false
  $: hasPreviousPrompt = $nextHref.prevHref != null
  $: loading = false  

  async function handleBack () {
    const previousHref = $nextHref.prevHref
    if (previousHref) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- already resolved
      await goto(previousHref)
    }
  }

 async function onSubmit (data: any) {
    loading = true
    const { success, messages } = await api.updatePrompt(prompt.id, data, false, dataVersion)   
    if (!success) loading = false    
    return {
      success,
      messages,
      data
    }
  }

  async function onValidate (data: any) {
    const { messages } = await api.updatePrompt(prompt.id, data, true, dataVersion)
    return messages
  }

  async function onSaved () {
    unsavedWarningCheck = false
    await invalidate('request:apply')
    if (continueAfterSave && prompt.answered) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- already resolved      
      await goto($nextHref.nextHref)
    } else {
      await store?.setData(appRequestForExport.data[prompt.key] as object)
    }
    loading = false
    unsavedWarningCheck = true
  }

  let lastPromptId: string | undefined
  $: if (prompt.id !== lastPromptId) {
    lastPromptId = prompt.id
    store = undefined
  }
  afterNavigate(async (navigation) => { 
    if (!continueAfterSave) { // navigating away from current prompt without using the continue button ... remove prompt staging and invalidate to ensure any changes are reflected in nav
      await invalidate('request:apply')
    }    
  })
</script>
{#if loading} 
  <Loading />
{/if}

{#key prompt.id}
  <div class="prompt-intro flow max-w-screen-md mx-auto pt-10 px-6">
    <!-- svelte-ignore a11y_autofocus -->
    <h2 id="prompt-title" tabindex="-1" autofocus class="font-medium text-xl text-center">{prompt.title}</h2>
    <p class="text-center"> {prompt.description}</p>
  </div>
  <Form bind:store hideFallbackMessage unsavedWarning={unsavedWarningCheck} submit={onSubmit} validate={onValidate} preloadAsDraft={!prompt.hasSavedData} preload={prompt.preloadData}  on:saved={onSaved} let:data>
    <svelte:component this={def!.formComponent} {data} appRequestId={appRequestForExport.id} appRequestData={appRequestForExport.data} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} />
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
{/key}
