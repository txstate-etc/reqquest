<script lang="ts">
  import type { CatTowerData } from './types.js'
  export let data: CatTowerData
</script>

{#if !!data.haveCatTower}
  Already owns a cat tower.
{:else if !!data.willPurchaseCatTower}
  Will purchase a cat tower.
{:else if !data.haveCatTower}
  No cat tower.
{/if}
