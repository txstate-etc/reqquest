<script lang="ts">
  export let title = ''
  export let subtitle = ''
</script>

<section class="bg-[var(--cds-ui-01)] p-4 text-2xl">
  <div class="repel">
    <div class="max-w-lg">
      {#if title}
        <h2 class="text-[1.25rem] text-[var(--cds-text-01,#1A1A1A)] font-normal leading-7">
          {title}
        </h2>
        {#if subtitle}
          <p class="text-sm text-[var(--cds-text-02)] leading-[18px] tracking-[0.16px]">
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
