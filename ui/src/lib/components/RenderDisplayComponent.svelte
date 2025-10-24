<script lang="ts">
  import type { PromptDefinition } from '$lib/registry'

  export let def: PromptDefinition | undefined
  export let appRequestId: string
  export let appData: Record<string, any>
  export let prompt: { key: string, answered: boolean, moot?: boolean }
  export let relatedConfigData: Record<string, any>
  export let showMoot = false
</script>

<svelte:boundary onerror={(e) => console.log(e)}>
  {#if showMoot && prompt.moot}
    <em>Already disqualified.</em>
  {:else if !prompt.answered}
    <em>Incomplete</em>
  {:else if !def?.displayComponent}
    <em>No display component registered.</em>
    <pre>{JSON.stringify(appData[prompt.key] ?? {}, null, 2)}</pre>
  {:else}
    <svelte:component this={def.displayComponent} {appRequestId} data={appData[prompt.key]} appRequestData={appData} configData={relatedConfigData[prompt.key]} relatedConfigData={relatedConfigData} />
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
