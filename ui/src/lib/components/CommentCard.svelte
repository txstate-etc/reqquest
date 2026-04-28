<script lang="ts">
  import { ActionSet, type ActionItem } from '@txstate-mws/carbon-svelte'
  import { DateTime } from 'luxon'

  /**
   * The HTML content of the comment.
   * @type {string}
   */
  export let content: string

  /**
   * The full name of the author.
   * @type {string}
   */
  export let authorName: string

  /**
   * The login name of the author (e.g. netid). Optional.
   * @type {string | undefined}
   */
  export let authorLogin: string | undefined = undefined

  /**
   * The timestamp this comment was created. Accepts a Luxon DateTime or an ISO string.
   * @type {DateTime | string}
   */
  export let createdAt: DateTime | string

  /**
   * Actions available on this comment (shown as an overflow menu in the top right).
   * @type {ActionItem[]}
   */
  export let actions: ActionItem[] = []

  /**
   * If true, the comment box will not have a background, drop shadow, or padding.
   * Use this when rendering a comment in a context that already provides its own framing.
   * @type {boolean}
   */
  export let noborder = false

  $: createdAtDt = typeof createdAt === 'string' ? DateTime.fromISO(createdAt) : createdAt
</script>

<div class="comment-card">
  <div class="comment-box" class:noborder class:hasactions={actions.length > 0}>
    <div class="comment-content">{@html content}</div>
    {#if actions.length}
      <div class="comment-actions">
        <ActionSet {actions} noPrimaryAction small forceOverflow />
      </div>
    {/if}
  </div>
  <div class="comment-meta">
    {authorName}{#if authorLogin}&nbsp;({authorLogin}){/if} &middot; {createdAtDt.toFormat('f')}
  </div>
</div>

<style>
  .comment-card {
    display: flex;
    flex-direction: column;
  }
  .comment-box {
    position: relative;
    background: white;
    padding: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
  .comment-box.hasactions {
    padding-right: 2.5rem;
  }
  .comment-box.noborder {
    background: transparent;
    padding: 0;
    box-shadow: none;
  }
  .comment-box.noborder.hasactions {
    padding-right: 2.5rem;
  }
  .comment-content :global(p) {
    margin: 0;
    font-size: 100%;
  }
  .comment-actions {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
  }
  .comment-meta {
    font-size: 0.75rem;
    color: var(--cds-text-02);
    margin-top: 0.25rem;
  }
</style>
