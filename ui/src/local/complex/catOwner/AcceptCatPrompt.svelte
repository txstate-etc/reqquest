<script lang="ts">
  import { FieldRadio, CardGrid, Card } from '@txstate-mws/carbon-svelte'
    import { RadioButton, RadioButtonGroup } from 'carbon-components-svelte';
  export let data
  export let fetched
  let selected
  $: cats = fetched.sort((a, b) => a.age = b.age)
</script>
<FieldRadio boolean path="accept" legendText="You have been approved for cat adoption!  At this time, do you still wish to adopt a cat, or have circumstances changed?" items={[{ label: 'Adopt please!', value: true }, { label: 'Something has changed :(', value: false }]} />
{#if data.accept}
  <RadioButtonGroup legendText="Select a cat" bind:selected>
    <div class="card-radio-grid">
      {#each cats as cat}
        <div class="card-radio-item">
          <CardGrid>  
            <Card
              title={cat.name}
              subhead={cat.age}
              image={cat.picUrl}
              tags={cat.tags ?? []}
            >
              <p>{cat.description}</p>
            </Card>
          </CardGrid>
          <div class="radio-wrapper">
            <FieldRadio boolean path="id" items={[{ label: `Adopt ${cat.name}`, value: true }]} />
          </div>
        </div>
      {/each}
    </div>
  </RadioButtonGroup>
{/if}
