<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { AssessCriticalThinking } from "./types"

  export let data: AssessCriticalThinking
</script>
<p class="text-xs">Is the issue real?</p>
<p>{booleanToWord(data?.realIssue)}</p>
<p class="text-xs">Is the proposed feature/change technologically feasible? /p>
<p>{booleanToWord(data?.feasable)}</p>

