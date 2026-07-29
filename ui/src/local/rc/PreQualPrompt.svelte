<script lang="ts">
  import { FieldMultiselect, FieldNumber, FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { RCPreQual } from './types.js'
  export let fetched: string[]
  export let data: Partial<RCPreQual>
  export let prestageData
  $: prestage = prestageData.latest ?? prestageData.current
  $: if (data) data.__prestage = prestage
</script>

<!--<FieldNumber labelText='LSAT Score' path='data.__prestage.nodes.client.data.lsat' readonly defaultValue={prestage.nodes.client.data.lsat} />-->
<label for="lsat" style="font-size: small;">LSAT Score</label>
<br/>
<input type="number" style="background-color: #f4f4f4; height: 2.5em; width:100%; padding-left: 1em;" name="lsat" readonly value={prestage.nodes.client.data.lsat} />
<FieldNumber path='gpa' labelText='GPA' step={0.1} />
<FieldRadio boolean path="availability" legendText="Are you avaiable 5–10 hours per week?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean path="acknowledgeExpectations" legendText="Do you aknowledge expectations?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldMultiselect labelText='Organizations Joined' path='orgs' items={fetched.map(f => ({ label: f, value: f }))} />
