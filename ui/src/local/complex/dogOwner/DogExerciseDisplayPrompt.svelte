<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
  export let gatheredConfigData
  $: minExerciseHours = gatheredConfigData.dog_exercise_qual_req.minExerciseHoursWeekly
</script>
<p>Agreed to exercise dog at least {minExerciseHours} hours: { !!data.agreeToExercise ? 'Yes': 'No' }</p><br/>
{#if (!data.agreeToExercise) }
   Details: { data.details }<br/>
{/if}
