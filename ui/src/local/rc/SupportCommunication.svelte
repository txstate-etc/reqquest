<script lang="ts">
  import { FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { SupportCommunication } from './types.js'
  export let gatheredConfigData
  export let data: Partial<SupportCommunication>
</script>

<FieldTextArea path='describeSupportCommunication' labelText='A faculty member is unable to access a critical application right before a class begins. They are frustrated and using highly technical jargon incorrectly. How do you respond to de-escalate the situation and begin gathering the information you need to help them?' />
