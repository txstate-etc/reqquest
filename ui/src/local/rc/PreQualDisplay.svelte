<script lang="ts">
  import { booleanToWord } from "$internal"
  export let data
</script>
<p>Aknowledged expectaitions: {booleanToWord(data.acknowledgeExpectations)}</p>
<p>Availabile: {booleanToWord(data.availability)}</p>
<p>LSAT: {data.__prestage.nodes.client.data.lsat}</p>
<p>GPA: {data?.gpa}</p>


