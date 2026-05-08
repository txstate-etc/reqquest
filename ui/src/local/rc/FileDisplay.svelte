<script lang="ts">
  import { PUBLIC_API_BASE } from "$env/static/public"
  import { toasts } from "@txstate-mws/svelte-components"
  import { Button, Modal } from 'carbon-components-svelte'
  const token = sessionStorage.getItem('token')
  
  export let appRequestId: string  
  export let promptKey: string
  export let promptIdFileChecksum: string
  export let title: string
  export let mime: string

  let objURL: string | undefined
  let modalOpen = false

  
  async function displayIdFile(): Promise<void> {
    if (objURL) {
      modalOpen = true
      return
    }

    try {
      const ep = `${PUBLIC_API_BASE}/download/${appRequestId}/${promptKey}/${promptIdFileChecksum}`
      const res = await fetch(ep, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!res.ok) {
        toasts.add({
          message: `${res.status} - ${res.statusText}`,
          type: 'error'
        })
        return
      }

      const imgBlob: Blob = await res.blob()
      objURL = URL.createObjectURL(imgBlob);
      console.log(objURL)
      modalOpen = true
    }
    catch (err) {
      console.log(err)
      toasts.add({
        message: 'Not found',
        type: 'error'
      })
    }
  }

</script>

<Button on:click={displayIdFile}>Display file</Button>


<Modal
  passiveModal
  bind:open={modalOpen}
  modalHeading={title}
  primaryButtonText="Close"
  on:close={() => { modalOpen = false }}
>
  {#if mime.includes('pdf')}
  <iframe title="pdf" src={objURL} style='height: 1250px; width: 100%'></iframe>
  {:else}
  <img src={objURL} alt="Identifying file" />
  {/if}
</Modal>
