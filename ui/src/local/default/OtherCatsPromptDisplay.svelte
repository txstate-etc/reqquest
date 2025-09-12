<script lang="ts">
  import type { OtherCatsData } from './types.js'
  export let data: OtherCatsData
</script>

{#if data.hasOtherCats}
  Has other cats.
{:else}
  Does not have other cats.
{/if}
