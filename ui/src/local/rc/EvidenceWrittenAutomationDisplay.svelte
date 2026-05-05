<script lang="ts">
  import type { EvidenceWrittenAutomation } from "./types"

  export let data: EvidenceWrittenAutomation
</script>
<p>{data?.appropriateAutomation}</p>
<p>{data?.comments}</p>

