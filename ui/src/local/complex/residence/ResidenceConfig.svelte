<script lang="ts">
  import { FieldMultiselect } from '@txstate-mws/carbon-svelte'
  // using below until fetch exist for requirement config
  const stateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  export let data
  export let fetched
  //console.log(`Fetched is ${JSON.stringify(fetched)}`)
  $: stateNameComboMenuItems = stateNames.map(name => ({value: name, label: name}))
  console.log(`Data is ${JSON.stringify(data)}`)
  console.log(`Fetched is ${JSON.stringify(fetched)}`)
</script>
<p>{JSON.stringify($$props)}</p>
<FieldMultiselect path="residentOfState" labelText="Select States" placeholder="Choose states" required items={stateNameComboMenuItems} />

