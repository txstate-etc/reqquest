<!--
  @component
  One challenge/response row inside a `PromptDisplayGrid`. The challenge lands in the
  same column as the prompt titles around it and the response in the answer column.

  - `challenge` prop or slot for the question, default slot for the answer.
  - `full` spans the entire grid width instead, for content that needs the whole row
    (documents, notes, notifications).
  - `indentLevel` indents the challenge (or full-row content) to suggest hierarchy,
    e.g. follow-up questions under a parent question.
-->
<script lang="ts">
  /** The question being answered. Use the `challenge` slot instead if you need markup. */
  export let challenge: string | undefined = undefined
  /** Span the full width of the grid instead of splitting into challenge/response. */
  export let full = false
  /**
   * Indent the challenge (or full-row content) by this multiple of a small indent unit
   * (1rem per level, tunable with --prompt-display-indent-size). Default 0.
   */
  export let indentLevel = 0
</script>

{#if full}
  <div class="prompt-display-full" style:--prompt-display-indent={indentLevel || undefined}><slot /></div>
{:else}
  <dt class="prompt-display-challenge" style:--prompt-display-indent={indentLevel || undefined}><slot name="challenge">{challenge}</slot></dt>
  <dd class="prompt-display-response"><slot /></dd>
{/if}

<style>
  dt.prompt-display-challenge {
    grid-column: 1;
  }
  dd.prompt-display-response {
    grid-column: 2;
    margin: 0;
  }
  div.prompt-display-full {
    grid-column: 1 / -1;
  }
</style>
