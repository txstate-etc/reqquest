<script lang="ts">
  import { FieldMultiselect } from '@txstate-mws/carbon-svelte'
  export let fetched
  $: stateNameComboMenuItems = fetched.states
</script>
<FieldMultiselect path="residentOfState" labelText="Select States" placeholder="Choose states" required items={stateNameComboMenuItems} />

