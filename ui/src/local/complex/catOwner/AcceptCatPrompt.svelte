<script lang="ts">
  import { FieldRadio, CardGrid, Card } from '@txstate-mws/carbon-svelte'
  export let data
  export let fetched
  $: cats = fetched.sort((a, b) => a.age = b.age)
</script>
<FieldRadio boolean path="accept" legendText="You have been approved for cat adoption!  At this time, do you still wish to adopt a cat, or have circumstances changed?" items={[{ label: 'Adopt please!', value: true }, { label: 'Something has changed :(', value: false }]} />
{#if data.accept}
  <CardGrid>  
    {#each cats as cat}
      <Card title={cat.name} subhead={`${cat.age} years old`} >
        <img alt='Cat pic' src={cat.picUrl} />
      </Card>
    {/each}
  </CardGrid>
{/if}


