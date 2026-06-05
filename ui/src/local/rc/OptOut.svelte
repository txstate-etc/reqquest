<script lang="ts">
  import { FieldCheckbox, FieldHidden } from "@txstate-mws/carbon-svelte"
  export let data: { optOut?: boolean, optOutUnderstand?: boolean, optInUnderstand?: boolean }
  const wasOptedOut = data.optOut
  const wasOptedIn = !wasOptedOut
</script>
{#if wasOptedOut}
  <p>By opting back in, you will be eligible for this program.</p>
{:else}
  <p>By opting-out, you will not be eligible for this program unless you opt back in before submitting your request.</p>
{/if}
<div class="gap-4 flex flex-col">
    <FieldCheckbox path="optInUnderstand" labelText="I understand opt in" conditional={!!wasOptedOut} />
    <FieldCheckbox path="optOutUnderstand" labelText="I understand opt out" conditional={!!wasOptedIn} />
    <FieldHidden path="optOut" value={(wasOptedOut && !data.optInUnderstand) || (wasOptedIn && data.optOutUnderstand)} />
</div>
