import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { AuthService, getPeriodPrograms, PeriodProgramFilters, Program, programRegistry } from '../internal.js'

const periodProgramByPeriodAndKey = new PrimaryKeyLoader({
  fetch: async (periodKeys: { periodId: string, key: string }[]) => {
    return await getPeriodPrograms({ periodKeys })
  },
  extractId: periodProgram => ({ periodId: periodProgram.periodId, key: periodProgram.key })
})

const byPeriodId = new OneToManyLoader({
  fetch: async (periodIds: string[]) => {
    return await getPeriodPrograms({ periodIds })
  },
  extractKey: row => row.periodId,
  idLoader: periodProgramByPeriodAndKey
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

  async findPeriodProgramByKey (periodId: string, key: string) {
    return await this.loaders.get(periodProgramByPeriodAndKey).load({ periodId, key })
  }

  mayConfigure (program: Program) {
    return this.hasControl('Program', 'configure', program.authorizationKeys)
  }
}
