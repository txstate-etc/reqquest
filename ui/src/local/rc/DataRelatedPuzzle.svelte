<script lang="ts">
  import {  FieldTextArea, FieldUpload } from '@txstate-mws/carbon-svelte'
  import type { DataRelatedPuzzle } from './types.js'
  export let gatheredConfigData
  export let data: Partial<DataRelatedPuzzle>
</script>

<FieldTextArea required path='puzzleAnswer' labelText="You’re building a 'Seat Finder' for the dining hall. In plain English (or pseudocode), describe how you would sort a list of tables to show the user the ones that are both empty and closest to the entrance. Note: You may make up data to support your solution." />
<FieldUpload path='additionalDocumentation' labelText='Supporting Documentation' />
