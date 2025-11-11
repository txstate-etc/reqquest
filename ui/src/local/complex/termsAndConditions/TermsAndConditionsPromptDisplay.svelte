<script lang="ts">
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  export let data
</script>
<p>Applicant agreed to Terms and Conditions: { data?.agree ? 'Yes' : 'No' }</p><br/>


