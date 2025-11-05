<script lang="ts">
  import { FieldHidden, FieldSelect } from '@txstate-mws/carbon-svelte'
  import type { StateData } from './types'

  export let fetched: { stateList: { value: string, label: string }[] }
  export let data: Partial<StateData>
  $: stateList = fetched.stateList
  $: stateName = stateList.find(s => s.value === data.state)?.label
</script>

<FieldSelect path="state" labelText="State" required items={stateList} />
{#if (stateName != null)}
  <FieldHidden path="stateName" value={stateName} />
{/if}

