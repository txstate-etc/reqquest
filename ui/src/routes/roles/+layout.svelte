<script lang="ts">
  import { TabLinks } from '@txstate-mws/carbon-svelte'
  const tabs = [
    { label: 'Roles', href: `/roles` },
    { label: 'Users', href: `/roles/users` },
  ]
</script>
<div class="flow">
  <TabLinks {tabs} />
  <slot />
</div>