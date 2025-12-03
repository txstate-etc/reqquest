<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Ever surrendered a dog: { !!data.surrendered ? 'Yes': 'No' }</p>
{#if (!!data.surrendered) }
   Details: { data.details }<br/>
{/if}

