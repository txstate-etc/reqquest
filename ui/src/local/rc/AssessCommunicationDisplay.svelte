<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { AssessCommunication } from "./types"

  export let data: AssessCommunication
</script>
<p class="text-xs">Is the applicant’s communication clear and structured?</p>
<p>{booleanToWord(data?.demonstrateCommunication)}</p>
{#if data.comments}
  <p class="text-xs">Comments:</p>
  <p>{data.comments}</p>
{/if}


