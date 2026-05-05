<script lang="ts">
  import { FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { TechnicalTroubleshooting } from './types.js'
  export let gatheredConfigData
  export let data: Partial<TechnicalTroubleshooting>
</script>

<FieldTextArea path='describeTechincalTroubleshooting' labelText='Describe a time you encountered a technical "bug" or system error (at school, work, or home). What steps did you take to investigate the issue, and how did you eventually resolve it?' />
