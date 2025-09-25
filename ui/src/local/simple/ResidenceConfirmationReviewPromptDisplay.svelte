<script lang="ts">
  import type { StateResidencePromptReviewData } from './types.js'
  export let data: StateResidencePromptReviewData
  export let fetched: { residentOfState:  string }
  $: stateText = `${fetched.residentOfState}?`  
</script>

Applicant is {!data.residentOfRequiredState ? ' NOT ' : ''} a resident of {`${stateText}`}.<br>
Applicant's home is {!data.residenceIsHome ? ' NOT ' : ''} withing the state of {`${stateText}`}.<br>