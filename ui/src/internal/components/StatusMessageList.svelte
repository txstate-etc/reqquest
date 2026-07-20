<script lang="ts">
  import { BadgeNumber } from '@txstate-mws/carbon-svelte'
  import { Accordion, AccordionItem } from 'carbon-components-svelte'
  import { WarningFilled } from 'carbon-icons-svelte'
  import WarningIconYellow from './WarningIconYellow.svelte'

  export let items: { id: string, message: string }[] = []
  export let variant: 'warning' | 'error' = 'error'
  export let accordionTitle = 'Multiple items'
  export let gap = 2
  export let icon = false

  $: badgeStyle = variant === 'warning'
    ? '--badge-bg: var(--yellow-01, #F3D690); --badge-text: #6F510C'
    : '--badge-bg: #FBE9EA; --badge-text: #a11c25'
</script>

{#if items.length === 1}
  <div class="flex items-center gap-{gap}">
    {#if icon}
      {#if variant === 'warning'}
        <WarningIconYellow />
      {:else}
        <WarningFilled size={20} class="disqualifying-icon" />
      {/if}
    {:else}
      <BadgeNumber value={1} class="ml-0" style={badgeStyle} />
    {/if}
    <p class="text-sm">{items[0].message}</p>
  </div>
{:else if items.length > 1}
  <div class="flex">
    {#if icon}
      {#if variant === 'warning'}
        <WarningIconYellow class="mt-5 mr-2" />
      {:else}
        <WarningFilled size={20} class="disqualifying-icon" />
      {/if}
    {:else}
      <BadgeNumber value={items.length} class="mt-5 mr-2 ml-0" style={badgeStyle} />
    {/if}
    <div class="mt-2 w-full">
      <Accordion align="start">
        <AccordionItem title={accordionTitle}>
          <ol class="list-decimal">
            {#each items as item (item.id)}
              <li>{item.message}</li>
            {/each}
          </ol>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
{/if}
