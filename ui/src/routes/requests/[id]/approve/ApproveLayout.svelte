<script lang="ts">
  import { api, type ReviewData } from '$internal'
  import type { LayoutData } from '../$types.js'
  import { uiRegistry } from '../../../../local/index.js'
  import { enumApplicationStatus, InfoCard } from '$lib'
  import { Modal } from 'carbon-components-svelte'
  import { Information, InformationFilled } from 'carbon-icons-svelte'
    import { ColumnList } from '@txstate-mws/carbon-svelte';
    import StatusMessageList from '$internal/components/StatusMessageList.svelte';
    import { titleCase } from 'txstate-utils';

  export let basicRequestData: LayoutData['basicRequestData']
  export let appRequest: ReviewData
  let open = false
</script>

<div class="review-container">
  <div class="review-sidebar flow">
    <!-- <Card
      title={basicRequestData.applicant.fullname}
    >
      <dl class="identifier">
        <dt>{uiRegistry.getWord('login')}</dt>
        <dd>{basicRequestData.applicant.login}</dd>
        {#each basicRequestData.applicant.otherIdentifiers as identifier (identifier.id)}
          <dt>{identifier.label}:</dt>
          <dd>{identifier.id}</dd>
        {/each}
      </dl>
      {#if uiRegistry.config.slots?.reviewerSidebarCard}
        <svelte:component this={uiRegistry.config.slots.reviewerSidebarCard} appRequest={basicRequestData} applicant={basicRequestData.applicant} {api} />
      {/if}
    </Card> -->
    <InfoCard
      noPrimaryAction
      title={basicRequestData.applicant.fullname}
      actions={[
        { label: 'Ineligibility Information', icon: Information, onClick: () => { open = true } }
      ]}>
      <dl class="identifier">
        <dt>{uiRegistry.getWord('login')}</dt>
        <dd>{basicRequestData.applicant.login}</dd>
        {#each basicRequestData.applicant.otherIdentifiers as identifier (identifier.id)}
          <dt>{identifier.label}:</dt>
          <dd>{identifier.id}</dd>
        {/each}
      </dl>
      {#if uiRegistry.config.slots?.reviewerSidebarCard}
        <svelte:component this={uiRegistry.config.slots.reviewerSidebarCard} appRequest={basicRequestData} applicant={basicRequestData.applicant} {api} />
      {/if}
    </InfoCard>

    <slot name="sidebar" />
    {#if uiRegistry.config.slots?.reviewerSidebar}
      <svelte:component this={uiRegistry.config.slots.reviewerSidebar} appRequest={basicRequestData} applicant={basicRequestData.applicant} {api} />
    {/if}
  </div>
  <div class="review-content">
    <slot />
  </div>
</div>

<Modal passiveModal open modalHeading="Ineligible programs">
  <div class='flex flex-col'>
    {#each appRequest?.applications.filter(app => app.status === enumApplicationStatus.INELIGIBLE) as application}
      {@const warningReqs = application.requirements.filter(r => r.status === 'WARNING' && r.statusReason)}
      <span class='py-4'>{application.title}</span>

      <div class='ineligible-warning flex gap-4'>
        <InformationFilled size={20} color='#dd3b46' class=' mr-2' /> 
        <span class="bx--accordion__title">{titleCase(application.status)}: {application.statusReason ?? 'No reasons provided'}</span>
      </div>

      <!-- <StatusMessageList
        // items={[...warningReqs.map(r => ({ id: r.id, message: r.statusReason! })), ...warningReqs.map(r => ({ id: `r.id+`, message: r.statusReason! }))]}
        items={warningReqs.map(r => ({ id: r.id, message: r.statusReason! }))}
        variant="warning"
        accordionTitle="Multiple warnings" /> -->
    {/each}
  </div>
</Modal>


<style>
  .review-container {
    display: flex;
    flex-direction: row-reverse;
    gap: 15px;
    padding: 15px;
  }

  .review-sidebar {
    container-type: inline-size;
    width: min(20rem, 33%);
  }

  .review-content {
    flex-grow: 1;
    container-type: inline-size;
  }

  @media (max-width: 800px) {
    .review-container {
      flex-direction: column-reverse;
    }

    .review-sidebar {
      width: 100%;
    }
  }

  .identifier {
    width: 100%;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 8px;
    container-type: inline-size;
  }
  .identifier dt {
    font-weight: bold;
  }
  .identifier dd, .identifier dt {
    margin: 0;
    padding: 0;
  }
  @container (width < 18rem) {
    .identifier {
      grid-template-columns: 1fr;
    }
  }

  .ineligible-warning {
    padding: .625rem 0;
  }
</style>
