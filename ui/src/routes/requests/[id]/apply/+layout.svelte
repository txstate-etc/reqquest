<script lang="ts">
  import { ErrorPage, ProgressNav, type RootStepItem, type StepItem } from '@txstate-mws/carbon-svelte'
  import { setContext } from 'svelte'
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import type { LayoutData } from './$types'

  export let data: LayoutData
  $: ({ appRequestForNavigation, prequalPrompts, postqualPrompts } = data)

  function getNavItems (..._: any[]) {
    const navItems: RootStepItem[] = []
    let nextHref: string | undefined
    let prevHref: string | undefined
    let foundCurrent = false
    let lastprompt: string | undefined
    for (const prompt of prequalPrompts) {
      if (foundCurrent) {
        nextHref = `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`
        foundCurrent = false
      } else if ($page.params.promptKey === prompt.key) {
        foundCurrent = true
        if (lastprompt) prevHref = `${base}/requests/${appRequestForNavigation.id}/apply/${lastprompt}`
      }
      lastprompt = prompt.key
      navItems.push({
        id: `prompt${prompt.id}`,
        label: prompt.navTitle,
        href: `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`,
        type: $page.params.promptKey === prompt.key
          ? 'current'
          : prompt.answered ? 'complete' : 'available',
        substeps: []
      })
    }
    if (prequalPrompts.every(p => p.answered)) {
      if (foundCurrent) nextHref = `${base}/requests/${appRequestForNavigation.id}/apply/programs`
      foundCurrent = false
      if ($page.route.id === '/requests/[id]/apply/programs') {
        foundCurrent = true
        if (lastprompt) {
          prevHref = `${base}/requests/${appRequestForNavigation.id}/apply/${lastprompt}`
        }
      }
      const programReview: RootStepItem = {
        id: 'programs',
        label: 'Program Review',
        href: `${base}/requests/${appRequestForNavigation.id}/apply/programs`,
        type: $page.route.id === '/requests/[id]/apply/programs' ? 'current' : 'available',
        substeps: []
      }
      navItems.push(programReview)
      let pastProgramReview = false
      for (const application of appRequestForNavigation.applications) {
        const substeps: StepItem[] = []
        lastprompt = undefined
        for (const requirement of application.requirements) {
          for (const prompt of requirement.prompts) {
            if (foundCurrent) {
              nextHref = `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`
              foundCurrent = false
            }
            if ($page.params.promptKey === prompt.key) {
              pastProgramReview = true
              foundCurrent = true
              if (lastprompt) prevHref = `${base}/requests/${appRequestForNavigation.id}/apply/${lastprompt}`
              else prevHref = `${base}/requests/${appRequestForNavigation.id}/apply/programs`
            }
            lastprompt = prompt.key
            substeps.push({
              id: `prompt${prompt.id}`,
              label: prompt.navTitle,
              href: `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`,
              type: $page.params.promptKey === prompt.key
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
      for (const prompt of postqualPrompts) {
        if (foundCurrent) {
          nextHref = `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`
          foundCurrent = false
        }
        if ($page.params.promptKey === prompt.key) {
          pastProgramReview = true
          foundCurrent = true
          if (lastprompt) prevHref = `${base}/requests/${appRequestForNavigation.id}/apply/${lastprompt}`
          else prevHref = `${base}/requests/${appRequestForNavigation.id}/apply/programs`
        }
        navItems.push({
          id: `prompt${prompt.id}`,
          label: prompt.navTitle,
          href: `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`,
          type: $page.params.promptKey === prompt.key
            ? 'current'
            : prompt.answered ? 'complete' : 'available',
          substeps: []
        })
      }
      if ($page.route.id === '/requests/[id]/apply/review') pastProgramReview = true
      navItems.push({
        id: 'review',
        label: 'Review Submission',
        href: `${base}/requests/${appRequestForNavigation.id}/apply/review`,
        type: $page.route.id === '/requests/[id]/apply/review' ? 'current' : 'available',
        substeps: []
      })
      if (pastProgramReview) programReview.type = 'complete'
    }
    nextHref ??= `${base}/requests/${appRequestForNavigation.id}/apply/review`
    return { navItems, nextHref, prevHref }
  }
  $: ({ navItems, nextHref, prevHref } = getNavItems(appRequestForNavigation, prequalPrompts, $page))
  $: notInNavigation = !navItems.some(item => item.type === 'current' || item.substeps.some(s => s.type === 'current'))
  setContext('nextHref', () => ({ nextHref, prevHref }))
</script>

<ProgressNav steps={navItems}>
  {#if notInNavigation}
    <ErrorPage error={{ status: 404, message: 'Not Found' }} />
  {:else}
    <slot />
  {/if}
</ProgressNav>
