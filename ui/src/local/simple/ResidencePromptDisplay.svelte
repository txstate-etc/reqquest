<script lang="ts">
  import { toasts } from '@txstate-mws/svelte-components';
  import { PUBLIC_API_BASE } from '$env/static/public';
  import { Button, Modal, ToastNotification } from 'carbon-components-svelte'
  import type { StateResidencePromptData } from './types.js'
  export let data: Partial<StateResidencePromptData>
  export let gatheredConfigData
  export let appRequestId
  const prompt_key = 'state_residence_prompt'
  const promptIdFileChecksum = 'residentIdDoc/shasum'
  const token = sessionStorage.getItem('token')
  let objURL: string | null = null
  let displayIdFileErr: string | null
  let modalOpen = false
  $: residentOfState = (gatheredConfigData?.state_residence_req) ? `${gatheredConfigData.state_residence_req.residentOfState}` : 'NO state_residence_req related'
  async function displayIdFile(): Promise<boolean> {
    if (objURL) { // id file already downloaded
      displayIdFileErr = null
      return true
    }
    try {
      const ep = `${PUBLIC_API_BASE}/download/${appRequestId}/${prompt_key}/${promptIdFileChecksum}`
      const res = await fetch(ep, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      const imgBlob: Blob = await res.blob()
      objURL = URL.createObjectURL(imgBlob);
    }
    catch (err) {
      displayIdFileErr = err
      return false
    }
    displayIdFileErr = null
    return true
  }
</script>
{#if data.residentOfRequiredState}
   <p>Resident of {residentOfState} </p><!-- Config data does not seem to be available for display prompt {resultText}. -->
   <br>
   <p>
      <b>
        {data.firstName} {data.lastName} <br/>
        {data.streetAddress} <br/>
        {data.city}, {residentOfState} {data.zipCode}
      </b>
   </p>
   <br/>
   <p>
      <Button on:click={async () => modalOpen = await displayIdFile()}>Display Id file</Button>
   </p>
{:else}
  <p>Not a resident of {residentOfState}.</p>
{/if}

<Modal
  bind:open={modalOpen}
  modalHeading="Applicant identifying document"
  primaryButtonText="Close"
  on:click:button--primary={() => { modalOpen = false }}
  on:open
>
   <img src={objURL} alt="Identifying file" />
</Modal>


{#if !objURL && displayIdFileErr}
  <ToastNotification
    title="Error"
    subtitle={displayIdFileErr}
    timeout={5000}  />
{/if}
