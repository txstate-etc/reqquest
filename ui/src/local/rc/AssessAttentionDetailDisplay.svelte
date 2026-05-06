<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { AssessAttentionDetail } from "./types"

  export let data: AssessAttentionDetail
</script>
<p class="text-xs">Does the applicant follow instructions?</p>
<p>{booleanToWord(data?.demonstrateAttentionDetail)}</p>
<p class="text-xs">Do their materials have frequent spelling or grammar errors?</p>
<p>{booleanToWord(data?.grammarErrors)}</p>

