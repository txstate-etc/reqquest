<script lang="ts">
  /**
   * This page collects prompt data from the applicant. Only one route exists per
   * prompt, even if the prompt is shared between multiple applications. We should
   * be able to figure out which application we are in based on the full state of
   * the app request since the prompt should only be visible in a single spot.
   */

  import { Form, confirmationStore } from '@txstate-mws/carbon-svelte'
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { Button, InlineNotification } from 'carbon-components-svelte'
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
    const { success, messages, data: newData } =  await api.updatePrompt(prompt.id, data, false, dataVersion, await confirmInvalidatedOverride())
    if (!success) loading = false
    return {
      success,
      messages,
      data: newData[prompt.key]
    }
  }

  async function onValidate (data: any) {
    const { messages } = await api.updatePrompt(prompt.id, data, true, dataVersion)
    return messages
  }

  async function onSaved () {
    await invalidate('request:apply')
    if (continueAfterSave && prompt.answered) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- already resolved      
      await goto($nextHref.nextHref)
    }
    loading = false
  }

  async function confirmInvalidatedOverride() {
   return (prompt.invalidated && $store?.hasUnsavedChanges) 
    ? await confirmationStore.confirm(
        'Corrections are required, but no changes have been made.  Can you confirm that all data is correct, and does not require changes?',
        {
          title: 'Confirm data is correct',
          yesText: 'Yes',
          noText: 'No'
        }
      )
    : false 
  }

  let lastPromptId: string | undefined
  $: if (prompt.id !== lastPromptId) {
    lastPromptId = prompt.id
    store = undefined
  }
</script>
{#if loading}
  <Loading />
{/if}

{#key prompt.id}
  <div class="prompt-intro flow max-w-screen-md mx-auto pt-10 px-6">
    <!-- svelte-ignore a11y_autofocus -->
    <h2 id="prompt-title" tabindex="-1" autofocus class="font-bold text-2xl leading-normal text-center">{prompt.title}</h2>
    <p class="text-center"> {prompt.description}</p>
  </div>
  <Form bind:store hideFallbackMessage unsavedWarning submit={onSubmit} validate={onValidate} preloadAsDraft={!prompt.hasSavedData} preload={prompt.preloadData} on:saved={onSaved} let:data>
    <svelte:component this={def!.formComponent} {data} appRequestId={appRequestForExport.id} appRequestData={appRequestForExport.data} prestageData={{latest: prompt.prestageData, current: appRequestForExport.data[prompt.key]?.__prestage}} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData}  invalidated={prompt.invalidated} invalidatedReason={prompt.invalidatedReason} />
    <svelte:fragment slot="submit" let:submitting>
      <div class='form-submit flex gap-12 justify-center mt-16'>
        {#if hasPreviousPrompt}
          <Button kind="ghost" on:click={handleBack}>Back</Button>
        {/if}
        <Button icon={submitting && !continueAfterSave ? ButtonLoadingIcon : null} type="submit" kind="secondary" disabled={submitting} on:click={() => { continueAfterSave = false }}>Save</Button>
        <Button icon={submitting && !continueAfterSave ? ButtonLoadingIcon : null} type="submit" disabled={submitting} on:click={() => { continueAfterSave = true }}>Continue</Button>
      </div>
    </svelte:fragment>
    <div class="flow max-w-screen-md">
      <!-- Correction inline prompt notification -->
      {#if prompt.invalidated && !$store?.hasUnsavedChanges}
        <InlineNotification
          kind="error"
          title='Corrections required:'
          hideCloseButton={true}
          lowContrast
          subtitle={prompt.invalidatedReason ?? 'Must update form data before continuing'}
        />
      {/if}
    </div>
  </Form>
  
{/key}
