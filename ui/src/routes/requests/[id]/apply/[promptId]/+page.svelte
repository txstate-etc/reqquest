<script lang="ts">
  import { ApplicantPromptPage } from '$internal'
  import ApplicantPromptSkeleton from '$internal/components/ApplicantPromptSkeleton.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#await data.applicantPromptPromise}
  <ApplicantPromptSkeleton />
{:then { prompt, appRequest }}
  <ApplicantPromptPage data={{ prompt, appRequest, dataVersion: appRequest.dataVersion }} />
{/await}
