<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Date service completed: { data.serviceDate }</p>
<p>Details: { data.details }</p>
