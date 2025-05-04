<script lang="ts">
  // @ts-nocheck

    import { FileUploader, FileUploaderItem, Button, TextInput, PasswordInput } from 'carbon-components-svelte'
    import Upload from 'carbon-icons-svelte/lib/Upload.svelte'
    import { api } from '$lib/api'
    import { CarbonForSalesforce, Download } from 'carbon-icons-svelte'

    let docId = '14311'
    const pageNumber = 1
    let jpegBlob

    async function downloadFile () {
      const method = 'bdmDownload'
      const operations = {
        operationName: 'QueryStream',
        query: `query QueryStream($id:String!, $pageNumber:Float!){
                    ${method}(id:$id, pageNumber:$pageNumber)
                  }`,
        variables: { id: docId, pageNumber }
      }

      const res = await fetch(`${api.apiBase}/graphql`, {
        method: 'POST',
        body: JSON.stringify(operations),
        headers: {
          Authorization: `Bearer ${api.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        const data = []
        const dataParts = 0
        let dataBlob = new Blob()
        for (const chunk of res.body) {
          dataBlob = new Blob([dataBlob, chunk.buffer])
        }
        const dataBlobToJSON = await (await fetch(URL.createObjectURL(dataBlob))).json()
        const dataBlobContent = new Uint8Array(dataBlobToJSON.data[method])
        jpegBlob = URL.createObjectURL(new Blob([dataBlobContent.buffer], { type: 'image/jpeg' }))
      } else {
        console.error('Failed to downloading file')
      }
    }

  </script>

  <div class="flex w-full">
    <div class="flex w-full flex-wrap flex-row items-center justify-center px-5 text-gray-700 ">
      <div class="w-full py-4 px-4">
        <h2 class="text-2xl">File Stream Direct Download from BDM tester ( <a class="text-lg underline" target="_blank" href="https://bdm-dev.ec.txstate.edu/AppEnhancer/datasources/TEST/applications/510">BDM Upload Site link</a> )</h2>

          <br/>
          <Button icon={Download} size="small" disabled={!docId} on:click={downloadFile}>Download file</Button>
          <div class="w-1/4 mt-12">
            <TextInput class="mb-2" bind:value={docId} labelText="File document ID" placeholder="Enter Doc Id..." />
          </div>
      </div>

    </div>
  </div>
  <img id="img-test" width="800" height="600" alt="test" src={jpegBlob} />
