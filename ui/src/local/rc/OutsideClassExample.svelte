<script lang="ts">
  import { FieldRadio, FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { OutsideClassExample } from './types.js'
  export let gatheredConfigData
  export let data: Partial<OutsideClassExample>
</script>

<FieldRadio boolean path="outsideClassExample" legendText="Apart from required class assignments, have you ever independently built, modified, or contributed to a software project (e.g., a personal website, a game, a script to automate a task, or a contribution to an Open Source project) and successfully resolved a technical bug or error that initially prevented it from working?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

{#if data.outsideClassExample}
  <FieldTextArea path='description' labelText='Describe the project you worked on and issues you encountered. If using GitHub, please include a link to your account.' />
{/if}
