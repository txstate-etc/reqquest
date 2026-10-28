<script lang="ts">
  import { FieldRadio, FieldSelect } from '@txstate-mws/carbon-svelte'
  import type { VerifyReccomendationLetter } from './types'
  export let data: Partial<VerifyReccomendationLetter>
</script>

<FieldRadio boolean required path="authentic" legendText="Is the letter authentic and from the named reference?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean required path="addressesTechnicalSkills" legendText="Does the letter address the applicant's technical skills?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldSelect required path="relationship" labelText="Reference's relationship to the applicant" items={[{ label: 'Professor', value: 'Professor' }, { label: 'Employer', value: 'Employer' }, { label: 'Mentor', value: 'Mentor' }, { label: 'Other', value: 'Other' }]} />
