<script lang="ts" context="module">
  export interface NestedMultiselectChild {
    value: any
    label: string
  }
  export interface NestedMultiselectItem extends NestedMultiselectChild {
    children?: NestedMultiselectChild[]
  }
</script>

<script lang="ts">
  import { Field, jsonDeserialize, jsonSerialize } from '@txstate-mws/svelte-forms'
  import { Checkbox, FloatingPortal } from 'carbon-components-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import { onDestroy, tick } from 'svelte'
  import { equal, randomid } from 'txstate-utils'

  /**
   * Path to the array in the form data.
   * @type {string}
   */
  export let path: string

  /**
   * Label shown above the trigger. Also used as the accessible name of the popover.
   * @type {string}
   */
  export let labelText: string

  /**
   * Text shown on the trigger button.
   * @type {string}
   * @default 'Choose one or more'
   */
  export let placeholder = 'Choose one or more'

  /**
   * Top-level options. Each may carry `children`, rendered indented beneath it. A parent and its
   * children are independent selections - checking a child does not check the parent.
   * @type {NestedMultiselectItem[]}
   */
  export let items: NestedMultiselectItem[] = []

  /**
   * Hide the visible label (it stays available as the popover's accessible name).
   * @type {boolean}
   * @default false
   */
  export let hideLabel = false

  export let conditional = true
  export let defaultValue: any[] = []
  export let required = false
  export let disabled = false

  const id = randomid()
  const panelId = randomid()

  let open = false
  let buttonRef: HTMLButtonElement | null = null
  let portalRef: HTMLElement | null = null

  // values are objects, so each entry is stored as JSON in the form state
  // same loose typing as carbon-svelte's FieldMultiselect: Field's serialize/deserialize props are
  // declared for scalars but the array form is what it actually exchanges for array fields
  function arraySerialize (vals: any): any {
    return vals?.map(jsonSerialize) ?? []
  }
  function arrayDeserialize (vals: any): any {
    return vals?.map(jsonDeserialize) ?? []
  }

  function isSelected (value: any, rawValue: any[] | undefined) {
    return (rawValue ?? []).some(v => equal(v, value))
  }

  function toggle (value: any, rawValue: any[] | undefined, setVal: (v: any[]) => void) {
    return (e: CustomEvent<boolean>) => {
      const current = rawValue ?? []
      const next = e.detail ? [...current.filter(v => !equal(v, value)), value] : current.filter(v => !equal(v, value))
      setVal(next)
    }
  }

  function openPanel () {
    if (disabled) return
    open = true
    void tick().then(() => {
      (portalRef?.querySelector('input[type="checkbox"]') as HTMLInputElement | null)?.focus()
    })
  }

  function closePanel (returnFocus = true) {
    if (!open) return
    open = false
    if (returnFocus) buttonRef?.focus()
  }

  function onTriggerClick () {
    if (open) closePanel()
    else openPanel()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      closePanel()
    }
  }

  function onWindowMousedown (e: MouseEvent) {
    if (!open) return
    const target = e.target as Node | null
    if (target && (portalRef?.contains(target) || buttonRef?.contains(target))) return
    closePanel(false)
  }

  function onPanelFocusout (e: FocusEvent) {
    const next = e.relatedTarget as Node | null
    if (next && (portalRef?.contains(next) || buttonRef?.contains(next))) return
    // focus is leaving the control entirely (tab out or click elsewhere); the mousedown handler
    // already closed it in the click case, this covers keyboard navigation out of the panel
    closePanel(false)
  }

  onDestroy(() => { open = false })
</script>

<!--
  @component

  A multi-select whose options form a shallow tree: top-level items may carry children rendered
  indented beneath them. The popover is a carbon FloatingPortal anchored to the trigger. Values are
  arbitrary objects (serialized to JSON in form state), so the field can hold API-shaped filter
  entries directly.
-->

<svelte:window on:mousedown={onWindowMousedown} />

