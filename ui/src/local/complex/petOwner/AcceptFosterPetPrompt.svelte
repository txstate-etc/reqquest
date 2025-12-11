<script lang="ts">
  import { FieldRadio, Card, FieldHidden } from '@txstate-mws/carbon-svelte'
    import { RadioButton, RadioButtonGroup } from 'carbon-components-svelte';
  export let data
  export let fetched
  let selected
  $: fosters = fetched.sort((a, b) => a.age - b.age)
  $: selectedId = selected?.value
</script>
<FieldRadio boolean path="accept" legendText="You have been approved to foster a pet!  At this time, do you still wish to foster, or have circumstances changed?" items={[{ label: 'Adopt please!', value: true }, { label: 'Something has changed :(', value: false }]} />
{#if data.accept}
  <RadioButtonGroup legendText="Select a pet to foster" bind:selected>
    <div class="card-radio-grid">
      {#each fosters as foster}
        <div class="card-radio-item">          
          <Card
            title={foster.name}
            subhead={foster.age}
            image={foster.picUrl}
            tags={foster.tags ?? []}
          >
            <p>{foster.description}</p>
          </Card>
          <div class="radio-wrapper">
            <RadioButton value={foster.id} labelText={`Adopt ${foster.name}`} />
          </div>
        </div>
      {/each}
    </div>
  </RadioButtonGroup>
{/if}

<FieldHidden path="id" value={selectedId} />

