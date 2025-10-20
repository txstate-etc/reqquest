<script lang="ts">
  import { FieldSelect, FieldTextInput, FieldUpload } from '@txstate-mws/carbon-svelte'
  const stateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  $: stateNameMenuItems = stateNames.map(name => ({value: name, label: name}))
  import type { StateResidencePromptData } from './types.js'  
</script>
<FieldTextInput path="firstName" labelText="* Firstname" />
<FieldTextInput path="lastName" labelText="* Lastname" />
<FieldTextInput path="phoneNumber" labelText="Phone Number" />
<FieldTextInput path="emailAddress" labelText="Email address" />
<FieldTextInput path="streetAddress" labelText="* Street Address" />
<FieldTextInput path="city" labelText="* City" />
<FieldSelect path="state" labelText="* State" items={stateNameMenuItems} />
<FieldTextInput path="zipCode" labelText="* Zipcode" />
<FieldUpload path="residentIdDoc" labelText="Residence identification document" />


