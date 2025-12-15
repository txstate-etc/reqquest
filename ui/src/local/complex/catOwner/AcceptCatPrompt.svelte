<script lang="ts">
  import { FieldRadio, Card, FieldHidden } from '@txstate-mws/carbon-svelte'
    import { RadioButton, RadioButtonGroup } from 'carbon-components-svelte';
  export let data
  export let fetched
  let selected
  $: cats = fetched.sort((a, b) => a.age - b.age)
 $: selectedId = selected?.value ?? null
</script>
<FieldRadio boolean path="accept" legendText="You have been approved for cat adoption!  At this time, do you still wish to adopt a cat, or have circumstances changed?" items={[{ label: 'Adopt please!', value: true }, { label: 'Something has changed :(', value: false }]} />
{#if data.accept}
  <RadioButtonGroup legendText="Select a cat" bind:selected>
    <div class="card-radio-grid">
      {#each cats as cat}
      {@const cardImage={src: cat.picUrl, alt: `${cat.name} picture`}}
        <div class="card-radio-item">          
          <Card
            title={cat.name}
            subhead={cat.age}
            image={cardImage}
            tags={cat.tags ?? []}
          >
            <p>{cat.description}</p>
          </Card>
          <div class="radio-wrapper">
            <br>
            <RadioButton value={cat.id} labelText={`Adopt ${cat.name}`} />
            <br>
          </div>
        </div>
      {/each}
    </div>
  </RadioButtonGroup>
  <FieldHidden path="id" value={selectedId} />
{/if}