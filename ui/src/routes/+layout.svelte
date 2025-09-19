<script lang="ts">
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import { api } from '$lib'
  import { UIShell } from '@txstate-mws/carbon-svelte'
  import { unifiedAuth } from '@txstate-mws/sveltekit-utils'
  import Dashboard from 'carbon-icons-svelte/lib/Dashboard.svelte'
  import DocumentMultiple_01 from 'carbon-icons-svelte/lib/DocumentMultiple_01.svelte'
  import Settings from 'carbon-icons-svelte/lib/Settings.svelte'
  import Time from 'carbon-icons-svelte/lib/Time.svelte'
  import type { LayoutData } from './$types.js'
  import { uiRegistry } from '../local/index.js'
  import '../app.css'

  api.recordNavigations()

  export let data: LayoutData
  $: ({ access } = data)
</script>

<UIShell appName={uiRegistry.config.appName} reverseWeights={!!PUBLIC_ENVIRONMENT} companyName={PUBLIC_ENVIRONMENT || 'TXST'} overlayText={PUBLIC_ENVIRONMENT} navRoot={{
  title: uiRegistry.config.appName,
  hideFromSideNav: true,
  routeId: '/',
  children: [
    {
      title: uiRegistry.config.applicantDashboardTitle ?? 'Applicant Dashboard',
      navTitle: uiRegistry.config.applicantDashboardNavTitle ?? uiRegistry.config.applicantDashboardTitle ?? 'Applicant',
      group: 'Dashboards',
      hideFromSideNav: !access.viewApplicantDashboard,
      icon: Dashboard,
      routeId: '/dashboards/applicant'
    },
    {
      title: 'Reviewer',
      group: 'Dashboards',
      hideFromSideNav: !access.viewReviewerInterface,
      icon: Dashboard,
      routeId: '/dashboards/reviewer'
    },
    {
      title: uiRegistry.getPlural('appRequest'),
      group: 'Administration',
      hideFromSideNav: !access.viewAppRequestList,
      icon: DocumentMultiple_01,
      routeId: '/requests',
      children: [{
        title: $page => $page.data.basicRequestData ? `${$page.data.basicRequestData.applicant.fullname} (${$page.data.basicRequestData.period.name})` : 'Unknown Request',
        routeId: '/requests/[id]',
        children: [{
          title: 'Application',
          routeId: '/requests/[id]/apply',
          children: [{
            title: 'Review Your Submission',
            routeId: '/requests/[id]/apply/review'
          }]
        }, {
          title: `Review ${uiRegistry.getWord('appRequest')}`,
          routeId: '/requests/[id]/approve',
          children: [{
            title: 'Activity Log',
            routeId: '/requests/[id]/approve/activity'
          }]
        }]
      }]
    },
    {
      title: 'Admin Settings',
      group: 'Administration',
      hideFromSideNav: !access.viewRoleManagement,
      icon: Settings,
      routeId: '/roles',
      children: [{
        title: 'Roles Management',
        routeId: '/roles',
        children: [{
          title: $page => `Role: ${$page.data.role.name}`,
          routeId: '/roles/[id]'
        }, {
          title: 'Users',
          routeId: '/roles/users'
        }]
      }]
    },
    {
      title: 'Manage Periods',
      group: 'Administration',
      hideFromSideNav: !access.viewPeriodManagement,
      icon: Time,
      routeId: '/periods',
      children: [
        {
          title: 'Configure Period',
          routeId: '/periods/[id]/configure'
        }
      ]
    },
    ...(uiRegistry.config.extraNavItems ?? [])
  ]
}} profilelinks={[{ label: 'Logout', onClick: () => unifiedAuth.logout(api) }]}>
    <slot />
</UIShell>
