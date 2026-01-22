<script lang="ts">
  import { BadgeNumber } from '@txstate-mws/carbon-svelte'
  import { Accordion, AccordionItem } from 'carbon-components-svelte'

  export let items: { id: string, message: string }[] = []
  export let variant: 'warning' | 'error' = 'error'
  export let accordionTitle = 'Multiple items'

  $: badgeStyle = variant === 'warning'
    ? '--badge-bg: var(--yellow-01, #F3D690); --badge-text: #6F510C'
    : '--badge-bg: #FBE9EA; --badge-text: #a11c25'
</script>

{#if items.length === 1}
  <div class="flex items-center">
    <BadgeNumber value={1} class="mt-2 mr-2" style={badgeStyle} />
    <p class="mt-2 mb-0 text-sm">{items[0].message}</p>
  </div>
{:else if items.length > 1}
  <div class="flex">
    <BadgeNumber value={items.length} class="mt-5 mr-2" style={badgeStyle} />
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
