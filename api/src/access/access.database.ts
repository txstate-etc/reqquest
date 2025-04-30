import db from 'mysql2-async/db'
import { AccessRole, AccessUser, type AccessUserFilter, AccessRoleFilter, AccessRoleGrant, ReqquestUser, AccessUserIdentifier, AccessGrantControl, AccessRoleInput, AccessRoleGrantCreate, AccessSubjectInstance, AccessGrantSubject, AccessGrantControlTag } from '../internal.js'

export interface AccessUserRow {
  id: number
  login: string
  fullname: string
  otherInfo?: string
}

export interface AccessUserIdentifierRow {
  userId: number
  id: string
  label: string
}

export interface AccessRoleRow {
  id: number
  name: string
  scope: string
}

export interface AccessRoleGroupRow {
  roleId: number
  groupId: number
}
export interface AccessRoleGroup {
  id: number
  name: string
}

export interface AccessRoleGrantRow {
  id: number
  roleId: number
  subjectType: string
  allow: 0 | 1
}

export interface AccessRoleGrantSubjectRow {
  grantId: number
  subject: string
  subjectType: string
  roleId: number
}

export interface AccessRoleGrantControlRow {
  id: number
  grantId: number
  control: string
  subjectType: string
  roleId: number
}

export interface AccessRoleGrantControlTagRow {
  controlId: number
  category: string
  tag: string
  subjectType: string
  control: string
  roleId: number
  grantId: number
}

export namespace AccessDatabase {
  function accessUserProcessFilter (filter?: AccessUserFilter) {
    const where: string[] = []
    const params: any[] = []
    const joinbinds: any[] = []
    const joins = new Map<string, string>()
    if (filter?.internalIds) {
      where.push(`id IN (${db.in(params, filter.internalIds)})`)
    }
    if (filter?.logins) {
      where.push(`login IN (${db.in(params, filter.logins)})`)
    }

    if (filter?.search) {
      joins.set('otherIdGrouped', `
        LEFT JOIN (
          SELECT userId, GROUP_CONCAT(id SEPARATOR " ") AS otherIdentifiers
          FROM accessUserIdentifiers
          GROUP BY userId
        ) AS otherIdGrouped ON accessUsers.id = otherIdGrouped.userId
      `)
      where.push('login LIKE ? OR fullname LIKE ? OR otherIdGrouped.otherIdentifiers LIKE ?')
      params.push(`%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`)
    }

    if (filter?.otherIdentifiers) {
      joins.set('otherIdAny', `
        INNER JOIN (
          SELECT DISTINCT userId
          FROM accessUserIdentifiers
          WHERE id IN (${db.in(joinbinds, filter.otherIdentifiers)})
        ) AS otherIdAny ON accessUsers.id = otherIdAny.userId
      `)
    }

    if (filter?.otherIdentifersByLabel) {
      joins.set('otherIdAnyByLabel', `
        LEFT JOIN (
          SELECT DISTINCT userId
          FROM accessUserIdentifiers
          WHERE (label, id) IN (${db.in(joinbinds, filter.otherIdentifersByLabel.map((r: any) => [r.label, r.id]))})
          GROUP BY userId
        ) AS otherIdAnyByLabel ON accessUsers.id = otherIdAnyByLabel.userId
      `)
    }

    return { where, params: [...joinbinds, ...params], joins }
  }

  export async function getAccessUsers (filter?: AccessUserFilter): Promise<AccessUser[]> {
    const { where, params, joins } = accessUserProcessFilter(filter)

    const rows = await db.getall<AccessUserRow>(`
      select * FROM accessUsers
      ${Array.from(joins.values()).join('\n')}
      ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
      order by accessUsers.login asc
    `, params)
    return rows.map(row => new AccessUser(row))
  }

