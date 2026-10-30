<script lang="ts">
  import { booleanToWord } from "$internal"
  import { PromptDisplayGrid, PromptDisplayRow } from "$lib"
  import type { VerifyReccomendationLetter } from "./types"
  export let data: Partial<VerifyReccomendationLetter> | undefined
</script>

<PromptDisplayGrid>
  <PromptDisplayRow challenge="Is the letter authentic and from the named reference?" indentLevel={1}>{data?.authentic == null ? 'Not answered' : booleanToWord(data.authentic)}</PromptDisplayRow>
  <PromptDisplayRow challenge="Does the letter address the applicant's technical skills?" indentLevel={1}>{data?.addressesTechnicalSkills == null ? 'Not answered' : booleanToWord(data.addressesTechnicalSkills)}</PromptDisplayRow>
  <PromptDisplayRow challenge="Reference's relationship to the applicant" indentLevel={1}>{data?.relationship ?? 'Not answered'}</PromptDisplayRow>
</PromptDisplayGrid>
