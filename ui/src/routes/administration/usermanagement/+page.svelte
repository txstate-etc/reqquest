<script>
  import { Tabs, Tab, TabContent, Button } from "carbon-components-svelte";

  let selected = 0;
</script>
<div class="flex bg-gray-100 w-full">
	<div class="flex w-full flex-row items-center justify-center px-5 text-gray-700 ">
    <div class="w-full py-4 px-4">
      <h2 class="text-2xl">User Management</h2>
      <Tabs autoWidth bind:selected>
        <Tab label="Users" />
        <Tab label="Roles" />
        <svelte:fragment slot="content">
          <TabContent>* Planning as a list of all users, searchable by sub/netid/name showing roles and last access.  Actions of add/remove from role</TabContent>
          <TabContent>* Planning as a drop down selection of a role to view all users within.  Actions of add / remove users to role in bulk</TabContent>
        </svelte:fragment>
      </Tabs>

      <div style="margin: var(--cds-layout-01) 0">
        <Button on:click={() => (selected = (selected === 1) ? 0 : 1)}>Toggle Index</Button>
      </div>

      <strong>Selected index:</strong>
      {selected}
    </div>
  </div>
</div>