  export async function upsertAccessUser (user: ReqquestUser): Promise<AccessUser> {
    await db.insert(`
      INSERT INTO accessUsers (login, fullname, otherInfo)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE fullname = VALUES(fullname), otherInfo = VALUES(otherInfo)
    `, [user.login, user.fullname, user.otherInfo])
    await db.transaction(async db => {
      const userId = await db.getval('SELECT id FROM accessUsers WHERE login = ? FOR UPDATE', [user.login])

      const otherIdentifiers = await db.getall<AccessUserIdentifierRow>('SELECT * FROM accessUserIdentifiers WHERE userId = ?', [userId])
      const otherIdentifiersExisting = new Set<string>(otherIdentifiers.map((r: any) => r.label + r.id))
      const otherIdentifiersCurrent = new Set<string>(user.otherIdentifiers?.map((r: any) => r.label + r.identifier))
      const otherIdentifiersToInsert = user.otherIdentifiers?.filter((r: any) => !otherIdentifiersExisting.has(r.label + r.identifier)) ?? []
      const otherIdentifiersToDelete = otherIdentifiers.filter((r: any) => !otherIdentifiersCurrent.has(r.label + r.id))
      if (otherIdentifiersToInsert.length > 0) {
        const binds: any[] = []
        await db.insert(`
          INSERT INTO accessUserIdentifiers (userId, label, id)
          VALUES ${db.in(binds, otherIdentifiersToInsert.map((r: any) => [userId, r.label, r.identifier]))}
          ON DUPLICATE KEY UPDATE userId = userId
        `, binds)
      }
      if (otherIdentifiersToDelete.length > 0) {
        const binds: any[] = [userId]
        await db.delete(`
          DELETE FROM accessUserIdentifiers
          WHERE userId = ? AND (label, id) IN (${db.in(binds, otherIdentifiersToDelete.map((r: any) => [r.label, r.id]))})
        `, binds)
      }

      const groups = await db.getvals<string>('SELECT g.name FROM accessGroups g INNER JOIN accessUserGroups ug ON g.id = ug.groupId WHERE ug.userId = ?', [userId])
      const groupsExisting = new Set<string>(groups)
      const groupsCurrent = new Set<string>(user.groups)
      const groupsToInsert = user.groups.filter((g: any) => !groupsExisting.has(g))
      const groupsToDelete = groups.filter((g: any) => !groupsCurrent.has(g))
      if (groupsToInsert.length > 0) {
        const binds: any[] = [userId]
        await db.insert(`
          INSERT INTO accessUserGroups (userId, groupId)
          SELECT ?, g.id FROM accessGroups g
          WHERE g.name IN (${db.in(binds, groupsToInsert)})
          ON DUPLICATE KEY UPDATE userId = userId
        `, binds)
      }
      if (groupsToDelete.length > 0) {
        const binds: any[] = [userId]
        await db.delete(`
          DELETE FROM accessUserGroups
          WHERE userId = ? AND groupId IN (${db.in(binds, groupsToDelete)})
        `, binds)
      }
    })
    return (await getAccessUsers({ logins: [user.login] }))[0]
  }

  export async function getOtherIdentifiersByUserIds (userInternalIds: number[]) {
    const params: any[] = []
    const rows = await db.getall<AccessUserIdentifierRow>(`
      SELECT userId, id, label
      FROM accessUserIdentifiers
      WHERE userId IN (${db.in(params, userInternalIds)})
    `, params)
    return rows.map(row => new AccessUserIdentifier(row))
  }

  function accessRoleProcessFilter (filter?: AccessRoleFilter) {
    const where: string[] = []
    const joins = new Map<string, string>()
    const params: any[] = []
    if (filter?.ids) {
      where.push(`ar.id IN (${db.in(params, filter.ids)})`)
    }
    if (filter?.names?.length) {
      where.push(`ar.name IN (${db.in(params, filter.names)})`)
    }
    if (filter?.groups?.length) {
      joins.set('arg', 'INNER JOIN accessRoleGroups arg ON ar.id = arg.roleId')
      joins.set('ag', 'INNER JOIN accessGroups ag ON arg.groupId = ag.id')
      where.push(`ag.name IN (${db.in(params, filter.groups)})`)
    }
    if (filter?.scopes?.length) {
      where.push(`scope IN (${db.in(params, filter.scopes)})`)
    }
    return { where, joins, params }
  }

  export async function getAccessRoles (filter?: AccessRoleFilter): Promise<AccessRole[]> {
    const { where, joins, params } = accessRoleProcessFilter(filter)
    const rows = await db.getall<AccessRoleRow>(`
      SELECT DISTINCT ar.*
      FROM accessRoles ar
      ${Array.from(joins.values()).join('\n')}
      ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY ar.name
    `, params)
    return rows.map(row => new AccessRole(row))
  }

  export async function getAccessRolesByUserIds (ids: number[]) {
    const binds: any[] = []
    return await db.getall<{ roleId: number, userId: number }>(`
      SELECT DISTINCT ar.id as roleId, aug.userId
      FROM accessRoles ar
      INNER JOIN accessRoleGroups arg ON ar.id = arg.roleId
      INNER JOIN accessUserGroups aug ON arg.groupId = aug.groupId
      WHERE aug.userId IN (${db.in(binds, ids)})
    `, binds)
  }

  export async function getGroupsByRoleIds (roleIds: string[]) {
    const params: any[] = []
    const rows = await db.getall<{ roleId: number, groupName: string }>(`
      SELECT arg.roleId, ag.name AS groupName
      FROM accessGroups ag
      INNER JOIN accessRoleGroups arg ON ag.id = arg.groupId
      WHERE arg.roleId IN (${db.in(params, roleIds)})
    `, params)
    return rows.map(row => ({ key: String(row.roleId), value: row.groupName }))
  }

