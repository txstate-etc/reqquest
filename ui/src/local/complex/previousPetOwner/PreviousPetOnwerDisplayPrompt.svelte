<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Previous pet owner: {!!data.previousPets?.owned ? 'Yes': 'No'}</p><br/>
{#if (!!data.previousPets?.owned) }
  Previous pet owner: <b>Yes</b>
  Previous pets owned: {data.previousPets.count}
  {#if (!!data.currentPets?.owned) }
    Current pet owner: <b>Yes</b>
    Current pets owned: {data.currentPets.count}
  {/if}
{/if}

