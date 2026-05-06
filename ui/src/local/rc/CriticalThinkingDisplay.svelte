<script lang="ts">
  import type { CriticalThinking } from "./types"

  export let data: CriticalThinking
</script>
<p class="text-sm">What is one website or app you use for school that frustrates you? If you were the developer, what one feature would you add or change to make it easier for students to use?</p>
<p>{data?.criticalThinkingAnswer}</p>

