<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { WrittenAutomation } from "./types"

  export let data: WrittenAutomation
</script>
<p class="text-xs">Has written automation: </p>
<p>{booleanToWord(data?.hasWrittenAutomation)}</p>

{#if data.hasWrittenAutomation}
  <p class="text-xs">Written automation</p>
  <p>{data?.writtenAutomation}</p>
{/if}


