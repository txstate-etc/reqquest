<script lang="ts">
  import type { TechnicalTroubleshooting } from "./types"

  export let data: TechnicalTroubleshooting
</script>
<p class="text-xs">Describe a time you encountered a technical "bug" or system error (at school, work, or home). What steps did you take to investigate the issue, and how did you eventually resolve it?</p>
<p>{data?.describeTechincalTroubleshooting}</p>


