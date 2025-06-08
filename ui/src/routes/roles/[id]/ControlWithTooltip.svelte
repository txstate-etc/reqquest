<script lang="ts">
  import { TooltipDefinition } from 'carbon-components-svelte'
  import { getContext } from 'svelte'

  export let row: { subjectType: { name: string }, controls: string[] }
  const subjectTypeLookup = getContext<() => Record<string, { controls: { name: string, description: string }[] }>>('subjectTypeLookup')()
  $: subjectType = subjectTypeLookup[row.subjectType.name]
</script>

{#each row.controls as control, controlIndex}
  {@const controlInfo = subjectType.controls.find(c => c.name === control)}
  <TooltipDefinition tooltipText={controlInfo?.description}>
    {controlInfo?.name ?? control}
  </TooltipDefinition>{#if controlIndex < row.controls.length - 1},{' '}{/if}
{/each}
