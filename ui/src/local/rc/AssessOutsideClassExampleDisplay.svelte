<script lang="ts">
  import type { AssessOutsideClassExample } from "./types"

  export let data: AssessOutsideClassExample
</script>
<p class="text-xs">Does the applicant show interest in building or creating technical solutions?</p>
<p>{data?.showCriticalThinking}</p>
<p class="text-xs">Explaination</p>
<p>{data?.explaination}</p>

