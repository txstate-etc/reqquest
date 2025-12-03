<script lang="ts">
  export let data
  export let gatheredConfigData
  $: minAgeConfigData = gatheredConfigData.children_qual_req.minAge ?? 'Related config data is not working'
</script>
<p>Currently have kid(s) under {minAgeConfigData}:  { !!data.underMinAge ? 'Yes': 'No' }</p>
{#if (!!data.underMinAge) }
   Count: { data.count }<br />
   Details: { data.details }<br/>
{/if}
