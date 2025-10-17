<script lang="ts">
  import { Button } from 'carbon-components-svelte'
  import Touch_1 from 'carbon-icons-svelte/lib/Touch_1.svelte'
  import { invalidate } from '$app/navigation'
  import { api, RenderDisplayComponent } from '$lib'
  import { enumAppRequestStatus } from '$lib/typed-client'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../../local'

  /**
   * This page will allow applicants to review all the information they've
   * entered so far, and to navigate to any prompts that need correction, then
   * allows them to submit the app request.
   */
  export let data: PageData
  $: ({ appRequestForNavigation, prequalPrompts, appRequestData } = data)
  $: prompts = prequalPrompts.concat(appRequestForNavigation.applications.flatMap(a => a.requirements.flatMap(r => r.prompts)))
  $: relatedConfigDataByPromptKey = appRequestData.applications.flatMap(a => a.requirements.flatMap(r => r.prompts)).reduce<Record<string, any>>((acc, curr) => ({
    ...acc,
    [curr.key]: curr.relatedConfigData
  }), {})

  async function onSubmit () {
    const { success, messages } = await api.submitAppRequest(appRequestForNavigation.id)
    await invalidate('request:apply')
  }
</script>

<dl>
  {#each prompts as prompt (prompt.id)}
    {@const def = uiRegistry.getPrompt(prompt.key)}
    <dt><div>{prompt.title}</div></dt>
    <dd>
      <div>
        <RenderDisplayComponent {def} appRequestId={appRequestForNavigation.id} appData={appRequestData.data} prompt={prompt} relatedConfigData={relatedConfigDataByPromptKey[prompt.key]} />
      </div>
    </dd>
  {/each}
</dl>
{#each appRequestForNavigation.applications as application (application.id)}
  {application.navTitle}: {application.status}<br>
  {application.statusReason ?? ''}<br>
  {#if application.statusReason?.length}<br>{/if}
{/each}
{#if appRequestForNavigation.status === enumAppRequestStatus.READY_TO_SUBMIT}
  <Button icon={Touch_1} on:click={onSubmit}>Submit For Review</Button>
{/if}

<style>
  dl {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
  }
  dt, dd {
    display: flex;
    align-items: center;
    border: 1px solid #666666;
    width: 50%;
    padding: 5px;
  }
  dt {
    border-right: none;
  }
  dt:not(:last-of-type), dd:not(:last-of-type) {
    border-bottom: none;
  }
</style>
