<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let appRequest
  export let configData
  $: approveQuestion = configData.text
  $: hasAnException = appRequest?.review_applicant_dog_info_prompt?.exerciseException === true
</script>
<FieldRadio boolean path="approve" legendText={approveQuestion} conditional={hasAnException} items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
{#if !hasAnException}
  <p>Exercise exemption was <b>not</b> issued.</p>
{/if}
