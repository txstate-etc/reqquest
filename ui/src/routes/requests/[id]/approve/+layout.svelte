<script lang="ts">
  import { TabLinks } from '@txstate-mws/carbon-svelte'
  import { resolve } from '$app/paths'
  import type { LayoutData } from './$types.js'
  import { IntroPanel, applicantStatuses, REVIEWER_STATUS_CONFIG, longNumericTime } from '$internal'
  import { uiRegistry } from '../../../../local/index.js'
  import { enumAppRequestPhase } from '$lib'
  import { excludePreSubmissionIneligibleApps } from '$internal'

  export let data: LayoutData
  $: ({ basicRequestData, requestId } = data)
  $: tabs = [
    ...(excludePreSubmissionIneligibleApps([basicRequestData])[0].applications.map(a => ({
      label: a.navTitle,
      href: resolve(`/requests/${requestId}/approve/${a.programKey}`)
    }))),
    {
      label: 'Activity log',
      href: resolve(`/requests/${requestId}/approve/activity`)
    }
  ]

</script>

<IntroPanel
  title={basicRequestData.period.name + (basicRequestData.period.code ? ` (${basicRequestData.period.code})` : '')}
  subtitle={`Review and complete the ${uiRegistry.getWord('appRequest').toLowerCase()} below or advance it in the workflow.`}
  tags={[{ label: REVIEWER_STATUS_CONFIG[basicRequestData.status].label, type: REVIEWER_STATUS_CONFIG[basicRequestData.status].color }]}
>
  <div class="block-end flex items-center" slot="block-end">
    <section class="text-base text-center flex-col gap-2 mr-[12px]">
      <dl class="flex gap-4  text-sm">
        <div class="flex flex-col bg-[var(--cds-ui-03,#d9d9d9)] py-4 px-4  justify-center">
          <dt class="font-bold">
            {#if basicRequestData.closedAt}
              Closed
            {:else if applicantStatuses.has(basicRequestData.status)}
              Submit By
            {:else if basicRequestData.phase !== enumAppRequestPhase.COMPLETE}
              Review By
            {:else}
              Auto-Closes
            {/if}:
          </dt>
          <dd>
            {#if basicRequestData.closedAt}
              <time datetime={basicRequestData.closedAt}>{longNumericTime(basicRequestData.closedAt)}</time>
            {:else if applicantStatuses.has(basicRequestData.status)}
              {#if basicRequestData.period.closeDate}
                <time datetime={basicRequestData.period.closeDate}>{longNumericTime(basicRequestData.period.closeDate)}</time>
              {:else}
                No deadline
              {/if}
            {:else if basicRequestData.phase !== enumAppRequestPhase.COMPLETE}
              {#if basicRequestData.period.archiveDate}
                <time datetime={basicRequestData.period.archiveDate}>{longNumericTime(basicRequestData.period.archiveDate)}</time>
              {:else}
                No deadline
              {/if}
            {:else}
              {#if basicRequestData.period.archiveDate}
                <time datetime={basicRequestData.period.archiveDate}>{longNumericTime(basicRequestData.period.archiveDate)}</time>
              {:else}
                Never
              {/if}
            {/if}
          </dd>
        </div>
      </dl>
    </section>
  </div>
</IntroPanel>
<TabLinks {tabs} />
<slot />
<style>
  .block-end :global(.bx--label) {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
  }
</style>
