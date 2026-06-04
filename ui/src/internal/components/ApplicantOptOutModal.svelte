<script lang="ts">
  import { Form, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { afterNavigate, invalidate, invalidateAll } from '$app/navigation'
  import { uiRegistry } from '../../local/index.js'
  import { api, type PromptForEditing } from '../api.js'
  import { stagedprompts } from '../prompt-utils.js'
  import { Loading } from "carbon-components-svelte";
  import type { AppRequestForDetails, OptOutApplication } from '$lib'

  export let open = false
  export let optIn = false
  export let prompt: PromptForEditing
  export let appRequest: AppRequestForDetails
  export let optOutSelected: OptOutApplication | undefined

  $: def = uiRegistry.getPrompt(prompt.key)
  $: loading = false


  let store: FormStore | undefined

  async function submit (data: any) {
    loading = true
    const { success, messages } = await api.updatePrompt(prompt.id, data, false)
    return {
      success,
      messages,
      data
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

  afterNavigate(async () => {
    stagedprompts.clear() // clear references to staged prompts since we may be navigating to a different prompt that needs staging
    await invalidate('request:apply') // required to redraw the nav tree if potential staged data affects prompt visibility or status
  })
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
  on:validate={onValidate}
  on:saved={saved}
  {submit}
  title={`${optIn ? 'Opt in to' : 'Opt out of'} ${optOutSelected?.title}?`}
  submitText={optIn ? 'Opt in' : 'Opt out'}
  cancelText="Cancel"
  preload={prompt.preloadData}
  preloadAsDraft={!prompt.hasSavedData} 
  >
    <svelte:component this={def!.formComponent} {data} appRequestId={appRequest.id} appRequestData={appRequest.data} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} />
</PanelFormDialog>
