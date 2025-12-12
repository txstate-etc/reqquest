<script lang="ts">
  export let data
</script>

Residency info { !data.residencyInfoAcceptable ? 'does not match ' : 'matches ' }ID file.
{#if !data.residencyInfoAcceptable}
  <br><b>Suggested issues or corrections</b>: { data.corrections }
{/if}

