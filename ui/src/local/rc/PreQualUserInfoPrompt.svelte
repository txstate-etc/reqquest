<script lang="ts">
  import { FieldRadioTile, FieldTextInput } from '@txstate-mws/carbon-svelte'
  export let data
  export let prestageData
  $: prestage = prestageData.latest ?? prestageData.current
  $: if (data) data.__prestage = prestage

  const options = [
    { value: true, label: "Yes" },
    { value: false, label: "No" }
  ];
</script>

<label for="netid" style="font-size: small;">NetID</label>
<br/>
<input type="text" style="background-color: #f4f4f4; height: 2.5em; width:100%; padding-left: 1em;" name="netid" readonly value={prestage.nodes.client.data.netid} />
<label for="name" style="font-size: small;">Name</label>
<br/>
<input type="text" style="background-color: #f4f4f4; height: 2.5em; width:100%; padding-left: 1em;" name="name" readonly value={prestage.nodes.client.data.name} />
<label for="email" style="font-size: small;">Email</label>
<br/>
<input type="text" style="background-color: #f4f4f4; height: 2.5em; width:100%; padding-left: 1em;" name="email" readonly value={prestage.nodes.client.data.email} />


<div class="pt-8"></div>
<FieldRadioTile
  boolean
  required
    path="correct"
    items={options}
    orientation="horizontal"
    centerHorizontal
    descriptionVisibility="persistent"
  />