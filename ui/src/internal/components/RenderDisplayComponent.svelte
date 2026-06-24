<script lang="ts">
  import { InlineNotification } from 'carbon-components-svelte'
  import type { PromptDefinition } from '../../lib/registry.js'

  export let def: PromptDefinition | undefined
  export let appRequestId: string
  export let appData: Record<string, any>
  export let prompt: { key: string, answered: boolean, moot: boolean | null, invalidated: boolean | null, invalidatedReason: string | null }  
  export let prestageData: Record<string, any>
  export let configData: Record<string, any>
  export let gatheredConfigData: Record<string, any>
  export let showMoot = false
</script>

<svelte:boundary onerror={e => console.error(e)}>
  {#if showMoot && prompt.moot}
    <em>Already disqualified.</em>
  {:else if !prompt.answered}
    <em>Incomplete</em>
  {:else if !def?.displayComponent}
    <em>No display component registered.</em>
    <pre>{JSON.stringify(appData[prompt.key] ?? {}, null, 2)}</pre>
  {:else}
    <svelte:component this={def.displayComponent} {appRequestId} data={appData[prompt.key]} appRequestData={appData} {prestageData} {configData} {gatheredConfigData} invalidated={prompt.invalidated} invalidatedReason={prompt.invalidatedReason} />
  {/if}
  {#if prompt.invalidated && (showMoot || !prompt.moot)}
    <InlineNotification class="mt-6 lg:mt-4" kind="warning" title="Applicant has made corrections:" subtitle={prompt.invalidatedReason ?? 'Requires review'} lowContrast hideCloseButton />
  {/if}
  {#snippet failed()}
    <div class="error">
      <div>Error Loading Component</div>
      <p>There was an error loading the display component for this prompt.</p>
    </div>
  {/snippet}
</svelte:boundary>

<style>
  .error div { font-weight: bold; }
</style>
