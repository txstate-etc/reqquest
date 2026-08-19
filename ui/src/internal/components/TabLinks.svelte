<!--
  @component
  Local replacement for `TabLinks` from `@txstate-mws/carbon-svelte`, adding support for tabs that
  are not destinations. A tab with an `href` behaves exactly like the library's - a link that
  highlights itself when it matches the current path. A tab **without** an `href` renders as a
  disclosure button that toggles a dropdown panel.

  The dropdown content travels with the item itself, as its `panel` snippet, which is handed a
  `close` callback. Snippets can only be declared in markup, so a consumer that builds its tab array
  in `<script>` composes the snippet onto the entry at the point of use:

  ```svelte
  {#snippet ineligibleList(close)}
    <ul>...</ul>
  {/snippet}
  <TabLinks tabs={[...others, { label: 'Ineligible programs', panel: ineligibleList }]} />
  ```

  The panel is positioned absolutely over the page content, left-aligned to the tab that opened it.
  It closes on outside click, Escape, navigation, and horizontal scrolling of the tab strip.
-->
<script context="module" lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * One tab in a `TabLinks` set. Superset of the library's `TabLinkItem`, where `href` is required.
   */
  export interface TabLinkItem {
    /** The label text for the tab. */
    label: string
    /** Optional icon component to display before the label. */
    icon?: any
    /**
     * The URL the tab points to. Omit to make this tab a disclosure button that toggles its
     * `panel` instead of navigating.
     */
    href?: string
    /** Whether the tab is disabled. */
    disabled?: boolean
    /**
     * Force the selected state, for when the active route is not this tab's own href. Defaults to
     * whether `href` matches the current path.
     */
    selected?: boolean
    /**
     * Content revealed in a dropdown when this tab is clicked, passed a `close` callback. Only
     * used when `href` is omitted, since a tab with an `href` navigates instead of opening.
     */
    panel?: Snippet<[close: () => void]>
  }

  let uidCounter = 0
</script>

<script lang="ts">
  import { ScrollOverflow } from '@txstate-mws/carbon-svelte'
  import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte'
  import { onMount, tick } from 'svelte'
  import { browser } from '$app/environment'
  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/stores'

  /**
   * Array of TabLinkItem's included in the set.
   * @type {TabLinkItem[]}
   */
  export let tabs: TabLinkItem[] = []

  /**
   * Index of the tab whose dropdown panel is open, or -1 when none is open. Only tabs without an
   * `href` can be open.
   * @type {number}
   * @default -1
   */
  export let openIndex = -1

  const uid = `tablinks-${++uidCounter}`
  const tabElements: HTMLElement[] = []
  let scrollOverflow: ScrollOverflow
  let wrapperEl: HTMLElement
  let panelEl: HTMLElement | undefined
  let panelLeft = 0
  let mounted = false

  $: activeIdx = tabs.findIndex(tab => tab.href != null && tab.href === $page.url.pathname)
  // a tab with an href can never be open, so shifting indices can't strand an open panel
  $: openTab = tabs[openIndex]?.href == null ? tabs[openIndex] : undefined

  onMount(async () => {
    await tick()
    if (activeIdx >= 0 && tabElements[activeIdx]) {
      scrollOverflow?.scrollToElement(tabElements[activeIdx], 'auto')
    }
    mounted = true
  })

  afterNavigate(() => { close() })

  $: if (mounted && $page.url.pathname) {
    if (activeIdx >= 0 && tabElements[activeIdx]) {
      void tick().then(() => {
        scrollOverflow?.scrollToElement(tabElements[activeIdx])
      })
    }
  }

  function positionPanel () {
    const tabEl = tabElements[openIndex]
    if (!wrapperEl || !tabEl) return
    panelLeft = Math.max(0, tabEl.getBoundingClientRect().left - wrapperEl.getBoundingClientRect().left)
  }

  async function toggle (idx: number) {
    openIndex = openIndex === idx ? -1 : idx
    await tick()
    positionPanel()
  }

  function close (returnFocus = false) {
    if (openIndex < 0) return
    const tabEl = tabElements[openIndex]
    openIndex = -1
    if (returnFocus) tabEl?.querySelector('button')?.focus()
  }

  function onScroll (e: Event) {
    if (panelEl?.contains(e.target as Node)) return
    close()
  }

  function onWindowClick (e: MouseEvent) {
    if (openIndex < 0) return
    if (!wrapperEl?.contains(e.target as Node)) close()
  }

  function onWindowKeyDown (e: KeyboardEvent) {
    if (openIndex < 0 || e.key !== 'Escape') return
    e.preventDefault()
    close(true)
  }
