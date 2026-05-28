<script lang="ts">
  import { Form, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { Modal } from 'carbon-components-svelte'
  import { afterNavigate, invalidate, invalidateAll } from '$app/navigation'
  import { uiRegistry } from '../../local/index.js'
  import { api } from '../api.js'
  import { stagedprompts } from '../prompt-utils.js'
  import { Loading } from "carbon-components-svelte";

  export let open = false
  export let optIn = false
  export let prompt: any
  export let appRequest: any

  $: def = uiRegistry.getPrompt(prompt.key)
  $: loading = false


  let store: FormStore | undefined

  async function submit (data: any) {
    loading = true
    const { success, messages } = await api.updatePrompt(prompt.id, data, false)
    data = {}
    open = false
    loading = false
    invalidateAll()
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
  {submit}
  title={`${optIn ? 'Opt in to' : 'Opt out of'} ${prompt?.title}?`}
  submitText={optIn ? 'Opt in' : 'Opt out'}
  cancelText="Cancel"
  preload={prompt.preloadData}
  preloadAsDraft={!prompt.hasSavedData} 
  >
    <svelte:component this={def!.formComponent} {data} appRequestId={appRequest.id} appRequestData={appRequest.data} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} {store} />
</PanelFormDialog>
