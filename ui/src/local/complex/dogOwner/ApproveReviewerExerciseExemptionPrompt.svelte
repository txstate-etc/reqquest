<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let appRequest
  export let configData
  $: approveQuestion = configData.text
  console.log(`AppRequest data: ${JSON.stringify(appRequest)}`) // TODO:  Check app request data return
</script>
{#if (appRequest?.review_applicant_dog_info_prompt?.exerciseException === true)}
  <FieldRadio boolean path="approve" legendText={approveQuestion} items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
{:else}
  <p>Exercise exemption was <b>not</b> issued</p>
{/if}
