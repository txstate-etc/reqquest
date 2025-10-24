<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Ever owned a dog: { !!data.owned ? 'Yes': 'No' }</p><br/>
{#if (!!data.owned) }
   Details: { data.details }<br/>
{/if}

