<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Currently have dog(s): { !!data.owned ? 'Yes': 'No' }</p>
{#if (!!data.owned) }
   Count: { data.count }<br />
   Details: { data.details }<br/>
{/if}

