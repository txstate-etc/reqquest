<script lang="ts">
  import { Form } from '@txstate-mws/svelte-forms'
  import { Panel, type TagItem, type CardImage } from '@txstate-mws/carbon-svelte'
  import { Button } from 'carbon-components-svelte'
  import { FieldCardRadio, FieldCardCheckbox } from '$lib'
  import type { CardSelectItem } from '$lib/components/FieldCardRadio.svelte'

  // Cat adoption options with images and tags (single select - pick one cat)
  const catOptions: CardSelectItem[] = [
    {
      value: 'whiskers',
      title: 'Whiskers',
      subhead: 'Domestic Shorthair',
      image: {
        src: 'https://picsum.photos/id/40/400/300',
        alt: 'A gray cat',
        lockedAspect: 'standard'
      },
      tags: [
        { label: 'Calm', type: 'purple' },
        { label: 'Indoor', type: 'blue' }
      ],
      selectionLabel: 'Adopt Whiskers'
    },
    {
      value: 'mittens',
      title: 'Mittens',
      subhead: 'Maine Coon',
      image: {
        src: 'https://picsum.photos/id/1074/400/300',
        alt: 'A fluffy cat',
        lockedAspect: 'standard'
      },
      tags: [
        { label: 'Fluffy', type: 'cyan' },
        { label: 'Gentle', type: 'green' }
      ],
      selectionLabel: 'Adopt Mittens'
    },
    {
      value: 'shadow',
      title: 'Shadow',
      subhead: 'Black Cat',
      image: {
        src: 'https://picsum.photos/id/169/400/300',
        alt: 'A black cat',
        lockedAspect: 'standard'
      },
      tags: [
        { label: 'Playful', type: 'magenta' },
        { label: 'Young', type: 'teal' }
      ],
      selectionLabel: 'Adopt Shadow'
    },
    {
      value: 'Spots',
      title: 'Spots',
      subhead: 'Calico',
      image: {
        src: 'https://picsum.photos/id/219/400/300',
        alt: 'A calico cat',
        lockedAspect: 'standard'
      },
      tags: [
        { label: 'Senior', type: 'warm-gray' }
      ],
      disabled: true,
      selectionLabel: 'Adopt Spots (pending)'
    }
  ]

  // Dog adoption options with images and tags (multi select - pick multiple dogs)
  const dogOptions: CardSelectItem[] = [
    {
      value: 'buddy',
      title: 'Buddy',
      subhead: 'Labrador Retriever',
      image: {
        src: 'https://picsum.photos/id/237/400/300',
        alt: 'A black labrador',
        lockedAspect: 'standard'
      },
      tags: [
        { label: 'Friendly', type: 'green' },
        { label: 'Active', type: 'cyan' }
      ],
      selectionLabel: 'Add Buddy to family'
    },
    {
      value: 'max',
      title: 'Max',
      subhead: 'Golden Retriever',
      image: {
        src: 'https://picsum.photos/id/1025/400/300',
        alt: 'A golden retriever',
        lockedAspect: 'standard'
      },
      tags: [
        { label: 'Loyal', type: 'blue' },
        { label: 'Kid-Friendly', type: 'green' }
      ],
      selectionLabel: 'Add Max to family'
    },
    {
      value: 'bella',
      title: 'Bella',
      subhead: 'German Shepherd',
      image: {
        src: 'https://picsum.photos/id/1062/400/300',
        alt: 'A German Shepherd',
        lockedAspect: 'standard'
      },
      tags: [
        { label: 'Protective', type: 'purple' },
        { label: 'Smart', type: 'teal' }
      ],
      selectionLabel: 'Add Bella to family'
    }
  ]

  let formData: any = {}

  async function handleSubmit (data: any) {
    formData = data
    console.log('Form submitted:', data)
    return { success: true, messages: [] }
  }

  const catAdoptionFees: Record<string, number> = {
    whiskers: 75,
    mittens: 125,
    shadow: 95,
    patches: 50
  }

  const dogAdoptionFees: Record<string, number> = {
    buddy: 150,
    max: 175,
    bella: 200,
    charlie: 125
  }
</script>

<div class="p-8 max-w-5xl mx-auto flow">
  <h2 class="text-2xl font-bold mb-6">FieldCardRadio/Checkbox Test Page</h2>
  <p>Test page for FieldCardRadio and FieldCardCheckbox components. Currently internal to RQ, but planned for future CL release.</p>
  <Form submit={handleSubmit} preload={{ selectedDogs: ['bella'] }} let:data>
    <div class="space-y-8">
      <Panel title="Single Selection - Cat Adoption (FieldCardRadio)">
        <p class="mb-4 text-sm text-gray-600">Choose one cat to adopt. Spots is pending processing.</p>
        <FieldCardRadio
          path="selectedCat"
          items={catOptions}
          legendText="Choose a Cat to Adopt"
          required
          cardSize="18rem"
        >
          <svelte:fragment let:item>
            {#if item}
              <p class="text-sm font-medium">Adoption fee: ${catAdoptionFees[item.value]}</p>
            {/if}
          </svelte:fragment>
        </FieldCardRadio>
      </Panel>

      <Panel title="Multiple Selection - Dog Adoption (FieldCardCheckbox)">
        <p class="mb-4 text-sm text-gray-600">Select multiple dogs to add to your family.</p>
        <FieldCardCheckbox
          path="selectedDogs"
          items={dogOptions}
          legendText="Choose Dogs to Adopt"
          cardSize="18rem"
        >
          <svelte:fragment let:item>
            {#if item}
              <p class="text-sm font-medium">Adoption fee: ${dogAdoptionFees[item.value]}</p>
            {/if}
          </svelte:fragment>
        </FieldCardCheckbox>
      </Panel>

      <div class="flex gap-4">
        <Button type="submit">Submit</Button>
      </div>

      <Panel title="Live Form Data">
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </Panel>
    </div>
  </Form>
</div>
