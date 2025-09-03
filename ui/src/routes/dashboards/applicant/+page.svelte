<script lang="ts">
  import { goto, invalidate } from '$app/navigation'
  import { base } from '$app/paths'
  import { api } from '$lib'
  import { ApplicationDetailsView, AppRequestCard, type ApplicationDetailsData, type DashboardAppRequest } from '$lib/components'
  import { getPeriodDisplayInfo, getStatusActionType, getSubmitButtonText } from '$lib/status-utils.js'
  import { CardGrid, FieldMultiselect, FieldSelect, FilterUI, PanelDialog, PanelFormDialog, Toasts } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button, InlineNotification, Modal } from 'carbon-components-svelte'
  import { Close, DocumentExport, Download, Reset, Warning } from 'carbon-icons-svelte'
  import { uiRegistry } from '../../../local/index.js'
  import type { PageData } from './$types'

  interface FilterState {
    tab?: 'recent_applications' | 'past_applications'
    search?: string
    yearSubmitted?: string[]
  }

  export let data: PageData

  $: ({ appRequests, availableYears, access, openPeriods } = data)

  let dialog = false
  let sidePanelOpen = false
  let selectedApplication: DashboardAppRequest | null = null
  let loading = false
  let applicationDetails: ApplicationDetailsData | null = null
  let cancelConfirmation: { open: boolean, requestId: string | null } = { open: false, requestId: null }
  let filterDataSearch: FilterState | undefined
  let lastInsertedId: string | undefined

  function showError (message: string) {
    toasts.add(message, 'error', 7000)
  }

  // ========================================
  // === Action Handler ===
  // ========================================

  async function handleApiAction (
    action: () => Promise<any>,
    errorMessage: string,
    successMessage?: string
  ) {
    try {
      const result = await action()
      if (result.success) {
        await invalidate('api:getApplicantRequests')
        if (successMessage) {
          toasts.add(successMessage, 'success', 5000)
        }
      } else {
        const error = result.messages?.find((m: any) => m.type === 'error')?.message
        showError(error ?? errorMessage)
      }
    } catch (error) {
      showError(errorMessage)
    }
  }

  // ========================================
  // === UI Card ActionSet ===
  // ========================================

  // TODO probably switch this to hide actions instead of disable, but it is nice to see them for now.
  // In general these actions are based off of the text info in https://www.figma.com/design/VXFWNXZ6UNlDxmGNwVoEuu/ReqQuest?node-id=954-101490&m=dev
  function buildCardActions (request: DashboardAppRequest) {
    return [
      {
        label: 'View Application',
        onClick: async () => await openSidePanel(request)
      },
      {
        label: 'Download Offer',
        onClick: async () => await downloadOffer(request.id),
        icon: Download,
        disabled: !request.actions.offer
      },
      {
        label: 'Appeal Decision',
        onClick: async () => await appealDecision(request.id),
        icon: Warning,
        disabled: !request.actions.return
      },
      {
        label: 'Export Application',
        onClick: async () => await exportApplication(request.id),
        icon: DocumentExport
      },
      {
        label: 'Withdraw Application',
        onClick: async () => await withdrawApplication(request.id),
        icon: Close,
        disabled: !request.actions.close
      },
      {
        label: 'Cancel Application',
        onClick: () => { cancelConfirmation = { open: true, requestId: request.id } },
        icon: Close,
        disabled: !request.actions.cancel
      },
      {
        label: 'Reinstate Application',
        onClick: async () => await reinstateApplication(request.id),
        icon: Reset,
        disabled: !request.actions.reopen
      }
    ]
  }

  // ========================================
  // === App actions ===
  // ========================================
  const appealDecision = async (requestId: string) =>
    await handleApiAction(
      async () => await api.returnAppRequest(requestId),
      'Failed to appeal decision',
      'Appeal submitted successfully'
    )

  const withdrawApplication = async (requestId: string) =>
    await handleApiAction(
      async () => await api.cancelAppRequest(requestId),
      'Failed to withdraw application',
      'Application withdrawn successfully'
    )

  const reinstateApplication = async (requestId: string) =>
    await handleApiAction(
      async () => await api.reopenAppRequest(requestId),
      'Failed to reinstate application',
      'Application reinstated successfully'
    )

  async function downloadOffer (requestId: string) {
    // TODO: Implement actual download logic
    console.log('Download offer for', requestId)
  }

  async function exportApplication (requestId: string) {
    await goto(`${base}/requests/${requestId}/export`)
  }

  // ========================================
  // === Panel Dialog Management ===
  // ========================================

  async function openSidePanel (appRequest: DashboardAppRequest) {
    selectedApplication = appRequest
    sidePanelOpen = true
    loading = true

    try {
      // Fetch all application details in one go
      const [details, appData] = await Promise.all([
        api.getApplyNavigation(appRequest.id),
        api.getAppRequestData(appRequest.id)
      ])

      if (details.appRequest) {
        applicationDetails = {
          ...details.appRequest,
          data: appData,
          prequalPrompts: details.prequalPrompts,
          postqualPrompts: details.postqualPrompts,
          applications: details.appRequest.applications as ApplicationDetailsData['applications']
        }
      }
    } catch (error) {
      showError('Failed to load application details')
      console.error('Error loading application details:', error)
    } finally {
      loading = false
    }
  }

  function closeSidePanel () {
    sidePanelOpen = false
    selectedApplication = null
    applicationDetails = null
  }

  async function handleCancelConfirm () {
    if (!cancelConfirmation.requestId) return

    await handleApiAction(
      async () => await api.cancelAppRequest(cancelConfirmation.requestId!),
      'Failed to cancel application',
      'Application cancelled successfully'
    )

    cancelConfirmation = { open: false, requestId: null }
  }

  // Handle submit action based on status action type, used for PanelDialog, specifically for the App View-only side panel
  async function handleSubmitAction () {
    if (!selectedApplication) return

    const { status, id } = selectedApplication
    const actionType = getStatusActionType(status)

    switch (actionType) {
    case 'navigate':
      await goto(`${base}/requests/${id}/apply`)
      break
    case 'export':
      await exportApplication(id)
      break
    case 'download':
      await downloadOffer(id)
      break
    case 'none':
      // No action for completed/final statuses
      break
    }
  }

  // ========================================
  // === Form Handlers ===
  // ========================================

  async function clickCreateAppRequest () {
    if (openPeriods.length === 1) {
      const { success } = await submitAppRequest({ periodId: openPeriods[0].id })
      if (success) await onSaved()
    } else {
      dialog = true
    }
  }

  function closeDialog () {
    dialog = false
  }

  async function onSaved () {
    closeDialog()
    toasts.add('Application created successfully', 'success', 5000)
    await goto(`${base}/requests/${lastInsertedId}/apply`)
  }

  async function validateAppRequest (data: { periodId: string }) {
    const response = await api.createAppRequest(data.periodId, access.user!.login, true)
    return response.messages
  }

  async function submitAppRequest (data: { periodId: string }) {
    const response = await api.createAppRequest(data.periodId, access.user!.login)
    if (response.success) lastInsertedId = response.id
    return {
      ...response,
      data
    }
  }

  // ========================================
  // === FilterUI Helper Functions ===
  // ========================================

  function getAvailableYears (years: number[]) {
    return years.map(year => ({ value: year.toString(), label: year.toString() }))
  }

  // Reactive statements for filter options
  $: yearOptions = getAvailableYears(availableYears)
  $: recentDays = uiRegistry.config.applicantDashboardRecentDays ?? 30
