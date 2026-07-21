<script lang="ts">
export let data
export let prestageData
$: prestage = prestageData.latest ?? prestageData.current
</script>

<p>NetID: {prestage.nodes.client.data.netid}</p>
<p>Name: {prestage.nodes.client.data.name}</p>
<p>Email: {prestage.nodes.client.data.email}</p>
<p>Information is correct: {data.correct ? 'Yes' : 'No'}</p>


