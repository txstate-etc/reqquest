<script context="module" lang="ts">
  import type { CardImage, TagItem } from '@txstate-mws/carbon-svelte'

  export interface CardSelectItem {
    value: any
    title: string
    subhead?: string
    image?: CardImage
    tags?: TagItem[]
    disabled?: boolean
    selectionLabel?: string
  }
</script>

<script lang="ts">
  import { FORM_CONTEXT, FORM_INHERITED_PATH, Field, type FormStore } from '@txstate-mws/svelte-forms'
  import { Store } from '@txstate-mws/svelte-store'
  import { createEventDispatcher, getContext } from 'svelte'
  import { get, isNotBlank, equal } from 'txstate-utils'
  import { Card, CardGrid, FormInlineNotification } from '@txstate-mws/carbon-svelte'

  const dispatch = createEventDispatcher()

  /**
   * Path to the form field in the data structure
   * @type {string}
   */
  export let path: string

  /**
   * Array of card options
   * @type {CardSelectItem[]}
   */
  export let items: CardSelectItem[]

  /**
   * Set to true to treat the value as a number instead of string
   * @type {boolean}
   * @default false
   */
  export let number = false

  /**
   * Set to true to treat the value as a boolean
   * @type {boolean}
   * @default false
   */
  export let boolean = false

  /**
   * Set to true to prevent null values
   * @type {boolean}
   * @default false
   */
  export let notNull = false

  /**
   * Whether the field group is conditional
   * @type {boolean}
   * @default true
   */
  export let conditional = true

  /**
   * Default selected value
   * @type {any}
   * @default undefined
   */
  export let defaultValue: any = undefined

  /**
   * Text to display in the fieldset legend
   * @type {string | undefined}
   * @default undefined
   */
  export let legendText: string | undefined = undefined

  /**
   * When true, the field is marked as required in the UI. This is only for visual indication
   * and does not affect validation. Validation is handled by the API that receives the data.
   * @type {boolean}
   * @default false
   */
  export let required = false

  /**
   * CSS size for the grid minimum item width (like CardGrid)
   * @type {string}
   * @default '20rem'
   */
  export let cardSize = '20rem'

  /**
   * Gap between cards in the grid
   * @type {string}
   * @default '16px'
   */
  export let gap = '16px'

  /**
   * Custom function to serialize values for form submission
   * @type {((value: any) => string) | undefined}
   * @default undefined
   */
  export let serialize: ((value: any) => string) | undefined = undefined

  /**
   * Custom function to deserialize values from form data
   * @type {((value: string) => any) | undefined}
   * @default undefined
   */
  export let deserialize: ((value: string) => any) | undefined = undefined

  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')

  const itemStore = new Store(items)
  $: itemStore.set(items)

  let finalSerialize: ((value: any) => string) | undefined
  let finalDeserialize: ((value: string) => any) | undefined

  function onSelect (item: CardSelectItem) {
    return () => {
      if (item.disabled) return
      const deserialized = item.value
      void store.setField(finalPath, deserialized)
      dispatch('update', deserialized)
    }
  }

  async function reactToItems (..._: any[]) {
    if (!finalDeserialize) return
    if (!items.length) {
      return await store.setField(finalPath, finalDeserialize(''), { notDirty: true })
    }
    const val = get($store.data, finalPath)
    if (!items.some(o => equal(o.value, val))) {
      await store.setField(finalPath, notNull && items.some(o => equal(o.value, defaultValue)) ? defaultValue : finalDeserialize(''), { notDirty: true })
    }
  }
  $: reactToItems($itemStore, finalDeserialize).catch(console.error)

  // Keyboard navigation
  let activeIdx = 0
  const cardElements: HTMLDivElement[] = []

  function findNextEnabled (startIdx: number, direction: 1 | -1): number {
    let idx = startIdx
    let attempts = 0
    while (attempts < items.length) {
      idx = (idx + direction + items.length) % items.length
      if (!items[idx]?.disabled) return idx
      attempts++
    }
    return startIdx // All disabled, stay put
  }

  function focusCard (idx: number) {
    if (idx >= 0 && idx < items.length && !items[idx]?.disabled) {
      activeIdx = idx
      cardElements[idx]?.focus()
    }
  }

  function handleKeyDown (e: KeyboardEvent, idx: number) {
    switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      focusCard(findNextEnabled(idx, 1))
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      focusCard(findNextEnabled(idx, -1))
      break
    case ' ':
    case 'Enter':
      e.preventDefault()
      if (!items[idx]?.disabled) {
        onSelect(items[idx])()
      }
      break
    }
  }
