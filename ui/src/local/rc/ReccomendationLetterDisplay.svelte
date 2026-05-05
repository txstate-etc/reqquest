<script lang="ts">
  import type { ReccomendationLetter } from "./types"

  export let data: ReccomendationLetter
  console.log(data.reccomendationLetter)
</script>
<p>{data?.reccomendationLetter}</p>


