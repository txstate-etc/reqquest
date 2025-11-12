<script lang="ts">
  import { ErrorPage, ProgressNav, type RootStepItem, type StepItem } from '@txstate-mws/carbon-svelte'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { resolve } from '$app/paths'
  import { page } from '$app/stores'
  import { enumApplicationStatus, enumRequirementStatus, applicantRequirementTypes } from '$lib'
  import type { LayoutData } from './$types'

  export let data: LayoutData
  $: ({ appRequestForExport, prequalPrompts, postqualPrompts } = data)

  function getNavItems (..._: any[]) {
    const navItems: RootStepItem[] = []
    let nextHref: string | undefined
    let prevHref: string | undefined
    let foundCurrent = false
    let lastprompt: string | undefined
    for (const prompt of prequalPrompts) {
      if (foundCurrent) {
        nextHref = resolve(`/requests/${appRequestForExport.id}/apply/${prompt.id}`)
        foundCurrent = false
      } else if ($page.params.promptId === prompt.id) {
        foundCurrent = true
        if (lastprompt) prevHref = resolve(`/requests/${appRequestForExport.id}/apply/${lastprompt}`)
      }
      lastprompt = prompt.id
      navItems.push({
        id: `prompt${prompt.id}`,
        label: prompt.navTitle,
        href: resolve(`/requests/${appRequestForExport.id}/apply/${prompt.id}`),
        type: $page.params.promptId === prompt.id
          ? 'current'
          : prompt.answered ? 'complete' : 'available',
        substeps: []
      })
    }
    if (prequalPrompts.some(p => !p.answered)) {
      nextHref = resolve(`/requests/${appRequestForExport.id}/apply/${prequalPrompts.find(p => !p.answered)!.id}`)
    } else {
      if (foundCurrent) nextHref = resolve(`/requests/${appRequestForExport.id}/apply/programs`)
      foundCurrent = false
      if ($page.route.id === '/requests/[id]/apply/programs') {
        const qualFinished = appRequestForExport.applications.every(app => app.status !== enumApplicationStatus.PENDING || app.requirements.filter(r => applicantRequirementTypes.has(r.type)).every(req => req.status !== enumRequirementStatus.PENDING))
        const postFinished = postqualPrompts.every(p => p.answered)
        if (qualFinished && postFinished) {
          nextHref = resolve(`/requests/${appRequestForExport.id}/apply/review`)
        } else if (!qualFinished) {
          const app = appRequestForExport.applications.find(app => app.status === enumApplicationStatus.PENDING)!
          nextHref = resolve(`/requests/${appRequestForExport.id}/apply/${app.requirements[0].prompts[0].id}`)
        } else if (!postFinished) {
          nextHref = resolve(`/requests/${appRequestForExport.id}/apply/${postqualPrompts[0].id}`)
        } else {
          nextHref = resolve(`/requests/${appRequestForExport.id}/apply/review`)
        }
        if (lastprompt) {
          prevHref = resolve(`/requests/${appRequestForExport.id}/apply/${lastprompt}`)
        }
      }
      const programReview: RootStepItem = {
        id: 'programs',
        label: 'Program Review',
        href: resolve(`/requests/${appRequestForExport.id}/apply/programs`),
        type: $page.route.id === '/requests/[id]/apply/programs' ? 'current' : 'available',
        substeps: []
      }
      navItems.push(programReview)
      let pastProgramReview = false
      for (const application of appRequestForExport.applications) {
        const substeps: StepItem[] = []
        lastprompt = undefined
        for (const requirement of application.requirements) {
          if (!applicantRequirementTypes.has(requirement.type)) continue
          for (const prompt of requirement.prompts) {
            if (foundCurrent) {
              nextHref = resolve(`/requests/${appRequestForExport.id}/apply/${prompt.id}`)
              foundCurrent = false
            }
            if ($page.params.promptId === prompt.id) {
              pastProgramReview = true
              foundCurrent = true
              if (lastprompt) prevHref = resolve(`/requests/${appRequestForExport.id}/apply/${lastprompt}`)
              else prevHref = resolve(`/requests/${appRequestForExport.id}/apply/programs`)
            }
            lastprompt = prompt.id
            substeps.push({
              id: `prompt${prompt.id}`,
              label: prompt.navTitle,
              href: resolve(`/requests/${appRequestForExport.id}/apply/${prompt.id}`),
              type: $page.params.promptId === prompt.id
                ? 'current'
                : prompt.answered ? 'complete' : 'available'
            })
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- it can definitely be both true and false, typescript is doing something crazy
        if (foundCurrent) {
          nextHref = resolve(`/requests/${appRequestForExport.id}/apply/programs`)
          foundCurrent = false
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
      for (const prompt of postqualPrompts) {
        if (foundCurrent) {
          nextHref = resolve(`/requests/${appRequestForExport.id}/apply/${prompt.id}`)
          foundCurrent = false
        }
        if ($page.params.promptId === prompt.id) {
          pastProgramReview = true
          foundCurrent = true
          if (lastprompt) prevHref = resolve(`/requests/${appRequestForExport.id}/apply/${lastprompt}`)
          else prevHref = resolve(`/requests/${appRequestForExport.id}/apply/programs`)
        }
        lastprompt = prompt.id
        navItems.push({
          id: `prompt${prompt.id}`,
          label: prompt.navTitle,
          href: resolve(`/requests/${appRequestForExport.id}/apply/${prompt.id}`),
          type: $page.params.promptId === prompt.id
            ? 'current'
            : prompt.answered ? 'complete' : 'available',
          substeps: []
        })
      }
      if ($page.route.id === '/requests/[id]/apply/review') pastProgramReview = true
      navItems.push({
        id: 'review',
        label: 'Review Submission',
        href: resolve(`/requests/${appRequestForExport.id}/apply/review`),
        type: $page.route.id === '/requests/[id]/apply/review' ? 'current' : 'available',
        substeps: []
      })
      if (pastProgramReview) programReview.type = 'complete'
    }
    nextHref ??= resolve(`/requests/${appRequestForExport.id}/apply/review`)
    return { navItems, nextHref, prevHref }
  }
  $: ({ navItems, nextHref, prevHref } = getNavItems(appRequestForExport, prequalPrompts, $page))
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
