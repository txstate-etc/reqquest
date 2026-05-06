<script lang="ts">
  import type { SupportCommunication } from "./types"

  export let data: SupportCommunication
</script>
<p class="text-xs">A faculty member is unable to access a critical application right before a class begins. They are frustrated and using highly technical jargon incorrectly. How do you respond to de-escalate the situation and begin gathering the information you need to help them?</p>
<p>{data?.describeSupportCommunication}</p>


