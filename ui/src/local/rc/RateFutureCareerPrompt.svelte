<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { RateFutureCareer } from './types'
  export let gatheredConfigData
  export let data: Partial<RateFutureCareer>
</script>

<FieldRadio 
  path='scoreInterestInCareer'
  items={[
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Neutral', label: 'Neutral' },
    { value: 'Poor', label: 'Poor' },
    { value: 'Unacceptable', label: 'Unacceptable' },
  ]}
/>
