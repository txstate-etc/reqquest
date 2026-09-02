### Icons

> Icons come from `carbon-icons-svelte`.

The upstream doc shows the barrel import. Do not use it - it pulls thousands of components into the
bundle. Deep-import one icon per line:

```svelte
<script lang="ts">
  import Launch from 'carbon-icons-svelte/lib/Launch.svelte'
  import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAltFilled.svelte'
</script>

<Launch size={16} title="Opens in a new tab" />
<WarningAltFilled size={20} class="warn" />

<style>
  /* Recolor by targeting the rendered svg; the component takes no color prop. */
  .warn :global(svg) { fill: var(--cds-support-03, #f1c21b); }
</style>
```

Props: `size` (16 | 20 | 24 | 32), `title` (accessible name - omit for purely decorative icons),
plus anything else forwarded to the `<svg>`. Browse names at
<https://carbon-icons-svelte.onrender.com>.

Where a component prop wants an icon (`ActionItem.icon`, `PromptDefinition.icon`, `Form.submitIcon`),
pass the imported component itself, not an element: `icon: Launch`, not `icon: <Launch />`.
