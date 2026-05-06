<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { OutsideClassExample } from "./types"

  export let data: OutsideClassExample
</script>
<p class="text-xs">Apart from required class assignments, have you ever independently built, modified, or contributed to a software project (e.g., a personal website, a game, a script to automate a task, or a contribution to an Open Source project) and successfully resolved a technical bug or error that initially prevented it from working?</p>
<p>{booleanToWord(!!data?.outsideClassExample)}</p>

{#if data?.outsideClassExample}
  <p>Description: {data?.description}</p>
{/if}


