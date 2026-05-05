<script lang="ts">
  import { FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { Communication } from './types.js'
  export let gatheredConfigData
  export let data: Partial<Communication>
</script>

<FieldTextArea path='describeCommunication' labelText="You are leading a group project. One teammate is doing all the work, and another hasn't responded to texts in three days. How do you handle this scenario?" />
