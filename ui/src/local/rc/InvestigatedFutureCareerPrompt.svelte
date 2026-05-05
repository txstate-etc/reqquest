<script lang="ts">
  import { FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { InvestigatedFutureCareer } from './types'
  export let gatheredConfigData
  export let data: Partial<InvestigatedFutureCareer>
</script>

<FieldTextArea path='interestInCareer' labelText='What interests you most about operations as a career?' />
