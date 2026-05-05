<script lang="ts">
  import { FieldUpload } from '@txstate-mws/carbon-svelte'
  import type { ReccomendationLetter } from './types.js'
  export let gatheredConfigData
  export let data: Partial<ReccomendationLetter>
</script>

<FieldUpload path='reccomendationLetter' labelText='Provide a recommendation letter from a TXST faculty member that you have either participated in their course or worked with.' />