</script>

<svelte:window on:click={onWindowClick} on:keydown={onWindowKeyDown} on:resize={positionPanel} />

{#if tabs.length}
  <!-- scroll doesn't bubble but does capture; the tab strip scrolling would drift the panel anchor -->
  <div bind:this={wrapperEl} class="cs-tabs tab-links" on:scroll|capture={onScroll}>
    <div {...$$restProps} role="navigation" class="[ w-full ] {$$restProps.class ?? ''}" class:bx--tabs={true}><ScrollOverflow bind:this={scrollOverflow}><div role="list" class:bx--tabs__nav={true}>
      {#each tabs as tab, i}
        {@const selected = browser && (tab.selected ?? (tab.href != null && tab.href === $page.url.pathname))}
        <div bind:this={tabElements[i]} role="listitem"
          class:bx--tabs__nav-item={true}
          class:bx--tabs__nav-item--disabled={tab.disabled}
          class:bx--tabs__nav-item--selected={selected || openIndex === i}
        >
          {#if tab.href != null}
            <a
              href={tab.href}
              aria-disabled={tab.disabled}
              class:bx--tabs__nav-link={true}
              class:auto-width={true}
            >
              {#if tab.icon}
                <span class="icon">
                  <svelte:component this={tab.icon} />
                </span>
              {/if}
              {tab.label}
            </a>
          {:else}
            <button
              type="button"
              id={`${uid}-tab-${i}`}
              disabled={tab.disabled}
              aria-expanded={openIndex === i}
              aria-controls={`${uid}-panel`}
              class:bx--tabs__nav-link={true}
              class:auto-width={true}
              on:click={() => { void toggle(i) }}
            >
              {#if tab.icon}
                <span class="icon">
                  <svelte:component this={tab.icon} />
                </span>
              {/if}
              {tab.label}
              <span class="caret" class:open={openIndex === i}>
                <ChevronDown aria-hidden={true} />
              </span>
            </button>
          {/if}
        </div>
      {/each}
    </div></ScrollOverflow></div>
    {#if openTab?.panel}
      <div
        bind:this={panelEl}
        id={`${uid}-panel`}
        class="tab-panel"
        style:left="{panelLeft}px"
        role="group"
        aria-labelledby={`${uid}-tab-${openIndex}`}
      >
        {@render openTab.panel!(() => { close() })}
      </div>
    {/if}
  </div>
{/if}

<style>
  .cs-tabs.tab-links {
    position: relative;
  }
  .icon {
    display: inline-block;
    margin-right: 8px;
    vertical-align: text-bottom;
  }
  /* carbon styles bx--tabs__nav-link for an anchor, so undo the button chrome */
  button.bx--tabs__nav-link {
    display: flex;
    align-items: center;
    background: none;
    border: 0;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  button.bx--tabs__nav-link:disabled {
    cursor: default;
  }
  .caret {
    display: inline-flex;
    margin-left: 4px;
    transition: transform 110ms;
  }
  .caret.open {
    transform: rotate(180deg);
  }
  .tab-panel {
    position: absolute;
    top: 100%;
    z-index: 100;
    min-width: -moz-max-content;
    min-width: max-content;
    max-width: 100%;
    background-color: var(--cds-ui-01, #f4f4f4);
    border: 1px solid var(--cds-ui-03, #e0e0e0);
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
  }
</style>
