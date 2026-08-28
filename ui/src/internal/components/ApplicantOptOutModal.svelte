<script lang="ts">
  import { Form, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { afterNavigate, invalidate, invalidateAll } from '$app/navigation'
  import { uiRegistry } from '../../local/index.js'
  import { api, type PromptForEditing } from '../api.js'
  import { Loading } from "carbon-components-svelte";
  import MissingDefinitionNotification from './MissingDefinitionNotification.svelte'
  import type { AppRequestForDetails, OptOutApplication } from '$lib'

  export let open = false
  export let optIn = false
  export let prompt: PromptForEditing
  export let appRequest: AppRequestForDetails
  export let optOutSelected: OptOutApplication | undefined

  $: def = uiRegistry.getPrompt(prompt.key)
  let loading = false


  let store: FormStore | undefined

  async function submit (data: any) {
    loading = true
    try {      
      const { success, messages, data: newData } = await api.updatePrompt(prompt.id, data, false)
      if (!success) loading = false
      return { success, messages, data: newData?.[prompt.key] }
    } catch (e) {
      loading = false
      throw e
    }
  }

  async function saved () {
    open = false
    loading = false
    invalidateAll()
  }

  async function onValidate (data: any) {
    const { messages } = await api.updatePrompt(prompt.id, data, true)
    return messages
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

<PanelFormDialog
  let:data
  bind:store
  centered
  open={open}
  on:cancel={() => { open = false }}
  validate={onValidate}
  on:saved={saved}
  disableSaveUntilChanged={true}
  {submit}
  title={`${optIn ? 'Opt in to' : 'Opt out of'} ${optOutSelected?.title}?`}
  submitText={optIn ? 'Opt in' : 'Opt out'}
  cancelText="Cancel"
  preload={prompt.preloadData}
  preloadAsDraft={!prompt.hasSavedData} 
  >
    {#if def?.formComponent == null}
      <MissingDefinitionNotification kind="prompt" definitionKey={prompt.key} />
    {:else}
    <svelte:component this={def.formComponent} {data} appRequestId={appRequest.id} appRequestData={appRequest.data} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} invalidated={prompt.invalidated} invalidatedReason={prompt.invalidatedReason} />
    {/if}
</PanelFormDialog>
