<script lang="ts">
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { enumApplicationStatus } from '$lib/typed-client'
  import type { LayoutData } from './$types'

  export let data: LayoutData
  $: ({ appRequestForNavigation, prequalPrompts } = data)
</script>

<div class="leftcol">
{#each prequalPrompts as prompt (prompt.id)}
  {#if $page.params.promptKey === prompt.key}--&gt;{/if}
  <a href="{base}/requests/{appRequestForNavigation.id}/apply/{prompt.key}">{prompt.navTitle}</a>
{/each}
{#if appRequestForNavigation.applications.length && !appRequestForNavigation.applications.some(a => a.status === enumApplicationStatus.PREQUAL)}
  <ul>
    {#each appRequestForNavigation.applications as application (application.id)}
      <li style:font-weight="bold">{application.navTitle}</li>
      {@const qualRequirements = application.requirements}
      {#if qualRequirements.length}
        <ul>
          {#each qualRequirements as requirement (requirement.id)}
            {#each requirement.prompts as prompt (prompt.id)}
              <li>
                {#if $page.params.promptKey === prompt.key}--&gt;{/if}
                <a href="{base}/requests/{appRequestForNavigation.id}/apply/{prompt.key}">{prompt.navTitle}</a>
              </li>
            {/each}
          {/each}
        </ul>
      {/if}
    {/each}
  </ul>
{/if}
</div>
<div class="rightcol">
  <slot />
</div>

<style>
  .leftcol {
    width: 20%;
    float: left;
    padding: 1rem;
  }
  .rightcol {
    width: 80%;
    float: right;
    padding: 1rem;
  }
</style>
