<script lang="ts">
  import { ColumnList, FieldDate, FieldMultiselect, FilterUI } from '@txstate-mws/carbon-svelte'
  import { htmlEncode, sortby, unique } from 'txstate-utils'
  import { longDateTime } from '$lib'
  import { uiRegistry } from '../../../../../local'
  import type { PageData } from './$types'
  import ApproveLayout from '../ApproveLayout.svelte'

  export let data: PageData
  $: ({ activity, basicRequestData } = data)
  $: activityActions = sortby(unique(activity.map(a => ({ value: a.action })), 'value'), 'value')
  $: activityPeople = sortby(unique(activity.map(a => ({ value: a.user.login, label: `${a.user.fullname} (${a.user.login})` })), 'value'), 'label')
</script>

<ApproveLayout {basicRequestData}>
  <div>
    <FilterUI>
      <svelte:fragment slot="quickfilters">
        <FieldMultiselect path="actions" label="Activity Type" placeholder="Filter by activity type" items={activityActions} />
        <FieldMultiselect path="users" label="People" placeholder="Filter by person" items={activityPeople} />
      </svelte:fragment>
      <FieldDate path="happenedAfter" labelText="From" placeholder="Activities After" />
      <FieldDate path="happenedBefore" labelText="To" placeholder="Activities Before" />
    </FilterUI>

    <ColumnList title='Activity Log' rows={activity} columns={[
      { id: 'user', label: 'Person', render: row => htmlEncode(`${row.user.fullname} (${row.user.login})`) + (row.impersonatedBy ? `<div class="impersonator">${htmlEncode(row.impersonatedBy.fullname)} (${row.impersonatedBy.login})</div>` : '') },
      { id: 'createdAt', label: 'Date', render: row => longDateTime(row.createdAt) },
      { id: 'action', label: 'Activity', get: 'action' },
      { id: 'description', label: 'Detail', get: 'description' }
    ]} noItemsTitle="No activity." noItemsSubtitle="No activity has been recorded for this {uiRegistry.getWord('appRequest').toLocaleLowerCase()}." />
  </div>
</ApproveLayout>

<style>
  div :global(.impersonator) {
    font-size: 0.8em;
    color: var(--cds-text-02);
  }
</style>
