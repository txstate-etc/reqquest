<script lang="ts">
  import { FieldCheckbox, FieldNumber } from '@txstate-mws/carbon-svelte'
  import type { YardData } from './types.js'

  export let data: YardData
</script>

<FieldCheckbox path="haveYard" labelText="Do you have a yard?" />

<FieldNumber path="squareFootage" labelText="Square Footage" conditional={data.haveYard} helperText="Estimate your yard size in square feet."/>
<FieldNumber path="totalPets" labelText="Total Pets" conditional={data.haveYard} helperText="How many pets will be sharing this yard after the adoption?" />
