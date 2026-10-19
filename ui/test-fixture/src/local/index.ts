import { UIRegistry, type UIConfig } from '@reqquest/ui'
import FixturePrompt from './FixturePrompt.svelte'

const config: UIConfig = {
  appName: 'Overlay fixture',
  programs: {},
  requirements: {},
  prompts: {
    fixture_prompt: { formComponent: FixturePrompt, displayComponent: FixturePrompt }
  }
}

export const uiRegistry = new UIRegistry(config)
