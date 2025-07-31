<script lang="ts">
  import { TabLinks } from '@txstate-mws/carbon-svelte'
  import { base } from '$app/paths'
  import type { LayoutData } from './$types.js'

  export let data: LayoutData
  $: ({ basicRequestData, requestId } = data)
  $: tabs = [
    ...(basicRequestData.applications.map(a => ({
      label: a.navTitle,
      href: `${base}/requests/${requestId}/approve/${a.programKey}`
    }))),
    {
      label: 'Activity log',
      href: `${base}/requests/${requestId}/approve/activity`
    }
  ]
</script>

<TabLinks {tabs} />
<slot />