  export async function getGroupsByUserIds (userInternalIds: number[]) {
    const params: any[] = []
    const rows = await db.getall<{ userId: number, groupName: string }>(`
      SELECT aug.userId, ag.name AS groupName
      FROM accessGroups ag
      INNER JOIN accessUserGroups aug ON ag.id = aug.groupId
      WHERE aug.userId IN (${db.in(params, userInternalIds)})
    `, params)
    return rows.map(row => ({ key: row.userId, value: row.groupName }))
  }

  export async function getAccessRoleGrants (filter: { ids?: string[], roleIds?: string[] }) {
    const params: any[] = []
    const where: string[] = []
    if (filter.ids) {
      where.push(`arg.id IN (${db.in(params, filter.ids)})`)
    }
    if (filter.roleIds) {
      where.push(`arg.roleId IN (${db.in(params, filter.roleIds)})`)
    }
    const rows = await db.getall<AccessRoleGrantRow>(`
      select arg.* from accessRoleGrants arg
      ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
      order by arg.subjectType, arg.id
    `, params)
    return rows.map(row => new AccessRoleGrant(row))
  }

  export async function getControlsByGrantIds (grantIds: string[]) {
    const params: any[] = []
    const rows = await db.getall<AccessRoleGrantControlRow>(`
      SELECT c.*, g.subjectType, g.roleId
      FROM accessRoleGrantControls c
      INNER JOIN accessRoleGrants g ON g.id = c.grantId
      WHERE c.grantId IN (${db.in(params, grantIds)})
      ORDER BY c.grantId, c.control
    `, params)
    return rows.map(row => new AccessGrantControl(row))
  }

  export async function getSubjectsByGrantIds (grantIds: string[]) {
    const params: any[] = []
    const rows = await db.getall<AccessRoleGrantSubjectRow>(`
      SELECT s.*, g.subjectType, g.roleId
      FROM accessRoleGrantSubjects s
      INNER JOIN accessRoleGrants g ON g.id = s.grantId
      WHERE s.grantId IN (${db.in(params, grantIds)})
      ORDER BY s.grantId, s.subject
    `, params)
    return rows.map(row => new AccessGrantSubject(row))
  }

  export async function getTagsByControlIds (controlIds: number[]) {
    const params: any[] = []
    const rows = await db.getall<AccessRoleGrantControlTagRow>(`
      SELECT t.*, c.control, c.grantId, g.roleId, g.subjectType
      FROM accessRoleGrantControlTags t
      INNER JOIN accessRoleGrantControls c ON c.id = t.controlId
      INNER JOIN accessRoleGrants g ON g.id = c.grantId
      WHERE controlId IN (${db.in(params, controlIds)})
      ORDER BY controlId, category, tag
    `, params)
    return rows.map(row => new AccessGrantControlTag(row))
  }

  export async function createAccessRole (role: AccessRoleInput) {
    return await db.transaction(async db => {
      const roleId = await db.insert(`
        INSERT INTO accessRoles (name, scope)
        VALUES (?, ?)
      `, [role.name, role.scope])
      if (role.groups?.length) {
        const binds: any[] = [roleId]
        await db.insert(`
          INSERT INTO accessRoleGroups (roleId, groupId)
          SELECT ?, g.id FROM accessGroups g
          WHERE g.name IN (${db.in(binds, role.groups)})
          ON DUPLICATE KEY UPDATE roleId = roleId
        `, binds)
      }
      return roleId
    })
  }

  export async function updateAccessRole (id: string, role: AccessRoleInput) {
    return await db.transaction(async db => {
      await db.update(`
        UPDATE accessRoles
        SET name = ?, scope = ?
        WHERE id = ?
      `, [role.name, role.scope, id])
      const dbinds: any[] = [id]
      if (role.groups?.length) {
        await db.delete(`
          DELETE arg FROM accessRoleGroups arg
          INNER JOIN accessGroups g ON arg.groupId = g.id
          WHERE arg.roleId = ?
          AND g.name NOT IN (${db.in(dbinds, role.groups ?? [])})
        `, dbinds)
        const ibinds: any[] = [id]
        await db.insert(`
          INSERT INTO accessRoleGroups (roleId, groupId)
          SELECT ?, g.id FROM accessGroups g
          WHERE g.name IN (${db.in(ibinds, role.groups ?? [])})
          ON DUPLICATE KEY UPDATE roleId = roleId
        `, ibinds)
      } else {
        await db.delete(`
          DELETE arg FROM accessRoleGroups arg
          INNER JOIN accessGroups g ON arg.groupId = g.id
          WHERE arg.roleId = ?
        `, dbinds)
      }
    })
  }

