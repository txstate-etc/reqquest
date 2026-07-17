<script lang="ts">
  import { SkeletonText } from 'carbon-components-svelte'
</script>
<div class="gap-4 flex flex-col">
  <div class="prompt-intro flow pt-10 flex justify-center">
    <SkeletonText width="80%" style="height: 30px" />
  </div>
  <SkeletonText />
  <SkeletonText />
  <SkeletonText />
  <div style="width:100%" class="[ flex flex-row gap-20 justify-center ]">
    <div class="still-skeleton bx--skeleton__text" style="height: 48px; width: 90px;" />
    <div class="still-skeleton bx--skeleton__text" style="height: 48px; width: 90px;" />
  </div>
</div>
