<script lang="ts">
  import { booleanToWord } from "$internal"
  import FileDisplay from "./FileDisplay.svelte"
  import type { MaintainSysDocumentation } from "./types"
  
  export let appRequestId: string
  export let data: MaintainSysDocumentation
</script>
<p class="text-xs">Has maintained system documentation</p>
<p>{booleanToWord(data?.maintainSysDocumentation)}</p>

{#if data.maintainSysDocumentation}
  <p>Doc: {data?.documentation?.name}</p>
  <FileDisplay 
    {appRequestId}
    promptKey='maintain_sys_documentation_prompt'
    promptIdFileChecksum='documentation/shasum'
    title='Documentation'
    mime={data.documentation.mime}
  />
{/if}


