<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { AssessOrganization } from "./types"

  export let data: AssessOrganization
</script>
<p class="text-xs">Does the applicant demonstrate organization and task management?</p>
<p>{booleanToWord(data?.demonstrateOrganization)}</p>

