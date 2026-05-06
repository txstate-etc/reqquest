<script lang="ts">
  import type { InvestigatedFutureCareer } from "./types"

  export let data: InvestigatedFutureCareer
</script>
<p class="text-xs">What interests you most about operations as a career? </p>
<p>{data?.interestInCareer}</p>


