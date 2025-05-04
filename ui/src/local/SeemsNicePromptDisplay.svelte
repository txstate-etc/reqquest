<script lang="ts">
  import type { NiceData } from './types.js'
  export let data: NiceData
</script>

{#if data.seemsNice}
  Nice.
{:else}
  Mean.
{/if}