<Field {path} notNull {conditional} {defaultValue} serialize={arraySerialize} deserialize={arrayDeserialize} let:invalid let:messages let:rawValue let:setVal let:onBlur>
  {@const count = rawValue?.length ?? 0}
  {@const errorText = messages.filter(m => m.type === 'error' || m.type === 'system').map(m => m.message).join('\n')}
  <div class="bx--list-box__wrapper nested-multiselect cs-field" class:nested-multiselect--invalid={invalid}>
    {#if !hideLabel}
      <label class="bx--label" class:bx--label--disabled={disabled} for={id}>{labelText}{#if required}<span aria-hidden="true">{' '}*</span>{/if}</label>
    {/if}
    <div class="bx--multi-select bx--list-box" class:bx--multi-select--selected={count > 0} class:bx--list-box--expanded={open} class:bx--list-box--disabled={disabled}>
      <button
        bind:this={buttonRef}
        {id}
        type="button"
        class="bx--list-box__field nested-multiselect__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={hideLabel ? labelText : undefined}
        {disabled}
        on:click={onTriggerClick}
        on:keydown={onKeydown}
        on:blur={() => { if (!open) onBlur() }}
      >
        {#if count > 0}
          <!-- a span with Tag's classes rather than <Tag>, which renders a div (not allowed inside a button) -->
          <span class="bx--tag bx--tag--high-contrast bx--tag--sm nested-multiselect__count">{count}</span>
        {/if}
        <span class="bx--list-box__label">{placeholder}</span>
        <span class="bx--list-box__menu-icon nested-multiselect__icon" class:bx--list-box__menu-icon--open={open} aria-hidden="true"><Add /></span>
      </button>
    </div>
    {#if errorText}
      <div class="bx--form-requirement">{errorText}</div>
    {/if}
  </div>

  <FloatingPortal anchor={buttonRef} {open} direction="bottom" bind:ref={portalRef}>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div id={panelId} role="dialog" aria-label={labelText} tabindex="-1" class="nested-multiselect__panel" on:keydown={onKeydown} on:focusout={onPanelFocusout}>
      {#each items as item (jsonSerialize(item.value))}
        <div class="nested-multiselect__item">
          <Checkbox labelText={item.label} checked={isSelected(item.value, rawValue)} on:check={toggle(item.value, rawValue, setVal)} />
        </div>
        {#each item.children ?? [] as child (jsonSerialize(child.value))}
          <div class="nested-multiselect__item nested-multiselect__item--child">
            <Checkbox labelText={child.label} checked={isSelected(child.value, rawValue)} on:check={toggle(child.value, rawValue, setVal)} />
          </div>
        {/each}
      {/each}
    </div>
  </FloatingPortal>
</Field>

<style>
  .nested-multiselect__trigger {
    width: 100%;
    text-align: left;
    cursor: pointer;
  }
  .nested-multiselect__trigger:disabled {
    cursor: not-allowed;
  }
  .nested-multiselect :global(.nested-multiselect__count) {
    margin-right: 0.5rem;
  }
  .nested-multiselect__icon {
    /* carbon rotates the chevron when open; the plus should stay put */
    transform: none;
  }
  .nested-multiselect--invalid .bx--list-box {
    outline: 2px solid var(--cds-support-01, #da1e28);
    outline-offset: -2px;
  }
  .nested-multiselect__panel {
    background-color: var(--cds-field-01, #f4f4f4);
    box-shadow: 0 2px 6px var(--cds-shadow, rgba(0, 0, 0, 0.3));
    max-height: 15rem;
    overflow-y: auto;
    padding: 0.25rem 0;
  }
  .nested-multiselect__panel:focus {
    outline: none;
  }
  .nested-multiselect__item {
    padding: 0.125rem 1rem;
  }
  .nested-multiselect__item--child {
    padding-left: 2.5rem;
  }
  .nested-multiselect__panel :global(.bx--checkbox:checked + .bx--checkbox-label::before) {
    background-color: var(--maroon);
  }
</style>
