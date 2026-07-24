<script lang="ts">
export let data
</script>

<p>NetID: {data.__prestage.nodes.client.data.netid}</p>
<p>Name: {data.__prestage.nodes.client.data.name}</p>
<p>Email: {data.__prestage.nodes.client.data.email}</p>
<p>Information is correct: {data.correct ? 'Yes' : 'No'}</p>