  export async function deleteAccessRole (id: string) {
    // group links and grants will be deleted due to foreign key constraint ON DELETE CASCADE
    await db.delete('DELETE FROM accessRoles WHERE id = ?', [id])
  }

  export async function addAccessRoleGrant (roleId: string, grantInput: AccessRoleGrantCreate) {
    return await db.transaction(async db => {
      const grantId = await db.insert(`
        INSERT INTO accessRoleGrants (roleId, subjectType, allow)
        VALUES (?, ?, ?)
      `, [roleId, grantInput.subjectType, grantInput.allow])
      const binds: any[] = [grantId]
      if (grantInput.subjects?.length) {
        await db.insert(`
          INSERT INTO accessRoleGrantSubjects (grantId, subject)
          VALUES ${db.in(binds, grantInput.subjects)}
          ON DUPLICATE KEY UPDATE grantId = grantId
        `, binds)
      }
      for (const control of grantInput.controls) {
        const controlId = await db.insert(`
          INSERT INTO accessRoleGrantControls (grantId, control)
          VALUES (?, ?)
        `, [grantId, control.control])
        const binds: any[] = [controlId]
        if (control.tags?.length) {
          await db.insert(`
            INSERT INTO accessRoleGrantControlTags (controlId, category, tag)
            VALUES ${db.in(binds, control.tags.map((r: any) => [controlId, r.category, r.tag]))}
            ON DUPLICATE KEY UPDATE controlId = controlId
          `, binds)
        }
      }
      return grantId
    })
  }

  export async function updateAccessRoleGrant (grantId: string, grantInput: AccessRoleGrantCreate) {
    return await db.transaction(async db => {
      await db.update(`
        UPDATE accessRoleGrants
        SET subjectType = ?, allow = ?
        WHERE id = ?
      `, [grantInput.subjectType, grantInput.allow, grantId])
      const binds: any[] = [grantId]

      if (grantInput.subjects?.length) {
        const dsbinds: any[] = [grantId]
        await db.delete(`
          DELETE FROM accessRoleGrantSubjects
          WHERE grantId = ? AND subject NOT IN (${db.in(dsbinds, grantInput.subjects)})
        `, dsbinds)
        await db.insert(`
          INSERT INTO accessRoleGrantSubjects (grantId, subject)
          VALUES ${db.in(binds, grantInput.subjects)}
          ON DUPLICATE KEY UPDATE grantId = grantId
        `, binds)
      } else {
        await db.delete(`
          DELETE FROM accessRoleGrantSubjects
          WHERE grantId = ?
        `, binds)
      }

      const dcbinds: any[] = [grantId]

      // delete controls that are not in the new list
      // associated tags will be deleted due to foreign key constraint ON DELETE CASCADE
      await db.delete(`
        DELETE FROM accessRoleGrantControls c
        WHERE c.grantId = ? AND c.control NOT IN (${db.in(dcbinds, grantInput.controls.map((r: any) => r.control))})
      `, dcbinds)
      await db.insert(`
        INSERT INTO accessRoleGrantControls (grantId, control)
        VALUES ${db.in(binds, grantInput.controls.map((r: any) => [grantId, r.control]))}
        ON DUPLICATE KEY UPDATE grantId = grantId
      `, binds)

      for (const control of grantInput.controls) {
        if (control.tags?.length) {
          const dtbinds: any[] = [grantId, control.control]
          await db.delete(`
            DELETE t FROM accessRoleGrantControlTags t
            INNER JOIN accessRoleGrantControls arg ON t.controlId = arg.id
            WHERE arg.grantId = ? AND arg.control = ? AND (t.category, t.tag) NOT IN (${db.in(dtbinds, grantInput.controls.flatMap(c => c.tags?.map(t => [t.category, t.tag])))})
          `, dtbinds)
          await db.insert(`
            INSERT INTO accessRoleGrantControlTags (controlId, category, tag)
            VALUES ${db.in(dtbinds, control.tags.map((r: any) => [control.control, r.category, r.tag]))}
            ON DUPLICATE KEY UPDATE controlId = controlId
          `, dtbinds)
        } else {
          await db.delete(`
            DELETE t FROM accessRoleGrantControlTags t
            INNER JOIN accessRoleGrantControls arg ON t.controlId = arg.id
            WHERE arg.grantId = ? AND arg.control = ?
          `, [grantId, control.control])
        }
      }
    })
  }

  export async function deleteAccessRoleGrant (grantId: string) {
    // controls, subjects, and tags will be deleted due to foreign key constraint ON DELETE CASCADE
    await db.delete('DELETE FROM accessRoleGrants g WHERE id = ?', [grantId])
  }
}
