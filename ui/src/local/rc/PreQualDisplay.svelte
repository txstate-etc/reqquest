<script lang="ts">
    import { booleanToWord } from "$internal"
  import type { RCPreQual } from "./types"

  export let data: RCPreQual
</script>
<p>Aknowledged expectaitions: {booleanToWord(data.acknowledgeExpectations)}</p>
<p>Availabile: {booleanToWord(data.availability)}</p>
<p>GPA: {data?.gpa}</p>


