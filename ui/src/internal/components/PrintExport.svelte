<!--
  @component
  Prints an app request's export view without leaving the current page. Render it once anywhere,
  then call `print(appRequestId)`: it loads the request, renders the export into a container that
  is invisible on screen, and opens the browser's print dialog showing only that container.
-->
<script lang="ts">
  import { tick } from 'svelte'
  import type { UIRegistry } from '@reqquest/ui'
  import { api, type AppRequestForExportResponse } from '../api.js'
  import { exportTitle } from '../appreq-utils.js'
  import ApplicationDetailsView from './ApplicationDetailsView.svelte'

  export let uiRegistry: UIRegistry

  let details: AppRequestForExportResponse | undefined
  let includeRequestNumber = false

  /**
   * Rejects if the request cannot be loaded; resolves once the print dialog has been requested.
   * Set withRequestNumber when the applicant has other requests in the same period, so the
   * heading says which one this is.
   */
  export async function print (appRequestId: string, withRequestNumber = false) {
    includeRequestNumber = withRequestNumber
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
    <div class="max-w-4xl">
      <ApplicationDetailsView
        appRequest={details.appRequest}
        applications={details.applicationsReview}
        appData={details.appRequest.data}
        prequalPrompts={details.prequalPrompts}
        postqualPrompts={details.postqualPrompts}
        loading={false}
        {uiRegistry}
        title={exportTitle(details.appRequest, uiRegistry, includeRequestNumber)}
        subtitle=""
        expandable={false}
        printMode
        showTooltipsAsText
      />
    </div>
  {/if}
</div>

<style>
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
