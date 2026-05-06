<script lang="ts">
  import type { AssessDataRelatedPuzzle } from "./types"

  export let data: AssessDataRelatedPuzzle
</script>
<p class="text-xs">Score</p>
<p>{data?.score}</p>
<p class="text-xs">Explaination</p>
<p>{data?.explaination}</p>

