<script lang="ts">
  import { booleanToWord } from "$internal"
  export let appRequestId: string
  export let data: any
</script>

Opted Out: {booleanToWord(data?.optOut)}
