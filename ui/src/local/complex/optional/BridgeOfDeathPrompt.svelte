<script lang="ts">
  import { FieldTextInput } from '@txstate-mws/carbon-svelte'
  export let data
  $: formalName = data.name?.toLowerCase() ?? ''
</script>
<FieldTextInput path="name" labelText="What is your name?" />
<FieldTextInput path="quest" labelText="What is your quest?" />
{#if (formalName.includes('lancelot') || formalName.includes('galahad'))}
  <FieldTextInput path="favoriteColor" labelText="What is your favorite color?" />
  {:else if (formalName.includes('robin'))}
    <FieldTextInput path="capitalOfAssyria" labelText="What is the capital of Assyria?" />
  {:else}
  <FieldTextInput path="airSpeedOfUnladenSwallow" labelText="What is the air-speed velocity of an unladen swallow?" />
{/if}
