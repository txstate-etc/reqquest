<script lang="ts">
  import type { Communication } from "./types"

  export let data: Communication
</script>
<p class="text-xs">You are leading a group project. One teammate is doing all the work, and another hasn't responded to texts in three days. How do you handle this scenario?</p>
<p>{data?.describeCommunication}</p>

