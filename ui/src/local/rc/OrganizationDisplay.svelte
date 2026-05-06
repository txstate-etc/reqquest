<script lang="ts">
  import type { Organization } from "./types"

  export let data: Organization
</script>
<p class="text-xs">Describe a time you had to lead organization efforts or act as a coordinator (this could be for school, an event, a group project, etc.)</p>
<p>{data?.describeOrganization}</p>
