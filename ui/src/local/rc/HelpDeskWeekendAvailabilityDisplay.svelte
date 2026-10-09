<script lang="ts">
  import { booleanToWord } from "$internal"
  import type { HelpDeskWeekendAvailability } from "./types"

  export let data: HelpDeskWeekendAvailability
</script>
<p class="text-xs">Can you work at least one weekend shift per month?</p>
<p>{booleanToWord(data?.weekendAvailable)}</p>
