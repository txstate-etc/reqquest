<script lang="ts">
  import { FieldSelect } from '@txstate-mws/carbon-svelte'
  import type { AssessSupportCommunication } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessSupportCommunication>
</script>

<FieldSelect required path="score" labelText="Rate the strength of the recommendatio" items={[{ label: 'Excellent', value: 'Excellent' }, { label: 'Good', value: 'Good' }, { label: 'Fair', value: 'Fair' }, { label: 'Poor', value: 'Poor' }, { label: 'Troll', value: 'Troll' },]} />
