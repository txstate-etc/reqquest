<script lang="ts">
  import { FieldMultiselect, FieldNumber, FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { RCPreQual } from './types.js'
  export let fetched: string[]
  export let data: Partial<RCPreQual>
  console.log(fetched)
</script>

<FieldNumber path='gpa' labelText='GPA' step={0.1} />
<FieldRadio boolean path="availability" legendText="Are you avaiable 5–10 hours per week?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean path="acknowledgeExpectations" legendText="Do you aknowledge expectations?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldMultiselect labelText='Organizations Joined' path='orgs' items={fetched.map(f => ({ label: f, value: f }))} />
