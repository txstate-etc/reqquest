<script lang="ts">
  import { FieldRadio, Card, FieldHidden } from '@txstate-mws/carbon-svelte'
    import { RadioButton, RadioButtonGroup } from 'carbon-components-svelte';
  export let data
  export let fetched
  let selected
  $: dogs = fetched.sort((a, b) => a.age - b.age)
  $: selectedId = selected?.value
</script>
<FieldRadio boolean path="accept" legendText="You have been approved for dog adoption!  At this time, do you still wish to adopt a dog, or have circumstances changed?" items={[{ label: 'Adopt please!', value: true }, { label: 'Something has changed :(', value: false }]} />
{#if data.accept}
  <RadioButtonGroup legendText="Select a dog" bind:selected>
    <div class="card-radio-grid">
      {#each dogs as dog}
        <div class="card-radio-item">          
          <Card
            title={dog.name}
            subhead={dog.age}
            image={dog.picUrl}
            tags={dog.tags ?? []}
          >
            <p>{dog.description}</p>
          </Card>
          <div class="radio-wrapper">
            <RadioButton value={dog.id} labelText={`Adopt ${dog.name}`} />
          </div>
        </div>
      {/each}
    </div>
  </RadioButtonGroup>
{/if}

<FieldHidden path="id" value={selectedId} />
