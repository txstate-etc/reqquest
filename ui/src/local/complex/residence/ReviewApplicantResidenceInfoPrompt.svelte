<script lang="ts">
  import { FieldRadio, FieldTextArea, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
  export let invalidated
  data.residencyInfoAcceptable = (invalidated) ? undefined : data.residencyInfoAcceptable
  data.lastReviewedAt = (invalidated) ? Date.now() : data.lastReviewedAt 
</script>

<FieldRadio boolean path="residencyInfoAcceptable" labelText="Does the ID file match applicant input?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }    
  ]
} />

<span class="hidden">
  <FieldNumber
      path="lastReviewedAt"
      defaultValue={Date.now()}
    />
</span>

<FieldTextArea path="corrections" conditional={ data.residencyInfoAcceptable === false } labelText="Identify inaccuracies between ID file and applicant input" />
