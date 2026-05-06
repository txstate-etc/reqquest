<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { EvidenceWrittenAutomation } from "./types"

  export let data: EvidenceWrittenAutomation
</script>
<p class="text-xs">Did the applicant select an appropriate task(s) for automation?</p>
<p>{booleanToWord(data?.appropriateAutomation)}</p>
<p class="text-xs">Comments</p>
<p>{data?.comments}</p>

