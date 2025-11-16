<script lang="ts">
  import { WarningAltFilled } from 'carbon-icons-svelte'
  import type { ComponentProps } from 'svelte'

  interface $$Props extends ComponentProps<typeof WarningAltFilled> {}
</script>

<div>
  <WarningAltFilled {...$$restProps} />
</div>

<style>
  div :global(svg) {
    fill: var(--cds-support-03, rgba(239, 200, 108, 1)) !important;
  }

  div :global([data-icon-path="inner-path"]) {
    fill: black;
  }
</style>
