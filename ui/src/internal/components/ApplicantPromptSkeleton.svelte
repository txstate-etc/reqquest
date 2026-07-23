<script lang="ts">
  import { SkeletonText } from 'carbon-components-svelte'
</script>
<div class="gap-4 flex flex-col mt-10">
  <SkeletonText />
  <SkeletonText />
  <SkeletonText />
  <div style="width:100%" class="[ flex flex-row gap-20 justify-center ]">
    <div class="still-skeleton bx--skeleton__text" style="height: 48px; width: 90px;" />
    <div class="still-skeleton bx--skeleton__text" style="height: 48px; width: 90px;" />
  </div>
</div>
