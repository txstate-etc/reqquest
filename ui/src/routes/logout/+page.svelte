<script lang="ts">
  import { api } from '$lib'
  import { unifiedAuth } from '@txstate-mws/sveltekit-utils'

  unifiedAuth.logout(api)
</script>
