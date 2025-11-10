<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let data
  export let appRequestData
  $: underAgeChildrenInHouse = appRequestData.children_prompt.underMinAge
</script>

<FieldRadio boolean conditional={underAgeChildrenInHouse} path="underAgeChildrenAcceptable" labelText="Is the under age children information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }    
  ]
} />

{#if !underAgeChildrenInHouse}
  No review required
{/if}

