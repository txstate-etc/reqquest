<script lang="ts">
  import type { CardSelectItem } from '$lib/components/FieldCardRadio.svelte'
  import { Card, CardGrid, FormInlineNotification } from '@txstate-mws/carbon-svelte'
  import { FORM_CONTEXT, FORM_INHERITED_PATH, Field, type FormStore } from '@txstate-mws/svelte-forms'
  import { Store } from '@txstate-mws/svelte-store'
  import { createEventDispatcher, getContext } from 'svelte'
  import { equal, get, isNotBlank } from 'txstate-utils'

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
   * Whether the field group is conditional
   * @type {boolean}
   * @default true
   */
  export let conditional = true

  /**
   * Set to true to prevent null/undefined values (will default to empty array)
   * @type {boolean}
   * @default false
   */
  export let notNull = false

  /**
   * Default selected values (array)
   * @type {any[]}
   * @default []
   */
  export let defaultValue: any[] = []

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
   * Custom function to serialize individual item values for form submission.
   * Each item value is serialized independently before being stored in the array.
   * @type {((value: any) => string) | undefined}
   * @default undefined
   */
  export let serialize: ((value: any) => string) | undefined = undefined

  /**
   * Custom function to deserialize individual item values from form data.
   * Each item value is deserialized independently after being retrieved from the array.
   * @type {((value: string) => any) | undefined}
   * @default undefined
   */
  export let deserialize: ((value: string) => any) | undefined = undefined

  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')

  const itemStore = new Store(items)
  $: itemStore.set(items)

  // Array serialization wrappers - apply serialize/deserialize to each item
  function arraySerialize (vals: any): any {
    return serialize ? vals.map(serialize) : vals
  }
  function arrayDeserialize (vals: any): any {
    return deserialize ? vals.map(deserialize) : vals
  }

  function isSelected (itemValue: any, currentValues: any[] | undefined | null): boolean {
    if (!currentValues) return false
    return currentValues.some(v => equal(v, itemValue))
  }

  function toggleSelect (item: CardSelectItem, currentValues: any[] | undefined | null, setVal: (val: any) => void) {
    return () => {
      if (item.disabled) return
      const current = currentValues ?? []
      const itemVal = item.value
      let newValue: any[]

      if (isSelected(itemVal, current)) {
        newValue = current.filter(v => !equal(v, itemVal))
      } else {
        newValue = [...current, itemVal]
      }

      setVal(newValue)
      dispatch('update', newValue)
    }
  }

  async function reactToItems (..._: any[]) {
    if (!items.length) {
      return await store.setField(finalPath, [], { notDirty: true })
    }
    const val = get($store.data, finalPath) as any[] | undefined
    if (val == null) {
      return await store.setField(finalPath, [], { notDirty: true })
    }
    if (val.length > 0) {
      const validValues = val.filter(v => items.some(item => equal(item.value, v)))
      if (validValues.length !== val.length) {
        await store.setField(finalPath, validValues, { notDirty: true })
      }
    }
  }
  $: reactToItems($itemStore).catch(console.error)

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
    return startIdx // All disabled
  }

  function focusCard (idx: number) {
    if (idx >= 0 && idx < items.length && !items[idx]?.disabled) {
      activeIdx = idx
      cardElements[idx]?.focus()
    }
  }

  function handleKeyDown (e: KeyboardEvent, idx: number, currentValues: any[], setVal: (val: any) => void) {
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
        toggleSelect(items[idx], currentValues, setVal)()
      }
      break
    }
  }
</script>
<!--
  @component

  A form field component that displays a grid of selectable cards (multiple selection).
  Similar to FieldCardRadio but allows selecting multiple cards (checkbox behavior).

  The form value is an array of selected item values.

  By default this component expects values to be strings. If you wish to use other types of values, you
  must provide a `serialize` and `deserialize` function that handle individual item values.

  If your `items` are not ready on first load (e.g. they're being loaded from an API fetch), you must
  place this field inside an `{#if}` block until they are ready.
-->
<Field {path} {notNull} {conditional} {defaultValue} serialize={arraySerialize} deserialize={arrayDeserialize} let:messages let:value let:invalid let:onBlur let:setVal>
  <div on:focusin={() => dispatch('focus')} on:focusout={() => { onBlur(); dispatch('blur') }}>
    <fieldset class="card-select-fieldset">
      {#if legendText}
        <legend class="bx--label">{legendText}{#if required} <span aria-hidden="true"> *</span>{/if}</legend>
      {/if}
      <CardGrid {cardSize} {gap}>
        {#each $itemStore as item, index (item.value)}
          {@const selected = isSelected(item.value, value)}
          <div
            bind:this={cardElements[index]}
            class="selectable-card"
            class:selected
            class:disabled={item.disabled}
            role="checkbox"
            aria-checked={selected}
            aria-disabled={item.disabled}
            tabindex={item.disabled ? -1 : (index === activeIdx ? 0 : -1)}
            on:click={toggleSelect(item, value, setVal)}
            on:keydown={e => handleKeyDown(e, index, value ?? [], setVal)}
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
              <span class="checkbox-square" class:checked={selected}>
                {#if selected}
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1z"/>
                  </svg>
                {/if}
              </span>
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

  .checkbox-square {
    width: 1.125rem;
    height: 1.125rem;
    border: 2px solid var(--cds-icon-01, #161616);
    border-radius: 2px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }

  .checkbox-square.checked {
    background-color: var(--cds-interactive-01, #0f62fe);
    border-color: var(--cds-interactive-01, #0f62fe);
  }

  .checkbox-square svg {
    width: 0.75rem;
    height: 0.75rem;
    color: white;
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
