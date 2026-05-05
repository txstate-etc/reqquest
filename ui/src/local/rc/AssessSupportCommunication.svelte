<script lang="ts">
  import { FieldSelect } from '@txstate-mws/carbon-svelte'
  import type { AssessSupportCommunication } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessSupportCommunication>
</script>

<FieldSelect required path="clarity" labelText="Rate the clarity and accessibility of the response for the scenario" items={[{ label: 'Excellent', value: 'Excellent' }, { label: 'Good', value: 'Good' }, { label: 'Neutral', value: 'Neutral' }, { label: 'Poor', value: 'Poor' }, { label: 'Unacceptable', value: 'Unacceptable' },]} />
