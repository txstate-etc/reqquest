<script lang="ts">
  import { ActionSet, Panel, TagSet } from '@txstate-mws/carbon-svelte'
  import { Tab, TabContent, Tabs, Tag } from 'carbon-components-svelte'
  import { SettingsEdit, View } from 'carbon-icons-svelte'
  import { invalidate } from '$app/navigation'
  import { api } from '$lib/api'
  import { page } from '$app/stores'
  import type { UIRegistry } from '$lib/registry'

  export let program: any
  export let sharedProgramRequirements: any
  export let openModal: any
  export let onClick: any
  export let uiRegistry: UIRegistry

  const disablePeriodProgram = (requirementKey: string) => async () => {
    const res = await api.disablePeriodProgramRequirements($page.params.id!, requirementKey, true)
    await invalidate('api:getPeriodConfigurations')
  }

  const enablePeriodProgram = (requirementKey: string) => async () => {
    const res = await api.disablePeriodProgramRequirements($page.params.id!, requirementKey, false)
    await invalidate('api:getPeriodConfigurations')
  }

  $: enabledRequirements = program.requirements.filter(r => r.enabled)
  $: disabledRequirements = program.requirements.filter(r => !r.enabled)

</script>
  <Panel title={program.title} expandable expanded>
    <Tabs autoWidth>
      <Tab label={`Enabled Requirements (${enabledRequirements.length})`} />
      <Tab label={`Disabled Requirements (${disabledRequirements.length})`} />
      <svelte:fragment slot='content'>
        <TabContent>
          {#each enabledRequirements as requirement (requirement.key)}
            {@const reqDef = uiRegistry.getRequirement(requirement.key)}
            <Panel title={requirement.title} expandable noPrimaryAction actions={[{ label: 'Configure requirement', onClick: onClick('requirement', requirement), disabled: reqDef?.configureComponent == null || !requirement.configuration.actions.update }, { label: 'Disable Requirement', onClick: disablePeriodProgram(requirement.key) }]}>
              <div style="display: content" slot="headerLeft">
                <TagSet tags={[{ label: 'Requirement', type: 'yellow' }, { label: `Applicant: ${requirement.type}`, type: 'purple' }]} />
              </div>
              <!-- <Button on:click={onClick('requirement', requirement)} type="primary" size="small" icon={SettingsEdit} iconDescription="Edit Configuration" disabled={reqDef.configureComponent == null || !requirement.configuration.actions.update} />  -->
            <div style="display: content" slot="headerRight">
              {@const tags = sharedProgramRequirements[requirement.key]?.length > 1 ? [{ label: 'Shared', onClick: openModal(requirement.key) }] : []}
              <TagSet tags={tags} />
            </div>

             <ul class="prompts">
                {#each requirement.prompts as prompt (prompt.key)}
                {@const promptDef = uiRegistry.getPrompt(prompt.key)}
                <li class="prompt justify-between">
                  <span>
                    <Tag type='green'>Prompt</Tag>{prompt.title}
                  </span>
                  <ActionSet
                    actions={[
                      { label: 'View', icon: View },
                      { label: 'settings', icon: SettingsEdit, disabled: promptDef?.configureComponent == null || !prompt.configuration.actions.update, onClick: onClick('prompt', prompt) }
                    ]}
                  />
                </li>
                {/each}
              </ul>
            </Panel>
          {/each}
        </TabContent>
        <TabContent>
          {#each disabledRequirements as requirement (requirement.key)}
            <Panel title={requirement.title} actions={[{ label: 'Enable Requirement', onClick: enablePeriodProgram(requirement.key) }]}>
              Requirement: {requirement.title}
              <ul class="prompts">
                {#each requirement.prompts as prompt (prompt.key)}
                  <li class="prompt">
                    Prompt: {prompt.title}
                  </li>
                {/each}
              </ul>
            </Panel>
          {/each}
        </TabContent>
      </svelte:fragment>
    </Tabs>
  </Panel>
