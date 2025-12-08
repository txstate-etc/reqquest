<script lang="ts">
  import { ErrorPage, ProgressNav, type RootStepItem, type StepItem } from '@txstate-mws/carbon-svelte'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { resolve } from '$app/paths'
  import { page } from '$app/stores'
  import type { LayoutData } from './$types'

  export let data: LayoutData
  $: ({ appRequestForExport, applicationsAccept } = data)

  function getNavItems (..._: any[]) {
    const navItems: RootStepItem[] = []
    let nextHref: string | undefined
    let prevHref: string | undefined
    let foundCurrent = false
    let lastprompt: string | undefined

    for (const application of applicationsAccept) {
      const substeps: StepItem[] = []
      for (const requirement of application.requirements) {
        for (const prompt of requirement.prompts) {
          if (foundCurrent) {
            nextHref = resolve(`/requests/${appRequestForExport.id}/accept/${prompt.id}`)
            foundCurrent = false
          }
          if ($page.params.promptId === prompt.id) {
            foundCurrent = true
            if (lastprompt) prevHref = resolve(`/requests/${appRequestForExport.id}/accept/${lastprompt}`)
          }
          lastprompt = prompt.id
          substeps.push({
            id: `prompt${prompt.id}`,
            label: prompt.navTitle,
            href: resolve(`/requests/${appRequestForExport.id}/accept/${prompt.id}`),
            type: $page.params.promptId === prompt.id
              ? 'current'
              : prompt.answered ? 'complete' : 'available'
          })
        }
      }
      if (substeps.length > 0) {
        navItems.push({
          id: `application${application.id}`,
          label: application.navTitle,
          href: substeps[0].href,
          type: substeps.some(s => s.type === 'current')
            ? 'current'
            : substeps.every(s => s.type === 'complete')
              ? 'complete'
              : 'available',
          substeps
        })
      }
    }
    lastprompt = undefined
    navItems.push({
      id: 'review',
      label: 'Review Submission',
      href: resolve(`/requests/${appRequestForExport.id}/accept/review`),
      type: $page.route.id === '/requests/[id]/accept/review' ? 'current' : 'available',
      substeps: []
    })
    nextHref ??= resolve(`/requests/${appRequestForExport.id}/accept/review`)
    return { navItems, nextHref, prevHref }
  }
  $: ({ navItems, nextHref, prevHref } = getNavItems(appRequestForExport, applicationsAccept, $page))
  $: notInNavigation = !navItems.some(item => item.type === 'current' || item.substeps.some(s => s.type === 'current'))
  const nextHrefStore = writable({ nextHref, prevHref })
  $: nextHrefStore.set({ nextHref, prevHref })
  setContext('nextHref', nextHrefStore)
</script>

<ProgressNav steps={navItems}>
  {#if notInNavigation}
    <ErrorPage error={{ status: 404, message: 'Not Found' }} />
  {:else}
    <slot />
  {/if}
</ProgressNav>
