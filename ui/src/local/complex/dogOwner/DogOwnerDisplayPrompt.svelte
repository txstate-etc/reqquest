<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Ever owned a dog: { !!data.everOwnedADog ? 'Yes': 'No' }</p><br/>
{#if (!!data.everOwnedADog) }
   Details: { data.details }<br/>
{/if}

