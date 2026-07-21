<script lang="ts">
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import { api } from '$internal'
  import { UIShell, ErrorPage } from '@txstate-mws/carbon-svelte'
  import { unifiedAuth } from '@txstate-mws/sveltekit-utils'
  import Dashboard from 'carbon-icons-svelte/lib/Dashboard.svelte'
  import DocumentMultiple_01 from 'carbon-icons-svelte/lib/DocumentMultiple_01.svelte'
  import Settings from 'carbon-icons-svelte/lib/Settings.svelte'
  import Time from 'carbon-icons-svelte/lib/Time.svelte'
  import type { LayoutData } from './$types.js'
  import { uiRegistry } from '../local/index.js'
  import { navigating } from '$app/stores';
  import { invalidateAll } from '$app/navigation'
  import { Loading } from "carbon-components-svelte";
  import '../app.css'

  api.recordNavigations()

  export let data: LayoutData
  $: ({ access, layoutError, canImpersonate } = data)
  const userProfileName = [access?.user?.fullname.slice(0, access?.user?.fullname.indexOf(' ')), access?.user?.fullname.slice(access?.user?.fullname.indexOf(' ') + 1)]
</script>
{#if $navigating}
	<Loading />
{/if}
<UIShell appName={uiRegistry.config.appName} reverseWeights={!!PUBLIC_ENVIRONMENT} companyName={PUBLIC_ENVIRONMENT || 'TXST'} overlayText={PUBLIC_ENVIRONMENT} navRoot={{
  title: uiRegistry.config.appName,
  hideFromSideNav: true,
  routeId: '/',
  children: [
    {
      title: uiRegistry.config.applicantDashboardTitle ?? 'Applicant Dashboard',
      navTitle: uiRegistry.config.applicantDashboardNavTitle ?? uiRegistry.config.applicantDashboardTitle ?? 'Applicant',
      group: 'Dashboards',
      hideFromSideNav: !access?.viewApplicantDashboard,
      icon: Dashboard,
      routeId: '/dashboards/applicant',
      children: [{
        title: uiRegistry.getWord('appRequest'),
        routeId: '/requests/[id]/apply',
        children: [{
          title: 'Review Your Submission',
          routeId: '/requests/[id]/apply/review'
        }, {
          title: 'Program Review',
          routeId: '/requests/[id]/apply/programs'
        }, {
          routeId: '/requests/[id]/apply/[promptId]',
          title: page => page.data.promptsById?.[page.data.prompt?.id]?.navTitle ?? 'Unknown Prompt'
        }]
      }]
    },
    {
      title: 'Reviewer',
      group: 'Dashboards',
      hideFromSideNav: !access?.viewReviewerInterface,
      icon: Dashboard,
      routeId: '/dashboards/reviewer'
    },
    {
      title: uiRegistry.getPlural('appRequest'),
      group: 'Administration',
      hideFromSideNav: !access?.viewAppRequestList,
      icon: DocumentMultiple_01,
      routeId: '/requests',
      children: [{
        title: $page => $page.data.basicRequestData ? `${$page.data.basicRequestData.applicant.fullname} (${$page.data.basicRequestData.period.name})` : 'Unknown Request',
        routeId: '/requests/[id]',
        children: [{
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
      hideFromSideNav: !access?.viewRoleManagement,
      icon: Settings,
      routeId: '/roles',
      children: [{
        title: $page => `Role: ${$page.data.role.name}`,
        routeId: '/roles/[id]'
      }, {
        title: 'Users',
        routeId: '/roles/users'
      }]
    },
    {
      title: `Manage ${uiRegistry.getPlural('period')}`,
      group: 'Administration',
      hideFromSideNav: !access?.viewPeriodManagement,
      icon: Time,
      routeId: '/periods',
      children: [
        {
          title: `Configure ${uiRegistry.getWord('period')}`,
          routeId: '/periods/[id]/configure'
        }
      ]
    },
    ...(uiRegistry.config.extraNavItems ?? [])
  ]
}}
profilelinks={[{ label: 'Logout', onClick: () => unifiedAuth.logout(api) }]}
userProfile={{firstName: userProfileName?.[0] ?? access?.user?.login ?? '', lastName: userProfileName?.[1] ?? ''}}
impersonate={{
  canImpersonate: !!canImpersonate && !!uiRegistry.config.userLookup, // only show impersonation option if user has permission and userLookup function is provided
  userLookup: async (login) => (uiRegistry.config.userLookup) ? await uiRegistry.config.userLookup(login) : undefined, // use the userLookup function from the registry to find the user profile based on login
  impersonate: async (login) => {
    if (!login) return
    await unifiedAuth.impersonate(api, login)
    invalidateAll()
  },
  endImpersonate: async () => {
    unifiedAuth.exitImpersonation(api)
    await invalidateAll()
  },
  isImpersonating: unifiedAuth.getImpersonationStatus(api).isImpersonating
}}
>
  {#if layoutError}
    <ErrorPage error={layoutError} />
  {:else}
    <slot />
  {/if}
</UIShell>
