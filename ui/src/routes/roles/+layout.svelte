<script lang="ts">
  import { TabLinks } from '@txstate-mws/carbon-svelte'
    import type { LayoutData } from './$types'
  export let data: LayoutData
  $: ({ showTabs } = data)
  const tabs = [
    { label: 'Role Management', href: '/roles' },
    { label: 'Users', href: '/roles/users' }
  ]
</script>
<div class="flow">
{#if showTabs}
  <TabLinks {tabs} />
{/if}
  <slot />
</div>
