<script lang="ts">
  import { goto, invalidate } from '$app/navigation'
  import { base } from '$app/paths'
  import { api } from '$lib'
  import { ApplicationDetailsView, AppRequestCard, IntroPanel } from '$lib/components'
  import type { DashboardAppRequest, ApplyNavigationResponse, AnsweredPrompt } from '$lib/components/types'
  import { getAppRequestStatusInfo, getPeriodDisplayInfo, getPeriodStatus, getStatusActionType, getSubmitButtonText } from '$lib/status-utils.js'
  import type { AppRequestStatus, Scalars } from '$lib/typed-client/schema'
  import { CardGrid, FieldMultiselect, FieldSelect, FilterUI, Panel, PanelDialog, PanelFormDialog, TagSet, Toasts } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button, Dropdown, InlineNotification, Modal, Tooltip } from 'carbon-components-svelte'
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
  let loading = false

  // Selected Items
  let selectedAppRequest: DashboardAppRequest | null = null
  let selectedPeriodId: string | undefined = undefined
  let lastInsertedId: string | undefined

  // Application Details Data (loaded when side panel opens)
  let appData: Scalars['JsonData'] = {}
  let prequalPrompts: ApplyNavigationResponse['prequalPrompts'] | undefined = undefined
  let postqualPrompts: ApplyNavigationResponse['postqualPrompts'] | undefined = undefined
  let filterDataSearch: FilterState | undefined

  // Modal State
  let cancelConfirmation: { open: boolean, requestId: string | null } = { open: false, requestId: null }

  // Auto-select period. Only for single period scenarios
  $: if (openPeriods.length === 1 && !selectedPeriodId) {
    selectedPeriodId = openPeriods[0].id
  }
  $: displayablePeriods = openPeriods.length > 0 ? getOpenAndUpcomingPeriods(openPeriods) : []
  $: currentPeriod = getCurrentPeriod(displayablePeriods, selectedPeriodId)
  $: periodInfo = currentPeriod ? getPeriodDisplayInfo(currentPeriod) : null

  // ==========================================
  // Period Management Helper Functions
  // ==========================================
  function getCurrentPeriod (periods: typeof openPeriods, selectedId: string | undefined) {
    if (periods.length === 1) return periods[0]
    if (selectedId) return periods.find(p => p.id === selectedId) ?? null
    return null
  }

  function getExistingApplicationForPeriod (periodName: string): DashboardAppRequest | undefined {
    return appRequests.find(req => req.period.name === periodName)
  }

  function getOpenAndUpcomingPeriods (periods: typeof openPeriods): typeof openPeriods {
    return periods
      .filter(period => {
        const status = getPeriodStatus(period)
        return status === 'open' || status === 'upcoming'
      })
      .sort((a, b) => new Date(a.openDate).getTime() - new Date(b.openDate).getTime())
  }

  function showError (message: string) {
    toasts.add(message, 'error', 7000)
  }

  // ==========================================
  // API Action Handlers
  // ==========================================

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
        const error = result.messages?.find((m: { type: string, message: string }) => m.type === 'error')?.message
        showError(error ?? errorMessage)
      }
    } catch (error) {
      showError(errorMessage)
    }
  }

  // ==========================================
  // UI Card Action Builders
  // ==========================================

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

  // ==========================================
  // Application Actions
  // ==========================================
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

  // ==========================================
  // Panel Dialog Management
  // ==========================================

  async function openSidePanel (appRequest: DashboardAppRequest) {
    selectedAppRequest = appRequest
    sidePanelOpen = true
    loading = true

    try {
      // Fetch additional application details for the side panel
      const [details, requestAppData] = await Promise.all([
        api.getApplyNavigation(appRequest.id),
        api.getAppRequestData(appRequest.id)
      ])

      if (details.appRequest) {
        appData = requestAppData
        prequalPrompts = details.prequalPrompts
        postqualPrompts = details.postqualPrompts
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
    selectedAppRequest = null
    appData = {}
    prequalPrompts = undefined
    postqualPrompts = undefined
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
    if (!selectedAppRequest) return

    const { status, id } = selectedAppRequest
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

  // ==========================================
  // Form Handlers
  // ==========================================

  async function clickCreateAppRequest () {
    // Use selected period for multiple, or first period for single
    const periodId = openPeriods.length > 1 ? selectedPeriodId : openPeriods[0]?.id
    if (!periodId) return
    const { success } = await submitAppRequest({ periodId })
    if (success) await onSaved()
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

  // ==========================================
  // FilterUI Helper Functions
  // ==========================================

  function getAvailableYears (years: number[]) {
    return years.map(year => ({ value: year.toString(), label: year.toString() }))
  }

  // Reactive statements for filter options
  $: yearOptions = getAvailableYears(availableYears)
  $: recentDays = uiRegistry.config.applicantDashboardRecentDays ?? 30
</script>

<div class="flow applicant-dashboard">
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
    <IntroPanel
      title={uiRegistry.config.applicantDashboardIntroHeader}
      subtitle={uiRegistry.config.applicantDashboardIntroDetail}

    >
      <svelte:fragment slot="block-end">
        {#if displayablePeriods.length > 0}
          <!-- Show period info and action for selected period -->
          {#if currentPeriod && periodInfo}
            <div class="flex flex-wrap gap-4 items-center">
              <!-- Period Information Section -->
              <section class="text-base text-center flex-col gap-2">
                <!-- <h3 class="font-bold text-base">{currentPeriod.name}</h3> -->
                <dl class="flex gap-4  text-sm">
                  <div class="flex flex-col bg-[var(--cds-ui-03,#d9d9d9)] py-4 px-4  justify-center">
                    <dt class="font-bold">Application opens:</dt>
                    <dd>
                      <time datetime={periodInfo.openDateMachineFormat}>
                        {periodInfo.openLabel}
                      </time>
                    </dd>
                  </div>
                  {#if currentPeriod.closeDate}
                  <div class="flex flex-col bg-[var(--cds-ui-03,#d9d9d9)] py-4 px-4  justify-center">
                    <dt class="font-bold">Application closes:</dt>
                    <dd>
                      <time datetime={periodInfo.closeDateMachineFormat}>
                        {periodInfo.closeDate}
                      </time>
                    </dd>
                  </div>
                  {/if}
                </dl>
              </section>

              <!-- Period selector (if multiple) -->
              {#if displayablePeriods.length > 1}
                <div class="min-w-[250px]">
                  <Dropdown
                    size="sm"
                    titleText="Select a term"
                    placeholder="Choose a period"
                    bind:selectedId={selectedPeriodId}
                    items={displayablePeriods.map(p => ({
                      id: p.id,
                      text: p.name
                    }))}
                  />
                </div>
              {/if}

              <!-- Action Button. Only show start button if no existing application and user can act -->
              {#if periodInfo.canStartNew && access.createAppRequestSelf}
                <Button
                  on:click={clickCreateAppRequest}
                  kind="primary"
                >
                  Start application
                </Button>
              {/if}
            </div>
          {/if}
        {:else}
          <p>No application periods are currently available.</p>
        {/if}
      </svelte:fragment>
    </IntroPanel>
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
    <Panel title="All recent Applications">
      <CardGrid cardSize="500px">
      {#each appRequests as request}
        <AppRequestCard
          {request}
          actions={buildCardActions(request)}
          showAcceptanceButtons={true}
        />
      {/each}
    </CardGrid>
    </Panel>
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
    title={selectedAppRequest?.period.name ?? 'Application Details'}
    cancelText="Close"
    submitText={selectedAppRequest?.status ? getSubmitButtonText(selectedAppRequest.status) : ''}
    on:cancel={closeSidePanel}
    on:submit={handleSubmitAction}>
    <ApplicationDetailsView
      appRequest={selectedAppRequest ?? undefined}
      {appData}
      {prequalPrompts}
      {postqualPrompts}
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

<style>
  .applicant-dashboard {
    --repel-vertical-alignment:top;
  }
</style>
