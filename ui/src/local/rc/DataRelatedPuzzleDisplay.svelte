<script lang="ts">
  import FileDisplay from "./FileDisplay.svelte"
  import type { DataRelatedPuzzle } from "./types"

  export let appRequestId: string
  export let data: DataRelatedPuzzle
</script>
<p class="text-xs">You’re building a 'Seat Finder' for the dining hall. In plain English (or pseudocode), describe how you would sort a list of tables to show the user the ones that are both empty and closest to the entrance. Note: You may make up data to support your solution.</p>
<p>{data?.puzzleAnswer}</p>

{#if data.additionalDocumentation}
  <p>Addional documentation: {data.additionalDocumentation?.name}</p>
  <FileDisplay 
    {appRequestId}
    promptKey='data_related_puzzle_prompt'
    promptIdFileChecksum='additionalDocumentation/shasum'
    title='Addidional Documentation'
    mime={data.additionalDocumentation.mime}
  />
{/if}
