<script lang="ts">
  import { FieldRadio, FieldUpload } from '@txstate-mws/carbon-svelte'
  import type { MaintainSysDocumentation } from './types.js'
  export let gatheredConfigData
  export let data: Partial<MaintainSysDocumentation>
</script>

<FieldRadio boolean path="maintainSysDocumentation" legendText="Have you ever created a guide, a readme file, or a set of instructions to help someone else use a tool or complete a task?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

{#if data.maintainSysDocumentation}
  <FieldUpload path='documentation' labelText='Upload a file of your documentation' />
{/if}
