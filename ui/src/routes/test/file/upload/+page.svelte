<script lang="ts">
  import { Form, FieldUpload, FieldTextInput, FieldHidden } from '@txstate-mws/carbon-svelte'
  import { api } from '$lib/api'

  const documentType = 'NOVEMBER2024TEST'

  async function uploadFiles (data: { files: File[], aid: string, docType: string }) {
    const operations = {
      query: `mutation($aid: String!, $docType: String!, $files: [UploadInfo!]!) {
          bdmUpload(aid: $aid, docType: $docType, files: $files) {
             id, pageCount
            }
          }`,
      variables: { aid: data.aid, docType: data.docType, files: data.files }
    }

    await api.graphqlWithUploads(operations.query, operations.variables)
    return {
      success: true,
      messages: [],
      data
    }
  }

</script>

<div class="flex w-full">
  <div class="flex w-full flex-wrap flex-row items-center justify-center px-5 text-gray-700 ">
    <div class="w-full py-4 px-4">
      <h2 class="text-2xl">File Stream Direct Upload to BDM tester ( <a class="text-lg underline" target="_blank" href="https://bdm-dev.ec.txstate.edu/AppEnhancer/datasources/TEST/applications/510">BDM Upload Site link</a> )</h2>
      <Form submit={uploadFiles}>
        <FieldHidden path="docType" value={documentType} />
        <FieldUpload
          path="files"
          multiple
          labelText="Select files to upload"
          helperText="Only PDF, GIF, or JPEG files are accepted."
          accept={['.pdf', '.gif', '.jpg', '.jpeg']}
        />
        <div class="w-1/4 mt-12">
          <FieldTextInput path="aid" class="mb-2" labelText="AID of User (file index)" placeholder="Enter AID..." />
        </div>
      </Form>
    </div>

  </div>
</div>
