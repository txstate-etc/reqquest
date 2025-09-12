<script lang="ts">
  import { FieldHidden, FieldSelect } from '@txstate-mws/carbon-svelte'
  import type { StateData } from './types'

  export let fetched: { stateList: { value: string, label: string }[] }
  export let data: Partial<StateData>
  $: stateName = fetched.stateList.find(s => s.value === data.state)?.label
</script>

<FieldSelect path="state" labelText="State" required items={fetched.stateList} />
<FieldHidden path="stateName" value={stateName} />
