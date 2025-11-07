<script lang="ts">
  export let data
</script>

Previous cat history info is {!data.previousCatAcceptable ? 'un' : ''}acceptable.<br>
Current cat info is {!data.currentCatAcceptable ? 'un' : ''}acceptable.<br>
Living space info is {!data.livingSpaceAcceptable ? 'un' : ''}acceptable.<br>
Allergy info is {!data.allergyAcceptable ? 'un' : ''}acceptable.<br>
Microchip servive agreement is {!data.microchipAgree ? 'not ' : ''}met.<br>

