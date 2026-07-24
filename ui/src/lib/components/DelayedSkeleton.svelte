<script lang="ts">
  import type { Loader } from "$lib/registry"
  import ApplicantPromptSkeleton from "$internal/components/ApplicantPromptSkeleton.svelte"

  export let loader: Loader

  const wait = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, typeof loader === 'boolean' ? 0 : loader?.delay ?? 0)
    })
  }
</script>

{#await wait()}
<!-- Nothing displayed if delayed, expecting content to load quickly -->
{:then}
  {#if typeof loader === 'boolean'}
    <ApplicantPromptSkeleton />
  {:else}
    <svelte:component this={loader.skeletonComponent} />
  {/if}
{/await}