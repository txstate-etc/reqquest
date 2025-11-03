<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Owner agrees to microchip cat: { data?.agreeToPay ? 'Yes' : 'No' }</p><br/>
{#if (!data.agreeToPay) }
   Details: { data.details }<br/>
{/if}