</script>

<div class="flow">
  <!-- Filter UI for recent/past applications -->
  <FilterUI
    search={filterDataSearch?.tab === 'past_applications'}
    tabs={[
      { label: 'Recent applications', value: 'recent_applications' },
      { label: 'Past applications', value: 'past_applications' }
    ]}
    on:apply={e => { filterDataSearch = e.detail }}
    on:mount={e => { filterDataSearch = e.detail }}>
    <svelte:fragment slot="quickfilters">
      {#if filterDataSearch?.tab === 'past_applications'}
        <FieldMultiselect path="yearSubmitted" label="Year Submitted" items={yearOptions} />
      {/if}
    </svelte:fragment>
  </FilterUI>

  {#if filterDataSearch?.tab !== 'past_applications'}
  <!-- TODO break this into component. Loooks like it will be used throughout app -->
    <section class="bg-gray-100 text-2xl p-4 flex">
      <div class="intro-text flow max-w-lg">
        <h2 class="intro-header">{uiRegistry.config.applicantDashboardIntroHeader}</h2>
        <p class="text-gray-600">{uiRegistry.config.applicantDashboardIntroDetail}</p>
      </div>
      <div class="period-controls ml-auto flex gap-6 items-center">
        {#if openPeriods.length > 0}
          <div class="max-h-48 overflow-y-auto flex flex-row gap-4">
            {#each openPeriods as period}
              {@const periodInfo = getPeriodDisplayInfo(period)}
                <section class="h-full flex items-center justify-center border-r-2 border-gray-300 pr-6 text-base text-center flex-col gap-2">
                  <h3 class="font-bold text-lg">{period.name}</h3>
                  <dl class="flex flex-col text-sm">
                    <dt class="font-bold">Application opens:</dt>
                    <dd>
                      <time datetime={periodInfo.openDateMachineFormat}>
                        {periodInfo.openLabel}
                      </time>
                    </dd>
                    <dt class="font-bold">Application closes:</dt>
                    <dd>
                      <time datetime={periodInfo.closeDateMachineFormat}>
                        {periodInfo.closeDate}
                      </time>
                    </dd>
                  </dl>
                </section>
            {/each}
          </div>
          {@const primaryPeriodInfo = getPeriodDisplayInfo(openPeriods[0])}
          <Button on:click={clickCreateAppRequest} disabled={!access.createAppRequestSelf || !primaryPeriodInfo.canStartNew}>
            {primaryPeriodInfo.canStartNew ? 'Start application' : 'Applications closed'}
          </Button>
        {:else}
          <p>No application periods are currently available.</p>
          <Button disabled={true}>Start New Application</Button>
        {/if}
      </div>
    </section>
  {/if}
  <!-- Application Cards -->
  {#if appRequests.length === 0}
    {#if filterDataSearch?.tab === 'past_applications'}
      <InlineNotification
        kind="info"
        title="No results found."
        subtitle="You may need to refine your searched terms, filters or try again."
        lowContrast
      />
    {:else}
      <InlineNotification
        kind="info"
        title="No recent applications found."
        subtitle="You have no applications created or modified in the last {recentDays} days. Check under Past applications tab."
        lowContrast
      />
    {/if}
  {:else}
    <CardGrid cardSize="500px">
      {#each appRequests as request}
        <AppRequestCard
          {request}
          actions={buildCardActions(request)}
          showAcceptanceButtons={true}
        />
      {/each}
    </CardGrid>
  {/if}

  <PanelFormDialog open={dialog} title="Create App Request" validate={validateAppRequest} submit={submitAppRequest} on:cancel={closeDialog} on:saved={onSaved}>
    <FieldSelect
      labelText="Period"
      path="periodId"
      items={openPeriods.map(p => ({ value: p.id, label: p.name }))}
      required
      helperText="Select the period in which you want to create an app request."
    />
  </PanelFormDialog>

  <!-- Inlined Application Details Panel -->
  <PanelDialog
    open={sidePanelOpen}
    title={selectedApplication?.period.name ?? 'Application Details'}
    cancelText="Close"
    submitText={selectedApplication?.status ? getSubmitButtonText(selectedApplication.status) : ''}
    on:cancel={closeSidePanel}
    on:submit={handleSubmitAction}>
    <ApplicationDetailsView
      selectedApplication={selectedApplication ?? undefined}
      applicationDetails={applicationDetails ?? undefined}
      {loading}
      {uiRegistry}
    />
  </PanelDialog>

  <Modal
    bind:open={cancelConfirmation.open}
    modalHeading="Cancel Application"
    primaryButtonText="Yes, Cancel Application"
    secondaryButtonText="Keep Application"
    on:click:button--secondary={() => { cancelConfirmation = { open: false, requestId: null } }}
    on:submit={handleCancelConfirm}
    on:close={() => { cancelConfirmation = { open: false, requestId: null } }}
  >
    <p>Are you sure you want to cancel this application? This action cannot be undone.</p>
  </Modal>

  <Toasts />
</div>
