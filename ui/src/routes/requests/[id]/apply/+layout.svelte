<script lang="ts">
  import { ProgressNav, type RootStepItem, type StepItem } from '@txstate-mws/carbon-svelte'
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import type { LayoutData } from './$types'

  export let data: LayoutData
  $: ({ appRequestForNavigation, prequalPrompts, postqualPrompts } = data)

  function getNavItems (..._: any[]) {
    const ret: RootStepItem[] = []
    for (const prompt of prequalPrompts) {
      ret.push({
        id: `prompt${prompt.id}`,
        label: prompt.navTitle,
        href: `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`,
        type: $page.params.promptKey === prompt.key
          ? 'current'
          : prompt.answered ? 'complete' : 'available',
        substeps: []
      })
    }
    for (const application of appRequestForNavigation.applications) {
      const substeps: StepItem[] = []
      for (const requirement of application.requirements) {
        for (const prompt of requirement.prompts) {
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
        ret.push({
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
      ret.push({
        id: `prompt${prompt.id}`,
        label: prompt.navTitle,
        href: `${base}/requests/${appRequestForNavigation.id}/apply/${prompt.key}`,
        type: $page.params.promptKey === prompt.key
          ? 'current'
          : prompt.answered ? 'complete' : 'available',
        substeps: []
      })
    }
    ret.push({
      id: 'review',
      label: 'Review Submission',
      href: `${base}/requests/${appRequestForNavigation.id}/apply/review`,
      type: $page.route.id === '/requests/[id]/apply/review' ? 'current' : 'available',
      substeps: []
    })
    return ret
  }
  $: navItems = getNavItems(appRequestForNavigation, prequalPrompts, $page)

</script>

<ProgressNav steps={navItems}>
  <slot />
</ProgressNav>
