<script lang="ts">
  import type { HelpDeskCustomerService } from "./types"

  export let data: HelpDeskCustomerService
</script>
<p class="text-xs">Describe a time you helped someone solve a technical problem.</p>
<p>{data?.describeCustomerService}</p>
