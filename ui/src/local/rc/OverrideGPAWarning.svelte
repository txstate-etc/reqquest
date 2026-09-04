<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'

  export let data: { override?: boolean } | undefined = undefined
  $: priorOverride = data?.override

  function onUpdate (e: CustomEvent<boolean>) {
    const override = e.detail
    const wasOverride = priorOverride
    priorOverride = override
    if (override && !wasOverride) {
      toasts.add({
        type: 'warning',
        title: 'GPA minimum overridden',
        message: 'Overriding the GPA may make some programs eligible. Message is custom for this prompt and would need to be configured by downstream devs ;)'
      })
    } else if (!override && wasOverride) {
      toasts.add({
        type: 'warning',
        title: 'GPA override removed',
        message: 'Removing the overridden GPA may make some programs ineligible. Message is custom for this prompt and would need to be configured by downstream devs ;)'
      })
    }
  }
</script>

<FieldRadio boolean path="override" legendText="Override the minimum GPA requirement?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} on:update={onUpdate} />
