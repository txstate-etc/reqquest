<script lang="ts">
  import { FieldCheckbox } from "@txstate-mws/carbon-svelte"
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { Checkbox } from "carbon-components-svelte"
  export let data: any
  export let gatheredData: any
  export let store: FormStore

  const initialData = Object.assign({}, data)

  let checked = !store?.getField('optOut')

  function updateOpposite () {
    store?.setField('optOut', checked)
  }
</script>
<div class="gap-4 flex flex-col">
  {#if initialData.optOut}
    <p>By opting back in, you will be eligible for this program.</p>
    <Checkbox labelText='I understand and would like to opt in' on:click={updateOpposite} />
    {:else}
    <p>By opting-out, you will not be eligible for this program unless you opt back in before submitting your request.</p>
    {/if}
    <FieldCheckbox path='optOut' labelText='I understand and would like to opt out' hidden={initialData.optOut}/>
</div>
