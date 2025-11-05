<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
  export let relatedConfigData
  $: minAgeConfigData = relatedConfigData.minAge ?? 'Related config data is not working'
</script>
<p>Currently have kid(s) under {minAgeConfigData}:  { !!data.underMinAge ? 'Yes': 'No' }</p><br/>
{#if (!!data.underMinAge) }
   Count: { data.count }<br />
   Details: { data.details }<br/>
{/if}

