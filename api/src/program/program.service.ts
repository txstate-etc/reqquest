import { OneToManyLoader } from 'dataloader-factory'
import { AuthService, getPeriodPrograms, PeriodProgramFilters, Program, programRegistry } from '../internal.js'

const byPeriodId = new OneToManyLoader({
  fetch: async (periodIds: string[]) => {
    return await getPeriodPrograms({ periodIds })
  },
  extractKey: row => row.periodId
})

export class ProgramService extends AuthService<Program> {
  find (filter?: PeriodProgramFilters) {
    const filterKeys = new Set(filter?.keys)
    return programRegistry.list().filter(p => !filter || filterKeys.has(p.key)).map(p => new Program(p))
  }

  findByKeys (keys: string[]) {
    return this.find({ keys })
  }

  async findByPeriodId (periodId: string) {
    return await this.loaders.get(byPeriodId).load(periodId)
  }

  mayConfigure (program: Program) {
    return this.hasControl('Program', 'configure', program.authorizationKeys)
  }
}
