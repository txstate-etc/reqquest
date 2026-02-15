import type { FastifyInstanceTyped } from 'fastify-txstate'
import { Readable } from 'node:stream'
import { csv, csvLine } from 'txstate-utils'
import { AccessUserService, appConfig, AppRequestIndexCategory, AppRequestService, extractMergedFilters, IndexValue, PaginationInfoWithTotalItems, PeriodService, promptRegistry, saveTicket } from '../internal.js'

export async function installAppRequestRoutes (app: FastifyInstanceTyped) {
  app.get('/csv/:ticket/requests/:filename.csv', {
    schema: {
      params: {
        type: 'object',
        properties: {
          ticket: { type: 'string' },
          filename: { type: 'string' }
        },
        required: ['ticket', 'filename']
      },
      querystring: {
        type: 'object',
        properties: {
          f: { type: 'object' },
          q: { type: 'object' },
          t: { anyOf: [{ type: 'object' }, { type: 'string' }] },
          search: { type: 'string' }
        }
      }
    }
  }, async (req, res) => {
    const ctx = await appConfig.getCtx(req)
    await ctx.acceptTicket(req.params.ticket)

    res.header('Content-Type', 'text/csv')
    res.header('Content-Disposition', `attachment; filename="${req.params.filename}.csv"`)

    const filters = extractMergedFilters(req.query)
    const catsForCSV = promptRegistry.indexCategories.filter(category => category.useInAppRequestList)

    async function* generateCsv () {
      yield Buffer.from([0xEF, 0xBB, 0xBF]) // UTF-8 BOM
      yield csvLine(['Id', 'Period', 'Login', 'Name', 'Created', 'Submitted', 'Status', ...catsForCSV.map(c => c.categoryLabel ?? c.category)])
      let hasMore = true
      let page = 1
      while (hasMore) {
        const pageInfo = new PaginationInfoWithTotalItems(page)
        const appRequests = await ctx.svc(AppRequestService).find(filters, { page, perPage: 200 }, pageInfo)
        const periodSvc = ctx.svc(PeriodService)
        const userSvc = ctx.svc(AccessUserService)
        const entries = await Promise.all(appRequests.map(async d => {
          const [period, applicant] = await Promise.all([
            periodSvc.findById(d.periodId),
            userSvc.findByInternalId(d.userInternalId)
          ])

          // add indexes from the appRequest that are tagged for inclusion on the appRequest list screen
          const cats = catsForCSV.map(category => new AppRequestIndexCategory(category, d.tags?.[category.category] ?? []))
          const catsWithValues = await Promise.all(cats.map(async c => {
            const values = await Promise.all(c.tagStrings.map(async tag => new IndexValue(tag, await promptRegistry.getTagLabel(c.category, tag))))
            return { ...c, values }
          }))

          return [
            d.id,
            period!.name,
            applicant!.login,
            applicant!.fullname,
            d.createdAt.toFormat('f').replace(',', ''),
            d.submittedAt?.toFormat('f').replace(',', '') ?? '',
            d.status,
            ...catsWithValues.map(c => c.values.map(v => v.label).join(', '))
          ]
        }))
        yield csv(entries)
        hasMore = pageInfo.hasNextPage
        page++
      }
    }
    const stream = Readable.from(generateCsv())
    return stream
  })
  app.post('/ticket', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            ticket: { type: 'string' }
          },
          required: ['ticket']
        }
      }
    }
  }, async (req, res) => {
    const ctx = await appConfig.getCtx(req)
    if (!ctx.auth) return res.status(401).send()
    // generate a crypto-secure random code
    const ticket = Buffer.from(crypto.getRandomValues(new Uint32Array(12))).toString('base64url')
    await saveTicket(ticket, ctx.auth)
    return { ticket }
  })
}
