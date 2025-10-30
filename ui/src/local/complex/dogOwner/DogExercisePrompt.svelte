<script lang="ts">
  import { FieldRadio, FieldCheckbox, FieldSelect, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
  export let relatedConfigData
  $: agreeToExerciseLegendText = `Do you commit to exercising at least ` // ${relatedConfigData.dog_exercise_qual_req.minExerciseHoursWeekly} hours`
  console.log(JSON.stringify($$props))
</script>

<FieldRadio boolean path="agreeToExercise" legendText={agreeToExerciseLegendText} items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextInput path="details" labelText="Please provide more details on why you can't exercise a dog?" conditional={ data.agreeToExercise === false } />


