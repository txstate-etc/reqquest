<script lang="ts">
  import type { VaccineReviewData } from './types.js'
  export let data: VaccineReviewData
</script>

Distemper vaccination is {!data.distemper.satisfactory ? 'un' : ''}satisfactory.<br>
Rabies vaccination is {!data.rabies.satisfactory ? 'un' : ''}satisfactory.<br>
Feline leukemia vaccination is {!data.felineLeukemia.satisfactory ? 'un' : ''} satisfactory.<br>
Feline HIV vaccination is {!data.felineHIV.satisfactory ? 'un' : ''} satisfactory.
