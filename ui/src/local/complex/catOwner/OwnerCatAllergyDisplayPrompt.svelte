<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Owner has cat allergies: { data?.allergic ? 'Yes' : 'No' }</p>
{#if (!!data.allergic) }
   Details: { data.details }<br/>
{/if}


