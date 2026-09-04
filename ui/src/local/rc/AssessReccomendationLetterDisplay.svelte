<script lang="ts">
  import type { AssessReccomendationLetter } from "./types"

  export let data: AssessReccomendationLetter
</script>
{#if data?.score}
  <p>{data?.score}</p>
{:else}
  <p>N/A</p>
{/if}

