<script lang="ts">
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import { api } from '$lib'
  import { UIShell } from '@txstate-mws/carbon-svelte'
  import { Dashboard, Settings, RuleTest } from 'carbon-icons-svelte'
  import { uiRegistry } from '../local/index.js'
  import '../app.css'

  api.recordNavigations()
</script>

<UIShell appName={uiRegistry.config.appName} reverseWeights={!!PUBLIC_ENVIRONMENT} companyName={PUBLIC_ENVIRONMENT || 'TXST'} overlayText={PUBLIC_ENVIRONMENT} navRoot={{
  title: uiRegistry.config.applicantDashboardTitle ?? 'Applicant Dashboard',
  routeId: '/',
  children: [
    {
      title: 'User Management',
      group: 'Administration',
      icon: Settings,
      routeId: '/administration/usermanagement'
    },
    {
      title: 'Applicant',
      group: 'Dashboards',
      icon: Dashboard,
      routeId: '/dashboards/applicant'
    },
    {
      title: 'Administration',
      group: 'Dashboards',
      icon: Dashboard,
      routeId: '/dashboards/administration'
    },
    {
      title: 'File Upload',
      group: 'Test',
      icon: RuleTest,
      routeId: '/test/file/upload'
    },
    {
      title: 'File Download',
      group: 'Test',
      icon: RuleTest,
      routeId: '/test/file/download'
    },
    ...(uiRegistry.config.extraNavItems ?? [])
  ]
}} profilelinks={[{ label: 'Logout', href: '/logout' }]}>
    <slot />
</UIShell>
