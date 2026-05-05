<script lang="ts">
  import { FieldRadio, FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { WrittenAutomation } from './types.js'
  export let gatheredConfigData
  export let data: Partial<WrittenAutomation>
</script>

<FieldRadio boolean path="hasWrittenAutomation" legendText="Have you ever written a script to automate a repetitive task?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

{#if data.hasWrittenAutomation}
  <FieldTextArea path='writtenAutomation' labelText='Describe the task(s) that you’ve automated and why. Feel free to include any links if this is already documented.' />
{/if}
