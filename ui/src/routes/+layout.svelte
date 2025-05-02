<script lang="ts">
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import { api } from '$lib'
  import { UIShell } from '@txstate-mws/carbon-svelte'
  import { Dashboard, DocumentMultiple_01, Settings, Time } from 'carbon-icons-svelte'
  import { uiRegistry } from '../local/index.js'
  import '../app.css'

  api.recordNavigations()
</script>

<UIShell appName={uiRegistry.config.appName} reverseWeights={!!PUBLIC_ENVIRONMENT} companyName={PUBLIC_ENVIRONMENT || 'TXST'} overlayText={PUBLIC_ENVIRONMENT} navRoot={{
  title: uiRegistry.config.applicantDashboardTitle ?? 'Applicant Dashboard',
  routeId: '/',
  children: [
    {
      title: 'Applicant',
      group: 'Dashboards',
      icon: Dashboard,
      routeId: '/'
    },
    {
      title: 'Reviewer',
      group: 'Dashboards',
      icon: Dashboard,
      routeId: '/reviewdash'
    },
    {
      title: 'App Requests',
      group: 'Administration',
      icon: DocumentMultiple_01,
      routeId: '/requests'
    },
    {
      title: 'Manage Roles',
      group: 'Administration',
      icon: Settings,
      routeId: '/roles'
    },
    {
      title: 'Manage Periods',
      group: 'Administration',
      icon: Time,
      routeId: '/periods'
    },
    ...(uiRegistry.config.extraNavItems ?? [])
  ]
}} profilelinks={[{ label: 'Logout', href: '/logout' }]}>
    <slot />
</UIShell>
