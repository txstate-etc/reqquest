import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { AuthService, getPeriodPrograms, getPeriodWorkflowStages, PeriodProgramFilters, Program, programRegistry } from '../internal.js'

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

const workflowStageByWorkflowId = new PrimaryKeyLoader({
  fetch: async (workflowIds: { periodId: string, programKey: string, workflowKey: string }[]) => {
    return await getPeriodWorkflowStages({ workflowIds })
  },
  extractId: workflowStage => ({ periodId: workflowStage.periodId, programKey: workflowStage.programKey, workflowKey: workflowStage.key })
})

const workflowStageByPeriodIdAndProgramKeyLoader = new OneToManyLoader({
  fetch: async (periodIdProgramKeys: { periodId: string, programKey: string }[]) => {
    return await getPeriodWorkflowStages({ periodIdProgramKeys })
  },
  extractKey: row => ({ periodId: row.periodId, programKey: row.programKey }),
  idLoader: workflowStageByWorkflowId
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

  async findWorkflowStagesByPeriodIdAndProgramKey (periodId: string, programKey: string) {
    return await this.loaders.get(workflowStageByPeriodIdAndProgramKeyLoader).load({ periodId, programKey })
  }

  async findWorkflowStage (periodId: string, programKey: string, workflowKey: string) {
    return await this.loaders.get(workflowStageByWorkflowId).load({ periodId, programKey, workflowKey })
  }

  mayConfigure (program: Program) {
    return this.hasControl('Program', 'configure', program.authorizationKeys)
  }
}
