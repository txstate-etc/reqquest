<script lang="ts">
  import type { StateResidencePromptReviewData } from './types.js'
  export let data: StateResidencePromptReviewData
  export let gatheredConfigData
  $: stateText = (gatheredConfigData?.state_residence_req?.residentOfState) ? gatheredConfigData.state_residence_req.residentOfState : '...Who knows(shrug) Need applicant req config data'
</script>

Applicant is {!data.residentOfRequiredState ? ' NOT ' : ''} a resident of {`${stateText}`}.<br>
Applicant's home is {!data.residenceIsHome ? ' NOT ' : ''} withing the state of {`${stateText}`}.<br>
