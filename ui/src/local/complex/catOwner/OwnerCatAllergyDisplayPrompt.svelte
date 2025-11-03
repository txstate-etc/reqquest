<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Owner has cat allergies: { data?.allergic ? 'Yes' : 'No' }</p><br/>



