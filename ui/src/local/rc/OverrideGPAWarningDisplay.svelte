<script lang="ts">
  import { FormInlineNotification } from '@txstate-mws/carbon-svelte'
  import { statusReasonsToFeedback, type StatusReason } from '$lib' // downstream projects import these from '@reqquest/ui'

  export let data: { override?: boolean } | undefined = undefined
  export let statusReasons: StatusReason[] = []
</script>

<p class="text-sm">Override the minimum GPA requirement: {data?.override ? 'Yes' : 'No'}</p>
{#each statusReasonsToFeedback(statusReasons, { blamedOnly: true }) as message}
  <FormInlineNotification {message} />
{/each}
