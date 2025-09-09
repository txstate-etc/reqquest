<script lang="ts">
  import { FieldNumber, FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { YardData } from './types.js'

  export let data: YardData
</script>

<FieldRadio boolean path="haveYard" legendText="Do you have a yard?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldNumber path="squareFootage" labelText="Square Footage" conditional={!!data.haveYard} helperText="Estimate your yard size in square feet."/>
<FieldNumber path="totalPets" labelText="Total Pets" conditional={!!data.haveYard} helperText="How many pets will be sharing this yard after the adoption?" />
