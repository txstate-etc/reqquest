<script lang="ts">
  import { toasts } from '@txstate-mws/svelte-components'
  import { Loading } from "carbon-components-svelte"
  import { Button, Select, SelectItem } from 'carbon-components-svelte'
  import { InfoCard } from '$lib'
  import { phaseChangeMutations, type PhaseChangeMutations } from '$lib'
  import { invalidateAll } from '$app/navigation'
  import { api, type BasicRequestData } from '$internal/api'
  import type { PageData } from '../../routes/requests/[id]/approve/[programKey]/$types'
  import { uiRegistry } from '../../local'
  
  export let application: PageData['appRequest']['applications'][0]
  export let basicRequestData: BasicRequestData
  export let requestId: string

  $: loading = false

  const translateMutations = {
    submitAppRequest: 'submitted request for review.',
    returnToApplicant: 'returned request to applicant',
    completeReview: 'completed request review',
    returnToReview: 'returned request to review',
    acceptOffer: 'accepted offer',
    returnToOffer: 'returned request to applicant to accept offer',
    completeRequest: 'marked request as complete',
    returnToNonBlocking: 'returned request to non-blocking workflow tasks'
  }

  let appRequestAction: '' | PhaseChangeMutations | 'reopen' | 'close' = ''
  async function onAppRequestAction () {
    loading = true
    if ((phaseChangeMutations as readonly string[]).includes(appRequestAction)) {
      await appRequestPhaseChange(appRequestAction as PhaseChangeMutations)
    } else if (appRequestAction === 'close') {
      await closeRequest()
    } else if (appRequestAction === 'reopen') {
      await reopenRequest()
    }
    appRequestAction = ''
    loading = false
  }

  async function appRequestPhaseChange (action: PhaseChangeMutations) {
    const response = await api.appRequestPhaseChange(requestId, action)
    await invalidateAll()
    loading = false
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Action Failed',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: `Successfully ${translateMutations[action]}.`
      })
    }
    await invalidateAll()
  }

  async function closeRequest () {
    const response = await api.closeAppRequest(requestId)
    await invalidateAll()
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: `Could not close ${uiRegistry.getWord('appRequest').toLowerCase()}`,
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: `${uiRegistry.getWord('appRequest')} closed.`
      })
    }
    
  }

  async function reopenRequest () {
    const response = await api.reopenAppRequest(requestId)
    await invalidateAll()
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: `Could not reopen ${uiRegistry.getWord('appRequest').toLowerCase()}`,
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: `${uiRegistry.getWord('appRequest')} reopened.`
      })
    }
  }

  let appAction: '' | 'advanceWorkflow' | 'reverseWorkflow' = ''
  async function onAppAction () {
    if (appAction === 'advanceWorkflow') {
      await advanceWorkflow()
    } else if (appAction === 'reverseWorkflow') {
      await reverseWorkflow()
    }
  }

  async function advanceWorkflow () {
    loading = true
    const response = await api.advanceWorkflow(application.id)     
    await invalidateAll()    
    loading = false   
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Could not advance application',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: 'Application advanced.'
      })
    }    
  }

  async function reverseWorkflow () {
    loading = true
    const response = await api.reverseWorkflow(application.id)     
    await invalidateAll()    
    loading = false   
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Could not reverse application workflow',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: 'Application workflow reversed.'
      })
    }
  }
</script>

{#if loading}  
    <Loading />    
{/if}

<InfoCard title='Reviewer Actions'>
  <div class="flow">
    <Select bind:selected={appAction} labelText="Next step" size="sm">
      <SelectItem value="" text="Choose one" />
      <SelectItem disabled={!application.actions.advanceWorkflow} value="advanceWorkflow" text={'Send to ' + (application.nextWorkflowStage?.title ?? (!application.workflowStage?.blocking ? 'Complete' : 'Review Complete'))} />
      <SelectItem disabled={!application.actions.reverseWorkflow} value="reverseWorkflow" text={'Return to ' + (application.previousWorkflowStage?.title ?? 'Review')} />
    </Select>
    <Button disabled={!appAction} on:click={onAppAction} size="small" class="[ w-full ]">Update program</Button>

    {#if basicRequestData}
      <Select bind:selected={appRequestAction} labelText={`${uiRegistry.getWord('appRequest')} action`} size="sm">
        <SelectItem value="" text="Choose one" />
          <SelectItem disabled={!basicRequestData.actions.completeReview} value="completeReview" text="Complete Review" />
          <SelectItem disabled={!basicRequestData.actions.completeRequest} value="completeRequest" text="Complete Request" />
          <SelectItem disabled={!basicRequestData.actions.reopen} value="reopen" text="Reopen Request" />
          <SelectItem disabled={!basicRequestData.actions.close} value="close" text="Close Request" />
          <SelectItem disabled={!basicRequestData.actions.returnToApplicant} value="returnToApplicant" text="Return To Applicant" />
          <SelectItem disabled={!basicRequestData.actions.returnToOffer} value="returnToOffer" text="Return To Offer" />
          <SelectItem disabled={!basicRequestData.actions.returnToReview} value="returnToReview" text="Return To Review" />
          <SelectItem disabled={!basicRequestData.actions.returnToNonBlocking} value="returnToNonBlocking" text="Return To Final Workflow Tasks" />
          <SelectItem disabled={!basicRequestData.actions.submit} value="submitAppRequest" text="Submit On Behalf Of Applicant" />
          <SelectItem disabled={!basicRequestData.actions.acceptOffer} value="acceptOffer" text="Accept Offer On Behalf Of Applicant" />
      </Select>
      <Button disabled={!appRequestAction} on:click={onAppRequestAction} size="small" class="[ w-full ]">Update application</Button>
    {/if}
  </div>
</InfoCard>