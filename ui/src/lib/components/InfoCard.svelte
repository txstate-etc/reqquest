<script lang="ts">
  import { TagSet, type ActionItem, type TagItem } from '@txstate-mws/carbon-svelte'
  import { modifierKey } from '@txstate-mws/svelte-components'
  import Button from 'carbon-components-svelte/src/Button/Button.svelte'
  import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte'
  import { afterUpdate, getContext } from 'svelte'
  import { randomid } from 'txstate-utils'

  /**
   * The title of the component.
   * @type {string}
   */
  export let title: string

  /**
   * The subheading for the component, which is optional.
   * @type {string | undefined}
   */
  export let subhead: string | undefined = undefined

  /**
   * Adds visual emphasis to the title
   * @type {boolean}
   */
  export let emphasizeTitle = false

  /**
   * Combined actions and navigations rendered as buttons at the bottom of the card.
   * @type {ActionItem[]}
   */
  export let actions: ActionItem[] = []

  /**
   * Prevents the first button from having primary styling.
   * @type {boolean}
   */
  export let noPrimaryAction = false

  /**
   * Array of tag items to display on the card.
   * @type {TagItem[]}
   */
  export let tags: TagItem[] = []

  /**
   * Determines whether the tags should be displayed in the body of the card.
   * @type {boolean}
   */
  export let tagsInBody = false

  /**
   * The ARIA role for the card. Defaults to 'listitem' when nested inside a CardGrid, 'region' otherwise.
   * @type {string | undefined}
   */
  export let role: string | undefined = undefined

  const isInCardGrid = getContext('card-grid') || false
  $: ariaRole = role ?? (isInCardGrid ? 'listitem' : 'region')

  let activeAction = 0
  const actionelements: (HTMLButtonElement | HTMLAnchorElement)[] = []

  function actionActivate (idx: number) {
    activeAction = idx
    actionelements[idx].focus()
  }

  function actionUp () {
    const nextIdx = activeAction - 1
    if (nextIdx >= 0 && nextIdx !== activeAction) actionActivate(nextIdx)
  }

  function actionDown () {
    const nextIdx = activeAction + 1
    if (nextIdx < actions.length && nextIdx !== activeAction) {
      actionActivate(nextIdx)
    }
  }

  function actionClick (action: ActionItem) {
    return (e: MouseEvent) => {
      if (action.disabled) e.preventDefault()
      else void action.onClick?.()
    }
  }

  function actionKeyDown (e: KeyboardEvent) {
    if (modifierKey(e)) return
    if (e.key.startsWith('Arrow')) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') actionUp()
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') actionDown()
  }

  afterUpdate(() => {
    for (const btn of actionelements) {
      btn?.removeEventListener('keydown', actionKeyDown as any)
      btn?.addEventListener('keydown', actionKeyDown as any)
    }
  })

  const titleId = randomid()
</script>

<div
  role={ariaRole}
  class="info-card shadow [ flex flex-col ]"
  aria-labelledby={titleId}
>
  <header class="info-card-header [ flex items-start justify-between p-[8px] ]">
    <div class="info-card-header-left [ flex-grow flex-shrink ]">
      <div
        id={titleId}
        class="info-card-title [ text-lg font-bold ]"
        class:emphasizeTitle
      >
        {title}
      </div>
      {#if subhead}<div class="info-card-subhead">{subhead}</div>{/if}
    </div>
    <div class="info-card-header-right">
      <slot name="header-right" />
    </div>
  </header>

  {#if tags.length}
    <TagSet {tags} describedById={titleId} class={tagsInBody ? 'info-card-tags' : 'info-card-tags hasbg'} />
  {/if}

  <div class="info-card-content [ p-[8px] ]">
    <slot />
  </div>

  {#if actions.length}
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <div
      class="info-card-footer [ flex flex-wrap flex-row-reverse ]"
      class:singular={actions.length === 1}
      role="menubar"
    >
      {#each actions as action, i}
        <Button
          bind:ref={actionelements[i]}
          href={action.href}
          size="field"
          role="menuitem"
          aria-disabled={action.disabled}
          aria-describedby={titleId}
          tabindex={(i === activeAction ? 0 : -1) as any}
          icon={action.icon ?? ChevronRight}
          kind={noPrimaryAction || i > 0 ? 'secondary' : 'primary'}
          class="info-card-action [ w-full ] {action.disabled ? 'bx--btn--disabled' : ''}"
          on:click={actionClick(action)}
        >{action.label}</Button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .info-card {
    border: 2px solid #e7e5e4;
  }
  .info-card-header {
    background-color: #e7e5e4;
  }
  .info-card-title {
    margin-block-start: 0;
    width: fit-content;
  }
  .info-card-title.emphasizeTitle {
    background-color: #d8d0cf;
    padding: 0 8px;
  }
  .info-card :global(.info-card-tags) {
    padding: 8px;
  }
  .info-card :global(.info-card-tags > *) {
    max-width: calc(50% - 2px);
  }
  .info-card :global(.info-card-tags.hasbg) {
    padding-top: 0;
    background-color: #e7e5e4;
  }
  .info-card-footer {
    margin-block-start: auto;
    gap: 1px;
  }
  .info-card .info-card-footer > :global(*) {
    flex-grow: 1;
    flex-basis: calc((300px - 100%) * 999);
    min-width: 100px;
    max-width: 100%;
    border: 0;
  }
  .info-card .info-card-footer.singular > :global(*) {
    width: 100%;
  }
  /* 3 items get a higher threshold so they stack earlier */
  .info-card .info-card-footer > :global(:nth-last-child(n + 3)),
  .info-card .info-card-footer > :global(:nth-last-child(n + 3) ~ *) {
    flex-basis: calc((400px - 100%) * 999);
  }
  .info-card .info-card-footer > :global(:nth-last-child(n + 4)),
  .info-card .info-card-footer > :global(:nth-last-child(n + 4) ~ *) {
    flex-basis: 100%;
  }
</style>
