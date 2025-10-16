<script lang="ts">
  import { FieldRadio, FieldTextInput, FieldUpload } from '@txstate-mws/carbon-svelte'
  import type { StateResidencePromptData } from './types.js'
  export let relatedConfigData
  export let data: Partial<StateResidencePromptData>
  $: legendText = `Are you a resident of ${relatedConfigData.state_residence_req.residentOfState}?`  
</script>
<FieldRadio boolean path="residentOfRequiredState" legendText="{legendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
{#if !!data.residentOfRequiredState}
  <FieldTextInput path="firstName" labelText="* Firstname" />
  <FieldTextInput path="lastName" labelText="* Lastname" />
  <FieldTextInput path="phoneNumber" labelText="Phone Number" />
  <FieldTextInput path="emailAddress" labelText="Email address" />
  <FieldTextInput path="streetAddress" labelText="* Street Address" />
  <FieldTextInput path="city" labelText="* City" />
  <FieldTextInput path="zipCode" labelText="* Zipcode" />
  <FieldUpload path="residentIdDoc" labelText="Residence identification document" />
{/if}

