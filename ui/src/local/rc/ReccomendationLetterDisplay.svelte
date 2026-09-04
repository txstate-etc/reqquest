<script lang="ts">
  import FileDisplay from "./FileDisplay.svelte"
  import type { ReccomendationLetter } from "./types"
  export let data: ReccomendationLetter
  export let appRequestId: string

</script>

{#if data?.reccomendationLetter}
  <p>{data?.reccomendationLetter?.name}</p>
  <FileDisplay 
    {appRequestId}
    promptKey='reccomendation_letter_prompt'
    promptIdFileChecksum='reccomendationLetter/shasum'
    title='Reccomendation Letter'
    mime={data?.reccomendationLetter?.mime}
  />
{:else}
  <p>N/A</p>
{/if}