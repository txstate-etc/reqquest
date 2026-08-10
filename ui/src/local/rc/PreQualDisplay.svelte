<script lang="ts">
  import { booleanToWord } from "$internal"
  import { PromptDisplayGrid, PromptDisplayRow } from "$lib"
  export let data
</script>

<PromptDisplayGrid>
  <PromptDisplayRow challenge="Acknowledged expectations?">{booleanToWord(data.acknowledgeExpectations)}</PromptDisplayRow>
  <PromptDisplayRow challenge="Available?">{booleanToWord(data.availability)}</PromptDisplayRow>
  <PromptDisplayRow challenge="LSAT" indentLevel={1}>{data.__prestage.nodes.client.data.lsat}</PromptDisplayRow>
  <PromptDisplayRow challenge="GPA" indentLevel={1}>{data?.gpa}</PromptDisplayRow>
  <PromptDisplayRow full>
    <em>LSAT and GPA are pulled from the applicant record.</em>
  </PromptDisplayRow>
</PromptDisplayGrid>
