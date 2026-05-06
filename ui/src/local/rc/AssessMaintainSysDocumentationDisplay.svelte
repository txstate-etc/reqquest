<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { AssessMaintainSysDocumentation } from "./types"

  export let data: AssessMaintainSysDocumentation
</script>
<p class="text-xs">Is the documentation clear enough that a new team member could follow it without additional help?</p>
<p>{booleanToWord(data?.clarity)}</p>
<p class="text-xs">Comments</p>
<p>{data?.comments}</p>

