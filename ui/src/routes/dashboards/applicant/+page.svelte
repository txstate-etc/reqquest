<script lang="ts">
  import { goto, invalidate } from '$app/navigation'
  import { resolve } from '$app/paths'
  import type { ApplicationForDetails, AppRequestForDetails, Scalars } from '$lib'
  import {
    api, ApplicationDetailsView, AppRequestCard, IntroPanel, type AppRequestForExportResponse, type DashboardAppRequest,
    getPeriodDisplayInfo, getPeriodStatus, getStatusActionType, getSubmitButtonText
  } from '$internal'
  import { CardGrid, FieldMultiselect, FilterUI, Panel, PanelDialog, Toasts } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button, Dropdown, InlineNotification, Modal, Tooltip } from 'carbon-components-svelte'
  import Close from 'carbon-icons-svelte/lib/Close.svelte'
  import DocumentExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import { uiRegistry } from '../../../local/index.js'
  import type { PageData } from './$types'

  interface FilterState {
    tab?: 'recent_applications' | 'past_applications'
    search?: string
    yearSubmitted?: string[]
  }

  export let data: PageData
  $: ({ appRequests, availableYears, access, openPeriods, recentCutoffIso, recentDays } = data)

  let sidePanelOpen = false
  let loading = false

  // Selected Items
  let selectedAppRequest: AppRequestForDetails | undefined = undefined
  let selectedPeriodId: string | undefined = undefined
  let lastInsertedId: string | undefined

  // Application Details Data (loaded when side panel opens)
  let appData: Scalars['JsonData'] = {}
  let prequalPrompts: AppRequestForExportResponse['prequalPrompts'] | undefined = undefined
  let postqualPrompts: AppRequestForExportResponse['postqualPrompts'] | undefined = undefined
  let applications: ApplicationForDetails[] = []
  let filterDataSearch: FilterState | undefined

  // Modal State
  let cancelConfirmation: { open: boolean, requestId: string | null, isWithdraw: boolean } = { open: false, requestId: null, isWithdraw: false }

  // Auto-select first displayable period
  $: displayablePeriods = openPeriods.length > 0 ? getOpenAndUpcomingPeriods(openPeriods, recentCutoffIso) : []
  $: if (displayablePeriods.length > 0 && !selectedPeriodId) {
    selectedPeriodId = displayablePeriods[0].id
  }
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

  function getOpenAndUpcomingPeriods (periods: typeof openPeriods, recentCutoffIso: string): typeof openPeriods {
    const recentCutoff = new Date(recentCutoffIso)

    return periods
      .filter(period => {
        const status = getPeriodStatus(period)
        // Show periods that are open/upcoming AND have been reviewed
        if ((status === 'open' || status === 'upcoming') && period.reviewed) return true
        // Also show closed periods that closed within the recent window
        if (status === 'closed' && period.closeDate) {
          const closeDate = new Date(period.closeDate)
          return closeDate >= recentCutoff && period.reviewed
        }
        return false
      })
      .sort((a, b) => new Date(a.openDate).getTime() - new Date(b.openDate).getTime())
  }

  function showError (message: string) {
    toasts.add(message, 'error', 7000)
  }

  function isSubmitted (status: string): boolean {
    return status !== 'STARTED' && status !== 'READY_TO_SUBMIT'
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
    const submitted = isSubmitted(request.status)
    const cancelWithdrawLabel = submitted ? 'Withdraw Application' : 'Cancel Application'

    return [
      {
        label: 'View Application',
        onClick: async () => await openSidePanel(request)
      },
      // {
      //   label: 'Download Offer',
      //   onClick: async () => await downloadOffer(request.id),
      //   icon: Download,
      //   disabled: !request.actions.offer
      // },
      // {
      //   label: 'Appeal Decision',
      //   onClick: async () => await appealDecision(request.id),
      //   icon: Warning,
      //   disabled: !request.actions.returnToApplicant
      // },
      {
        label: 'Export Application',
        onClick: async () => await exportApplication(request.id),
        icon: DocumentExport
      },
      {
        label: cancelWithdrawLabel,
        onClick: () => { cancelConfirmation = { open: true, requestId: request.id, isWithdraw: submitted } },
        icon: Close,
        disabled: !request.actions.cancel
      }
      // {
      //   label: 'Reinstate Application',
      //   onClick: async () => await reinstateApplication(request.id),
      //   icon: Reset,
      //   disabled: !request.actions.reopen
      // }
    ]
  }

  // ==========================================
  // Application Actions
  // ==========================================
  // const appealDecision = async (requestId: string) =>
  //   await handleApiAction(
  //     async () => await api.returnAppRequest(requestId),
  //     'Failed to appeal decision',
  //     'Appeal submitted successfully'
  //   )

  // const reinstateApplication = async (requestId: string) =>
  //   await handleApiAction(
  //     async () => await api.reopenAppRequest(requestId),
  //     'Failed to reinstate application',
  //     'Application reinstated successfully'
  //   )

  // async function downloadOffer (requestId: string) {
  //   // TODO: Implement actual download logic
  //   console.log('Download offer for', requestId)
  // }

  async function exportApplication (requestId: string) {
    await goto(resolve(`/requests/${requestId}/export`))
  }

  // ==========================================
  // Panel Dialog Management
  // ==========================================

  async function openSidePanel (appRequest: DashboardAppRequest) {
    sidePanelOpen = true
    loading = true

    try {
      // Fetch additional application details for the side panel
      const details = await api.getAppRequestForExport(appRequest.id)

      selectedAppRequest = details.appRequest as AppRequestForDetails | undefined

      appData = details.appRequest.data
      applications = details.applicationsReview
      prequalPrompts = details.prequalPrompts
      postqualPrompts = details.postqualPrompts
    } catch (error) {
      showError('Failed to load application details')
      console.error('Error loading application details:', error)
    } finally {
      loading = false
    }
  }

  function closeSidePanel () {
    sidePanelOpen = false
    selectedAppRequest = undefined
    appData = {}
    prequalPrompts = undefined
    postqualPrompts = undefined
  }

  async function handleCancelConfirm () {
    if (!cancelConfirmation.requestId) return

    const actionType = cancelConfirmation.isWithdraw ? 'withdraw' : 'cancel'
    await handleApiAction(
      async () => await api.cancelAppRequest(cancelConfirmation.requestId!),
      `Failed to ${actionType} application`,
      `Application ${actionType === 'withdraw' ? 'withdrawn' : 'cancelled'} successfully`
    )

    cancelConfirmation = { open: false, requestId: null, isWithdraw: false }
  }

  // Handle submit action based on status action type, used for PanelDialog, specifically for the App View-only side panel
  async function handleSubmitAction () {
    if (!selectedAppRequest) return

    const { status, id } = selectedAppRequest
    const actionType = getStatusActionType(status)

    switch (actionType) {
    case 'navigate':
      await goto(resolve(`/requests/${id}/apply`))
      break
    case 'export':
      await exportApplication(id)
      break
    // case 'download':
    //   await downloadOffer(id)
    //   break
    case 'none':
      // No action for completed/final statuses
      break
    }
  }

  // ==========================================
  // Form Handlers
  // ==========================================

  async function clickCreateAppRequest () {
    // Use the currently selected period
    if (!selectedPeriodId) return
    const { success } = await submitAppRequest({ periodId: selectedPeriodId })
    if (success) await onSaved()
  }

  async function onSaved () {
    await goto(resolve(`/requests/${lastInsertedId}/apply`))
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
  $: showIntroPanel = filterDataSearch?.tab !== 'past_applications'
  $: hasPastApps = filterDataSearch?.tab === 'past_applications' && yearOptions.length > 0
</script>

<div class="flow applicant-dashboard">
  <!-- Filter UI for recent/past applications -->
  <FilterUI
    search={hasPastApps}
    tabs={[
      { label: 'Recent Applications', value: 'recent_applications' },
      { label: 'Past Applications', value: 'past_applications' }
    ]}
    on:apply={e => { filterDataSearch = e.detail }}
    on:mount={e => { filterDataSearch = e.detail }}>
    <svelte:fragment slot="quickfilters">
      {#if hasPastApps}
        <FieldMultiselect path="yearSubmitted" label="Year Submitted" items={yearOptions} />
      {/if}
    </svelte:fragment>
  </FilterUI>

  {#if showIntroPanel}
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
              <section class="flex flex-wrap gap-4 items-end intro-actions">
                <!-- Period selector (if multiple) -->
                {#if displayablePeriods.length > 1}
                  <div class="min-w-[250px] intro-dropdown-wrapper">
                    <Dropdown
                      size="lg"
                      labelText="Select a {uiRegistry.getWord('period').toLowerCase()}"
                      hideLabel
                      placeholder="Choose a {uiRegistry.getWord('period').toLowerCase()}"
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
                    size="field"
                  >
                    Start application
                  </Button>
                {:else if (!periodInfo.canStartNew || !access.createAppRequestSelf) && appRequests.length > 0}
                  <Tooltip>
                    <p>Application started, see dashboard card for details.</p>
                  </Tooltip>
                {/if}
              </section>

            </div>
          {/if}
        {:else}
          <p>No application periods are currently available.</p>
        {/if}
      </svelte:fragment>
    </IntroPanel>
  {/if}
  <!-- Application Cards -->
  <Panel title={filterDataSearch?.tab === 'past_applications' ? 'All past applications' : 'All recent applications'}>
    {#if appRequests.length === 0}
      {#if filterDataSearch?.tab === 'past_applications'}
        <InlineNotification
          kind="info"
          title="No results found."
          subtitle={hasPastApps ? 'You may need to refine your searched terms, filters or try again.' : undefined}
          lowContrast
          hideCloseButton
        />
      {:else}
        <InlineNotification
          kind="info"
          title="No recent applications found."
          subtitle="You have no applications created or modified in the last {recentDays} days. Check under Past applications tab."
          lowContrast
          hideCloseButton
        />
      {/if}
    {:else}
      <CardGrid cardSize="500px">
        {#each appRequests as request (request.id)}
          <AppRequestCard
            {request}
            actions={buildCardActions(request)}
            showAcceptanceButtons={true}
          />
        {/each}
      </CardGrid>
    {/if}
  </Panel>

  <!-- Inlined Application Details Panel -->
  <PanelDialog
    size="large"
    open={sidePanelOpen}
    title={selectedAppRequest?.period?.name ?? 'Application Details'}
    cancelText="Close"
    submitText={selectedAppRequest?.status ? getSubmitButtonText(selectedAppRequest.status) : ''}
    on:cancel={closeSidePanel}
    on:submit={handleSubmitAction}>
    {#if selectedAppRequest}
      <ApplicationDetailsView
        appRequest={selectedAppRequest}
        {applications}
        {appData}
        {prequalPrompts}
        {postqualPrompts}
        {loading}
        {uiRegistry}
        title={selectedAppRequest.period?.name ? `View your ${selectedAppRequest.period.name} application` : 'View your application'}
        showCorrectionsInline
      />
    {/if}
  </PanelDialog>

  <Modal
    bind:open={cancelConfirmation.open}
    modalHeading={cancelConfirmation.isWithdraw ? 'Withdraw Application' : 'Cancel Application'}
    primaryButtonText={cancelConfirmation.isWithdraw ? 'Yes, Withdraw Application' : 'Yes, Cancel Application'}
    secondaryButtonText="Keep Application"
    on:click:button--secondary={() => { cancelConfirmation = { open: false, requestId: null, isWithdraw: false } }}
    on:submit={handleCancelConfirm}
    on:close={() => { cancelConfirmation = { open: false, requestId: null, isWithdraw: false } }}
  >
    <p>
      {#if cancelConfirmation.isWithdraw}
        Withdrawing your application will remove it from consideration and any approved benefits will be lost. You can reopen and edit this application to resubmit it, as long as the application window is still open.
      {:else}
        Canceling your application will remove it from consideration. You can reinstate and submit it later, as long as the application window is still open.
      {/if}
    </p>
  </Modal>

  <Toasts />
</div>

<style>
  .applicant-dashboard {
    --repel-vertical-alignment:top;
  }

  .intro-dropdown-wrapper :global(.bx--dropdown__wrapper.bx--list-box__wrapper) {
    display: flex;
    flex-direction: column;
    margin-top:-5px;
  }
  .intro-actions :global(.bx--list-box__field) {
    background: var(--cds-field-02,#ffffff);
  }
</style>
