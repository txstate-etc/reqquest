<!--
  @component
  Lays out a prompt's display data as challenge/response rows that align with the
  surrounding prompt list, for prompts that collect several question/answer pairs in a
  single form but should read as individual rows on the review screens. Rows take on
  the same padding and border treatment as the prompt rows around them, so each
  challenge/response is indistinguishable from a standalone prompt.

  Place this as the root element of a `displayComponent` and register the prompt with
  `displayMode: 'large'`. The full-width answer area becomes a subgrid of the prompt
  list, so rows share the exact column tracks of the real prompt rows around them and
  wrap at the same breakpoints. Fill it with `PromptDisplayRow` children; pass `full`
  on a row to span the entire width.

  It may also be the root element of a `formComponent` registered with
  `formMode: 'large'`: the reviewer screen's inline edit form is bridged into the same
  subgrid, so rows of field inputs align with the prompt rows too. Rendered anywhere
  without a prompt list around it (the edit modal, applicant pages), the grid falls back
  to laying out its own two columns.
-->
<dl class="prompt-display-grid">
  <slot />
</dl>

<style>
  dl.prompt-display-grid {
    display: grid;
    grid-column: 1 / -1;
    /* The review screens set --prompt-display-subgrid: subgrid when this grid is positioned
       to share their prompt-list tracks. Anywhere else (edit modals, applicant pages) it
       lays out its own two columns so full rows and placement still work. */
    grid-template-columns: var(--prompt-display-subgrid, var(--prompt-display-columns, fit-content(50%) minmax(0, 1fr)));
    align-items: stretch;
    row-gap: var(--prompt-display-row-gap, 0);
    margin: 0;
  }
  dl.prompt-display-grid > :global(.prompt-display-challenge),
  dl.prompt-display-grid > :global(.prompt-display-response),
  dl.prompt-display-grid > :global(.prompt-display-full) {
    border-bottom: 1px solid var(--cds-border-subtle);
    padding: var(--prompt-display-row-padding, 1rem 15px);
  }
  dl.prompt-display-grid > :global(.prompt-display-challenge),
  dl.prompt-display-grid > :global(.prompt-display-full) {
    padding-left: calc(var(--prompt-display-challenge-padding-left, 32px) + var(--prompt-display-indent, 0) * var(--prompt-display-indent-size, 1rem));
  }
</style>
