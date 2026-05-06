<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { AssessTechnicalTroubleshooting } from "./types"

  export let data: AssessTechnicalTroubleshooting
</script>
<p class="text-xs">Did the applicant demonstrate a structured methodology for troubleshooting?</p>
<p>{booleanToWord(data?.demonstrateTechincalTroubleshooting)}</p>
<p class="text-xs">Complexity rating (1-5)</p>
<p>{data?.complexity}</p>

