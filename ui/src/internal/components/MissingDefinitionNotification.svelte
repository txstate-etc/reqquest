<script lang="ts">
  /**
   * Shown where a form or configuration component would go, when the API returned a key this UI
   * has no definition for. The API and UI are deployed as separate images and can be built from
   * different commits, so this is reachable in production no matter how good the build-time checks
   * get. Naming the key here is the difference between "this page is broken" and a bug report an
   * operator can act on.
   */
  import { InlineNotification } from 'carbon-components-svelte'

  export let kind: 'prompt' | 'requirement' | 'program' = 'prompt'
  export let definitionKey: string

  // built here rather than inline: an attribute holding both `{definitionKey}` and a backtick
  // reads as a template literal to the svelte parser
  $: title = `This ${kind} is unavailable:`
  $: subtitle = `No ${kind} component is registered for "${definitionKey}". This usually means the application was updated but this screen was not. Please contact support.`
</script>

<InlineNotification kind="error" {title} {subtitle} lowContrast hideCloseButton />
