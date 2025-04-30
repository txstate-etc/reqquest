import { AuthService, programGroupRegistry, ProgramGroup, type ProgramGroupFilter } from '../internal.js'

export class ProgramGroupService extends AuthService<ProgramGroup> {
  find (filter?: ProgramGroupFilter) {
    const keys = new Set(filter?.keys)
    return programGroupRegistry.list().filter(g => keys.size === 0 || keys.has(g.key)).map(p => new ProgramGroup(p))
  }

  findByKey (key: string) {
    return new ProgramGroup(programGroupRegistry.get(key))
  }

  findByProgram (key: string) {
    return new ProgramGroup(programGroupRegistry.getByProgramKey(key))
  }
}
