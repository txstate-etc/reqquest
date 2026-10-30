import { BaseService } from '@txstate-mws/graphql-server'
import { groupby } from 'txstate-utils'
import {
  AppRequest, AppRequestPhase, AppRequestServiceInternal, PeriodService, promptRegistry, PROMPT_PRESTAGE_NS,
  RequirementPromptService, type PreviousRequestResult, type PreviousRequestSelector
} from '../internal.js'

/**
 * Backs the `previous` selector handed to prompt hooks. The selector is always built from the current
 * app request, so the applicant whose history is read is fixed by the system, never by the caller.
 */
export class PreviousRequestService extends BaseService {
  #byUser = new Map<number, Promise<AppRequest[]>>()

  protected async findForUser (userInternalId: number) {
    if (!this.#byUser.has(userInternalId)) this.#byUser.set(userInternalId, this.svc(AppRequestServiceInternal).find({ userInternalIds: [userInternalId] }))
    return await this.#byUser.get(userInternalId)!
  }

  selector (appRequest: AppRequest, callingPromptKey: string): PreviousRequestSelector {
    return async ({ prompts, coalesce = false, submittedOnly = true }) => {
      const keys = Array.from(new Set(prompts))
      // whatever an applicant-facing prompt returns or saves may reach the applicant, so it may only read
      // prompts the applicant could see anyway, whoever happens to be running it
      const forApplicant = promptRegistry.isUserPrompt(callingPromptKey)
      if (forApplicant) {
        for (const key of keys) {
          if (!promptRegistry.isUserPrompt(key) && !promptRegistry.get(key)?.exposeToApplicant) throw new Error(`Prompt ${callingPromptKey} is shown to applicants and may not read previous answers to the reviewer-only prompt ${key}.`)
        }
      }

      const earlier = (await this.findForUser(appRequest.userInternalId))
        .filter(ar => ar.internalId !== appRequest.internalId
          && (ar.createdAt < appRequest.createdAt || (+ar.createdAt === +appRequest.createdAt && ar.internalId < appRequest.internalId))
          && (!submittedOnly || ar.phase !== AppRequestPhase.STARTED))
        .sort((a, b) => +b.createdAt - +a.createdAt || b.internalId - a.internalId)
      if (!earlier.length) return undefined

      // removes prompts the current user may not view in that request, the same as reading it directly would
      const reqPromptSvc = this.svc(RequirementPromptService)
      const answeredByRequest = await Promise.all(earlier.map(async ar => await reqPromptSvc.findByAppRequest(ar, { promptKeys: keys, answered: true })))

      const chosen: { appRequest: AppRequest, key: string, unredacted: boolean }[] = []
      const taken = new Set<string>()
      for (const [i, ar] of earlier.entries()) {
        const byKey = groupby(answeredByRequest[i].filter(p => !p.invalidated && !taken.has(p.key)), 'key')
        for (const [key, rows] of Object.entries(byKey)) {
          // a prompt shared by several requirements has a row per requirement, and access is granted per row
          const unredacted = !(forApplicant && !promptRegistry.isUserPrompt(key)) && rows.some(p => reqPromptSvc.mayViewUnredacted(p))
          chosen.push({ appRequest: ar, key, unredacted })
          taken.add(key)
        }
        if (taken.size === keys.length || (!coalesce && taken.size > 0)) break
      }
      if (!chosen.length) return undefined

      const result: PreviousRequestResult = { data: {}, source: {} }
      await Promise.all(chosen.map(async ({ appRequest: ar, key, unredacted }) => {
        const [data, period] = await Promise.all([
          this.svc(AppRequestServiceInternal).getData(ar.internalId),
          this.svc(PeriodService).findById(ar.periodId)
        ])
        // signed prestage data belongs to the request it was signed for; the current request stages its own
        const { [PROMPT_PRESTAGE_NS]: prestage, ...answer } = data[key] ?? {}
        const value = unredacted ? answer : promptRegistry.get(key)?.exposeToApplicant?.(answer)
        if (value == null) return
        result.data[key] = value
        result.source[key] = { appRequestId: ar.id, createdAt: ar.createdAt, periodId: ar.periodId, periodCode: ar.periodCode, periodName: period?.name ?? '' }
      }))
      return Object.keys(result.data).length ? result : undefined
    }
  }
}
