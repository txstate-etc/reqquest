<script lang="ts">
  import { ApplicantPromptPage } from '$internal'
  import DelayedSkeleton from '$lib/components/DelayedSkeleton.svelte';
  import { uiRegistry } from '../../../../../local';
  import type { PageData } from './$types'

  export let data: PageData
  $: loader = uiRegistry.getPrompt(data.basicPromptData.key)?.loader


</script>

{#await data.applicantPromptPromise}
  <div class="prompt-intro flow max-w-screen-md mx-auto pt-10 px-6">
    <!-- svelte-ignore a11y_autofocus -->
    <h2 id="prompt-title" tabindex="-1" autofocus class="font-bold text-2xl leading-normal text-center">{data.basicPromptData.title}</h2>
  </div>
  {#if loader}
    <DelayedSkeleton {loader} />
  {/if}
{:then { prompt, appRequest }}
  <ApplicantPromptPage data={{ prompt, appRequest, dataVersion: appRequest.dataVersion }} />
{/await}
