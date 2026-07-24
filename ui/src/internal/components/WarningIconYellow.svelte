<script lang="ts">
  import { WarningAltFilled } from 'carbon-icons-svelte'
  import type { ComponentProps } from 'svelte'

  interface $$Props extends ComponentProps<typeof WarningAltFilled> {}

  export let size = 20
</script>

<div>
  <WarningAltFilled {size} {...$$restProps} />
</div>

<style>
  div :global(svg) {
    fill: var(--cds-support-03, #f1c21b) !important;
  }

  div :global([data-icon-path="inner-path"]) {
    fill: black;
  }
</style>
