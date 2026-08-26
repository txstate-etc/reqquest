import { programRegistry, promptRegistry, requirementRegistry, RequirementType, type WorkflowStage } from '../internal.js'

interface Claimant {
  kind: string
  title: string
  /**
   * The definition object itself, so the same one appearing in several places counts once. A
   * workflow stage may legitimately be shared between programs, and comparing occurrences rather
   * than identity would report that sharing as a collision.
   */
  owner: object | symbol
}

const reservedPhase = Symbol('RequirementType')

/**
 * Fails startup when two definitions claim the same key.
 *
 * Prompt, requirement, program and workflow stage keys are not separate namespaces. They are all
 * tag values in the same authorization categories (see `access.structure.ts`), alongside the
 * `RequirementType` phase names, and a prompt's `authorizationKeys` include both its own key and its
 * requirement's - so a grant scoped to requirement `foo` would also match an unrelated prompt keyed
 * `foo`. Prompt and requirement configuration additionally share one row per key in
 * `period_configurations`, so a collision means the two silently overwrite each other's config.
 *
 * Both failures are invisible at runtime, which is why this refuses to start instead of warning.
 */
export function assertNoKeyCollisions () {
  const claims = new Map<string, Claimant[]>()
  const claim = (key: string, kind: string, title: string, owner: object | symbol) => {
    const existing = claims.get(key) ?? []
    // identity, not occurrence - a shared workflow stage is one claimant however many programs use it
    if (existing.some(c => c.owner === owner)) return
    existing.push({ kind, title, owner })
    claims.set(key, existing)
  }

  for (const phase of Object.values(RequirementType)) claim(phase, 'reserved RequirementType phase value', phase, reservedPhase)
  // list() rather than the keyed maps as the maps have already collapsed duplicates registered under the same key, those duplicates we want to catch
  for (const prompt of promptRegistry.list()) claim(prompt.key, 'prompt', prompt.title, prompt)
  for (const requirement of requirementRegistry.list()) claim(requirement.key, 'requirement', requirement.title, requirement)
  for (const program of programRegistry.list()) {
    claim(program.key, 'program', program.title, program)
    for (const stage of program.workflowStages ?? [] as WorkflowStage[]) claim(stage.key, 'workflow stage', stage.title, stage)
  }

  const collisions = [...claims].filter(([, claimants]) => claimants.length > 1)
  if (collisions.length === 0) return

  const detail = collisions
    .map(([key, claimants]) => `  '${key}'\n${claimants.map(c => `      ${c.kind}: ${c.title}`).join('\n')}`)
    .join('\n')
  throw new Error(
    `${collisions.length} key collision${collisions.length === 1 ? '' : 's'}. Prompt, requirement, program and workflow stage keys all become tag values in the same authorization namespace, and prompt/requirement configuration shares one row per key, so every key must be distinct:\n\n${detail}\n`
  )
}
