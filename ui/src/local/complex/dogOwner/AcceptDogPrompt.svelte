<script lang="ts">
  import { FieldRadio, Card, FieldHidden } from '@txstate-mws/carbon-svelte'
    import { RadioButton, RadioButtonGroup } from 'carbon-components-svelte';
  export let data
  export let fetched
  let selected
  $: cats = fetched.sort((a, b) => a.age - b.age)
  $: selectedId = selected?.value
</script>
<FieldRadio boolean path="accept" legendText="You have been approved for cat adoption!  At this time, do you still wish to adopt a cat, or have circumstances changed?" items={[{ label: 'Adopt please!', value: true }, { label: 'Something has changed :(', value: false }]} />
{#if data.accept}
  <RadioButtonGroup legendText="Select a cat" bind:selected>
    <div class="card-radio-grid">
      {#each cats as cat}
        <div class="card-radio-item">          
          <Card
            title={cat.name}
            subhead={cat.age}
            image={cat.picUrl}
            tags={cat.tags ?? []}
          >
            <p>{cat.description}</p>
          </Card>
          <div class="radio-wrapper">
            <RadioButton value={cat.id} labelText={`Adopt ${cat.name}`} />
          </div>
        </div>
      {/each}
    </div>
  </RadioButtonGroup>
{/if}

<FieldHidden path="id" value={selectedId} />
