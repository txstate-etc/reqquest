<script lang="ts">
  /**
   * This page is the prompt screen where we will ask reviewers for data. It's
   * very similar to the prompt screen for applicants except it has a different
   * navigation context.
   *
   * It's possible that the same prompt key could be shown in both the /apply/ route
   * and the /approve/ route, if reviewers are given permission to edit PREQUAL or
   * QUALIFICATION prompts. It will be important to keep context straight between
   * whether we're viewing the app request as an applicant or as a reviewer.
   */

  import PromptForm from '$lib/components/PromptForm.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ appRequest, applId, reqId, promptId } = data)

  $: promptKey = appRequest.applications.find(a => a.id === applId)?.requirements.find(r => r.id === reqId)?.prompts.find(p => p.id === promptId)?.key
  const preload = {}
  const fetched = {}
</script>

{#if promptKey}
  <PromptForm {promptKey} {promptId} {preload} {fetched} />
{/if}
