<!--
  @component
  Prints an app request's export view without leaving the current page. Render it once anywhere,
  then call `print(appRequestId)`: it loads the request, renders the export into a container that
  is invisible on screen, and opens the browser's print dialog showing only that container.
  The default is the applicant's export; pass `reviewerView` for the reviewer's.
-->
<script lang="ts" context="module">
  export interface PrintExportOptions {
    /** Applicant heading only: add the request number, for when the applicant has other requests in the same period. */
    includeRequestNumber?: boolean
    /** Replaces the default applicant heading. */
    title?: string
    subtitle?: string
    /** Reviewer presentation: warnings beside prompts, tooltips left as tooltips, 40/60 columns. */
    reviewerView?: boolean
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import type { UIRegistry } from '@reqquest/ui'
  import { api, type AppRequestForExportResponse } from '../api.js'
  import { exportTitle } from '../appreq-utils.js'
  import ApplicationDetailsView from './ApplicationDetailsView.svelte'

  export let uiRegistry: UIRegistry

  let details: AppRequestForExportResponse | undefined
  let options: PrintExportOptions = {}

  /** Rejects if the request cannot be loaded; resolves once the print dialog has been requested. */
  export async function print (appRequestId: string, printOptions: PrintExportOptions = {}) {
    options = printOptions
    details = await api.getAppRequestForExport(appRequestId)
    // let the display components render before the browser snapshots the page for printing
    await tick()
    await new Promise(resolve => requestAnimationFrame(resolve))
    window.print()
  }

  // window.print() does not block in every browser, so clean up on the event rather than after
  // the call. Unmounting hands Ctrl+P back to the host page.
  function onAfterPrint () {
    details = undefined
  }

  // The container must be a direct child of <body>: that is what lets the print styles drop the
  // rest of the page with display: none, where hiding it in place would leave blank pages behind.
  function portal (node: HTMLElement) {
    document.body.appendChild(node)
    return { destroy () { node.remove() } }
  }
</script>

<svelte:window on:afterprint={onAfterPrint} />

<div class="rq-print-root" class:active={!!details?.appRequest} use:portal>
  {#if details?.appRequest}
    <div class="max-w-4xl" class:reviewer-view={options.reviewerView}>
      <ApplicationDetailsView
        appRequest={details.appRequest}
        applications={details.applicationsReview}
        appData={details.appRequest.data}
        prequalPrompts={details.prequalPrompts}
        postqualPrompts={details.postqualPrompts}
        loading={false}
        {uiRegistry}
        title={options.title ?? exportTitle(details.appRequest, uiRegistry, !!options.includeRequestNumber)}
        subtitle={options.subtitle ?? ''}
        expandable={false}
        printMode
        showWarningsInline={!!options.reviewerView}
        showTooltipsAsText={!options.reviewerView}
      />
    </div>
  {/if}
</div>

<style>
  /* Reviewer standard: prompt/requirement column 40%, answer column 60%. */
  .reviewer-view {
    --prompt-list-columns: minmax(0, 2fr) minmax(0, 3fr);
  }

  .rq-print-root {
    display: none;
  }

  @media print {
    .rq-print-root.active {
      display: block;
    }

    :global(body:has(> .rq-print-root.active) > *:not(.rq-print-root)) {
      display: none !important;
    }
  }
</style>
