<script lang="ts">
  import { FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { CriticalThinking } from './types.js'
  export let gatheredConfigData
  export let data: Partial<CriticalThinking>
</script>

<FieldTextArea path='criticalThinkingAnswer' labelText='What is one website or app you use for school that frustrates you? If you were the developer, what one feature would you add or change to make it easier for students to use?' />
