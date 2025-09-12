<script lang="ts">
  import { FieldCheckbox, FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { CatTowerData } from './types.js'

  export let data: CatTowerData
</script>

<FieldRadio boolean path="haveCatTower" legendText="Do you have a cat tower in your house?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldCheckbox boolean path="willPurchaseCatTower" labelText="I agree to purchase a cat tower upon adoption." conditional={data.haveCatTower === false} />