</script>
<!--
  @component

  A form field component that displays a grid of selectable cards (single selection).
  Similar to FieldRadioTile but with richer card-based visuals including images and tags.

  By default this component expects values to be strings. If you wish to use other types of values, you
  must provide a `serialize` and `deserialize` function. If you set the `number` prop, an appropriate
  serializer and deserializer will be provided by default.

  If your `items` are not ready on first load (e.g. they're being loaded from an API fetch), you must
  place this field inside an `{#if}` block until they are ready.
-->
<Field {path} {notNull} {conditional} {defaultValue} {boolean} {number} {serialize} {deserialize} bind:finalSerialize bind:finalDeserialize let:messages let:value let:invalid let:onBlur>
  <div on:focusin={() => dispatch('focus')} on:focusout={() => { onBlur(); dispatch('blur') }}>
    <fieldset class="card-select-fieldset">
      {#if legendText}
        <legend class="bx--label">{legendText}{#if required} <span aria-hidden="true"> *</span>{/if}</legend>
      {/if}
      <CardGrid {cardSize} {gap}>
        {#each $itemStore as item, index (item.value)}
          {@const selected = finalSerialize ? value === finalSerialize(item.value) : equal(value, item.value)}
          <div
            bind:this={cardElements[index]}
            class="selectable-card"
            class:selected
            class:disabled={item.disabled}
            role="radio"
            aria-checked={selected}
            aria-disabled={item.disabled}
            tabindex={item.disabled ? -1 : (index === activeIdx ? 0 : -1)}
            on:click={onSelect(item)}
            on:keydown={e => handleKeyDown(e, index)}
          >
            <Card
              title={item.title}
              subhead={item.subhead}
              image={item.image}
              tags={item.tags ?? []}
              actions={[]}
              navigations={[]}
            >
              <slot {item} {selected} {index} />
            </Card>
            <div class="selection-indicator justify-center">
              <span class="radio-circle" class:checked={selected}></span>
              <span class="selection-label">{item.selectionLabel ?? 'Choose this option'}</span>
            </div>
          </div>
        {/each}
      </CardGrid>
    </fieldset>
  </div>
  {#each messages as message (message)}
    <FormInlineNotification {message} />
  {/each}
</Field>

<style>
  .card-select-fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }

  .selectable-card {
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .selectable-card:focus-visible {
    outline: 2px solid var(--cds-focus, #0f62fe);
    outline-offset: 2px;
  }

  .selectable-card:hover:not(.disabled) {
    border-color: var(--cds-interactive-03, #0353e9);
  }

  .selectable-card.selected {
    border-color: var(--cds-interactive-01, #0f62fe);
  }

  .selectable-card.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .selection-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: var(--cds-ui-01, #f4f4f4);
    border-top: 1px solid var(--cds-ui-03, #e0e0e0);
  }

  .radio-circle {
    width: 1.125rem;
    height: 1.125rem;
    border: 2px solid var(--cds-icon-01, #161616);
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
  }

  .radio-circle.checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--cds-interactive-01, #0f62fe);
    border-radius: 50%;
  }

  .selection-label {
    font-size: 0.875rem;
    color: var(--cds-text-01, #161616);
  }

  /* Remove Card's default border when inside selectable-card */
  .selectable-card :global(.card) {
    border: none;
    box-shadow: none;
  }
</style>
