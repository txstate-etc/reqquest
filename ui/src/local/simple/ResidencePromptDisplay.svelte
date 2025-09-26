<script lang="ts">
  import { FieldTextInput, Form } from '@txstate-mws/carbon-svelte'
  import type { StateResidencePromptData } from './types.js'
  export let data: Partial<StateResidencePromptData>
  export let configData
  // $: resultText = `Resident homeowner of ${configData.state_residence_req.residentOfState}`  
</script>
{#if data.residentOfRequiredState}
   <p>Resident of ##configData is { configData ? '' : 'NOT ' } available to display state##</p><!-- Config data does not seem to be available for display prompt {resultText}. -->
   <br>
    <label for="firstName" style="font-weight:bold;">Firstname</label><br>
    <input type="text" id="firstName" value={data.firstName} disabled /><br><br>
    <label for="lastName" style="font-weight:bold;">Lastname</label><br>
    <input type="text" id="lastName" value={data.lastName} disabled /><br><br>
    <label for="streetAddress" style="font-weight:bold;">Street address</label><br>
    <input type="text" id="streetAddress" value={data.streetAddress} disabled /><br><br>
    <label for="city" style="font-weight:bold;">City</label><br>
    <input type="text" id="city" value={data.city} disabled /><br><br>
    <label for="zipCode" style="font-weight:bold;">ZipCode</label><br>
    <input type="text" id="zipCode" value={data.zipCode} disabled /><br><br>
{:else}
  <p>Non resident.</p>
{/if}
