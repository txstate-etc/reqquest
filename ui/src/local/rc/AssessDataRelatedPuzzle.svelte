<script lang="ts">
  import { FieldRadio, FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { AssessDataRelatedPuzzle } from './types'
  export let gatheredConfigData
  export let data: Partial<AssessDataRelatedPuzzle>
</script>

<FieldRadio 
  path='score'
  labelText='Assess the applicant’s solution.'
  items={[
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Neutral', label: 'Neutral' },
    { value: 'Poor', label: 'Poor' },
    { value: 'Unacceptable', label: 'Unacceptable' },
  ]}
/>

<FieldTextArea path='explaination' labelText="Explain your score." />
