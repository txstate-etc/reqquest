<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Previous pet owner: { !!data.previousPetOwner ? 'Yes': 'No' }</p><br/>
{#if (!!data.previousPetOwner) }
  Previous pet owner: <b>Yes</b>
  Previous pets owned: { data.previousPetCount }
  {#if (!!data.currentPetOwner) }
    Current pet owner: <b>Yes</b>
    Current pets owned: { data.currentPetCount }
    Current pet details: { data.currentPetDetails }
  {/if}
{/if}

