<script lang="ts">
  import { booleanToWord } from "$internal"
  export let preloadData
  export let data
</script>
<p class="text-xs">Did the applicant demonstrate a structured methodology for troubleshooting?</p>
<p>{booleanToWord(data?.demonstrateTechincalTroubleshooting ?? preloadData?.demonstrateTechincalTroubleshooting)}</p>
<p class="text-xs">Complexity rating (1-5)</p>
<p>{data?.complexity ?? preloadData?.complexity}</p>

