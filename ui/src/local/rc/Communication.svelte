<script lang="ts">
  import { FieldTextArea, FormInlineNotification } from '@txstate-mws/carbon-svelte'
  import type { Communication } from './types.js'
  export let gatheredConfigData
  export let data: Partial<Communication>
  export let fetched: { prefilledFrom?: string } | undefined = undefined
</script>

{#if fetched?.prefilledFrom}
  <FormInlineNotification message={{ type: 'info', message: `We filled in your answer from your ${fetched.prefilledFrom} application. Review it and update anything that has changed.` }} />
{/if}
<FieldTextArea path='describeCommunication' labelText="You are leading a group project. One teammate is doing all the work, and another hasn't responded to texts in three days. How do you handle this scenario?" />
