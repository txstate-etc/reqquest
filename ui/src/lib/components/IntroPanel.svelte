<script lang="ts">
  import { TagSet } from '@txstate-mws/carbon-svelte'
  import type { TagItem } from '@txstate-mws/carbon-svelte'

  export let title = ''
  export let subtitle = ''
  export let tags: TagItem[] | undefined = undefined
</script>

<section class="bg-[var(--cds-ui-01)] p-4 text-2xl">
  <div class="repel">
    <div class="max-w-lg">
      {#if title}
      <div class="title-block [ flex gap-3 ] ">
        <h2 class="text-[1.25rem] text-[var(--cds-text-01,#1A1A1A)] font-normal leading-7">
          {title}
        </h2>
        {#if tags}
          <TagSet tags={tags} />
        {/if}
        </div>
        {#if subtitle}
          <p class="text-sm text-[var(--cds-text-02)] leading-[18px] tracking-[0.16px] pt-2">
            {subtitle}
          </p>
        {/if}
      {/if}
      <!-- Optional content slot below title/subtitle -->
      {#if $$slots.default}
        <div class="mt-2">
          <slot />
        </div>
      {/if}
    </div>
    {#if $$slots['block-end']}
    <div class="block-end-slot">
      <slot name="block-end" />
    </div>
    {/if}
  </div>
</section>
