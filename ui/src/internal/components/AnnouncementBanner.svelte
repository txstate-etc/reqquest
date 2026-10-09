<script lang="ts">
  import { InlineNotification, NotificationActionButton } from 'carbon-components-svelte'

  /** Short headline shown in bold. */
  export let subject: string
  /** Body text shown under the subject. */
  export let body: string
  /** Optional URL rendered as a ghost action button after the text. */
  export let link: string | null | undefined = undefined
  /** Visible text for the link. Required by the API whenever a link is given. */
  export let linkText: string | null | undefined = undefined
</script>

<!--
  Deliberately NOT carbon's default role="alert". The banner is ordinary page content that is
  already there when the applicant arrives, so it must be a labelled landmark that screen readers
  meet once in reading order (and can jump to), not a live region that announces itself and its
  link on insertion. NVDA was reading the link three times under role="alert". The prop type only
  admits alert|log|status, but the component forwards the string verbatim to the root div, hence
  the cast. The fixed label keeps the subject from being spoken twice (landmark name + title).
-->
<InlineNotification
  role={'region' as any}
  aria-label="Announcement"
  kind="warning"
  title={subject}
  subtitle={body}
  lowContrast
  hideCloseButton
  class="time-sensitive-banner"
>
  <svelte:fragment slot="actions">
    {#if link}
      <NotificationActionButton href={link}>{linkText}</NotificationActionButton>
    {/if}
  </svelte:fragment>
</InlineNotification>

<style>
  :global(div.time-sensitive-banner.bx--inline-notification) {
    min-width: unset;
    max-width: fit-content;
    flex-wrap: wrap;
    width: auto;
    align-items: center;
  }
</style>
