<script lang="ts">
  export let data
</script>

Previous dog history info is {!data.previousDogAcceptable ? 'un' : ''}acceptable.<br>
Current dog info is {!data.currentDogAcceptable ? 'un' : ''}acceptable.<br>
Yard info is {!data.yardAcceptable ? 'un' : ''}acceptable.<br>
Allergy info is {!data.allergyAcceptable ? 'un' : ''}acceptable.<br>
Exercise minimum was {!data.exerciseMinMet ? 'not ' : ''}met.<br>
{#if (!data.exerciseMinMet )} 
  Exercise exemption was {!data.exerciseException ? 'not ' : ''}granted.<br>
{/if}
