<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Previous pet owner: { !!data.previousPetOwner ? 'Yes': 'No' }</p><br/>
{#if (!!data.previousPetOwner) }
  Previous pet owner: <b>Yes</b><br/>
  Previous pets owned: { data.previousPetCount }<br/>
  {#if (!!data.currentPetOwner) }
    Current pet owner: <b>Yes</b><br/>
    Current pets owned: { data.currentPetCount }<br/>
    Current pet details: { data.currentPetDetails }<br/>
  {/if}
{/if}

