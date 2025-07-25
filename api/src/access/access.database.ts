import db from 'mysql2-async/db'
import {
  AccessRole, AccessUser, type AccessUserFilter, AccessRoleFilter, AccessRoleGrant, ReqquestUser,
  AccessUserIdentifier, AccessRoleInput, AccessRoleGrantCreate, AccessGrantTag
} from '../internal.js'

export interface AccessUserRow {
  id: number
  login: string
  fullname: string
  otherInfo?: string
  stillValid: 0 | 1
}

export interface AccessUserIdentifierRow {
  userId: number
  id: string
  label: string
}

export interface AccessRoleRow {
  id: number
  name: string
  description: string
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

export interface AccessRoleGrantTagRow {
  grantId: number
  category: string
  tag: string
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

    if (filter?.otherIdentifiersByLabel) {
      joins.set('otherIdAnyByLabel', `
        LEFT JOIN (
          SELECT DISTINCT userId
          FROM accessUserIdentifiers
          WHERE (label, id) IN (${db.in(joinbinds, filter.otherIdentifiersByLabel.map((r: any) => [r.label, r.id]))})
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
    `, [user.login, user.fullname, JSON.stringify(user.otherInfo)])
    await db.transaction(async db => {
      const userId = await db.getval('SELECT id FROM accessUsers WHERE login = ? FOR UPDATE', [user.login])

      if (user.otherIdentifiers?.length) {
        const ibinds: any[] = []
        await db.insert(`
          INSERT INTO accessUserIdentifiers (userId, label, id)
          VALUES ${db.in(ibinds, user.otherIdentifiers.map((r: any) => [userId, r.label, r.identifier]))}
          ON DUPLICATE KEY UPDATE userId = userId
        `, ibinds)
        const dbinds: any[] = [userId]
        await db.delete(`
          DELETE FROM accessUserIdentifiers
          WHERE userId = ? AND (label, id) NOT IN (${db.in(dbinds, user.otherIdentifiers.map((r: any) => [r.label, r.id]))})
        `, dbinds)
      } else {
        await db.delete('DELETE FROM accessUserIdentifiers WHERE userId = ?', [userId])
      }

      if (user.groups?.length) {
        const ibinds: any[] = []
        await db.insert(`
          INSERT INTO accessUserGroups (userId, groupName)
          VALUES ${db.in(ibinds, user.groups.map((g: any) => [userId, g]))}
          ON DUPLICATE KEY UPDATE userId = userId
        `, ibinds)
        const dbinds: any[] = [userId]
        await db.delete(`
          DELETE FROM accessUserGroups
          WHERE userId = ? AND groupName NOT IN (${db.in(dbinds, user.groups)})
        `, dbinds)
      } else {
        await db.delete('DELETE FROM accessUserGroups WHERE userId = ?', [userId])
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
      where.push(`arg.groupName IN (${db.in(params, filter.groups)})`)
    }
    if (filter?.scopes?.length) {
      where.push(`ar.scope IN (${db.in(params, filter.scopes)})`)
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
      INNER JOIN accessUserGroups aug ON arg.groupName = aug.groupName
      WHERE aug.userId IN (${db.in(binds, ids)})
    `, binds)
  }

  export async function getAllGroups () {
    return await db.getvals<string>('SELECT DISTINCT groupName FROM accessRoleGroups')
  }

  export async function getGroupsByRoleIds (roleIds: string[]) {
    const params: any[] = []
    const rows = await db.getall<{ roleId: number, groupName: string }>(`
      SELECT arg.roleId, arg.groupName
      FROM accessRoleGroups arg
      WHERE arg.roleId IN (${db.in(params, roleIds)})
    `, params)
    return rows.map(row => ({ key: String(row.roleId), value: row.groupName }))
  }

  export async function getGroupsByUserIds (userInternalIds: number[]) {
    const params: any[] = []
    const rows = await db.getall<{ userId: number, groupName: string }>(`
      SELECT aug.userId, aug.groupName
      FROM accessUserGroups aug
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
    return await db.getall<{ grantId: number, control: string }>(`
      SELECT c.control, c.grantId
      FROM accessRoleGrantControls c
      WHERE c.grantId IN (${db.in(params, grantIds)})
      ORDER BY c.grantId, c.control
    `, params)
  }

  export async function getTagsByGrantIds (grantIds: number[]) {
    const params: any[] = []
    const rows = await db.getall<AccessRoleGrantTagRow>(`
      SELECT t.*, g.subjectType, g.roleId
      FROM accessRoleGrantTags t
      INNER JOIN accessRoleGrants g ON g.id = t.grantId
      WHERE t.grantId IN (${db.in(params, grantIds)})
      ORDER BY t.grantId, t.category, t.tag
    `, params)
    return rows.map(row => new AccessGrantTag(row))
  }

  export async function createAccessRole (role: AccessRoleInput) {
    return await db.transaction(async db => {
      const roleId = await db.insert(`
        INSERT INTO accessRoles (name, scope, description)
        VALUES (?, ?, ?)
      `, [role.name, role.scope, role.description])
      if (role.groups?.length) {
        const binds: any[] = []
        await db.insert(`
          INSERT INTO accessRoleGroups (roleId, groupName)
          VALUES ${db.in(binds, role.groups.map((g: any) => [roleId, g]))}
          ON DUPLICATE KEY UPDATE roleId = roleId
        `, binds)
      }
      return roleId
    })
  }

  export async function updateAccessRole (id: string, role: AccessRoleInput) {
    return await db.transaction(async db => {
      await db.update('UPDATE accessRoles SET name = ?, scope = ?, description = ? WHERE id = ?', [role.name, role.scope, role.description, id])
      if (role.groups?.length) {
        const ibinds: any[] = []
        await db.insert(`
          INSERT INTO accessRoleGroups (roleId, groupName)
          VALUES ${db.in(ibinds, role.groups.map((g: any) => [id, g]))}
          ON DUPLICATE KEY UPDATE roleId = roleId
        `, ibinds)
        const dbinds: any[] = [id]
        await db.delete(`
          DELETE FROM accessRoleGroups arg
          WHERE arg.roleId = ?
          AND arg.groupName NOT IN (${db.in(dbinds, role.groups)})
        `, dbinds)
      } else {
        await db.delete('DELETE FROM accessRoleGroups WHERE roleId = ?', [id])
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

      if (grantInput.controls?.length) {
        const binds: any[] = []
        await db.insert(`
          INSERT INTO accessRoleGrantControls (grantId, control)
          VALUES ${db.in(binds, grantInput.controls.map(control => [grantId, control]))}
        `, binds)
      }
      if (grantInput.tags?.length) {
        const binds: any[] = []
        await db.insert(`
          INSERT INTO accessRoleGrantTags (grantId, category, tag)
          VALUES ${db.in(binds, grantInput.tags.map((r: any) => [grantId, r.category, r.tag]))}
        `, binds)
      }
      return grantId
    })
  }

  export async function updateAccessRoleGrant (grantId: string, grantInput: AccessRoleGrantCreate) {
    return await db.transaction(async db => {
      await db.update('UPDATE accessRoleGrants SET subjectType = ?, allow = ? WHERE id = ?', [grantInput.subjectType, grantInput.allow, grantId])

      if (grantInput.controls?.length) {
        const ibinds: any[] = []
        await db.insert(`
          INSERT INTO accessRoleGrantControls (grantId, control)
          VALUES ${db.in(ibinds, grantInput.controls.map(control => [grantId, control]))}
          ON DUPLICATE KEY UPDATE grantId = grantId
        `, ibinds)
        const dbinds: any[] = [grantId]
        await db.delete(`
          DELETE FROM accessRoleGrantControls
          WHERE grantId = ? AND control NOT IN (${db.in(dbinds, grantInput.controls)})
        `, dbinds)
      } else {
        await db.delete('DELETE FROM accessRoleGrantControls WHERE grantId = ?', [grantId])
      }
      if (grantInput.tags?.length) {
        const dbinds: any[] = [grantId]
        await db.delete(`
          DELETE FROM accessRoleGrantTags
          WHERE grantId = ? AND (category, tag) NOT IN (${db.in(dbinds, grantInput.tags.map((r: any) => [r.category, r.tag]))})
        `, dbinds)
        const binds: any[] = []
        await db.insert(`
          INSERT INTO accessRoleGrantTags (grantId, category, tag)
          VALUES ${db.in(binds, grantInput.tags.map((r: any) => [grantId, r.category, r.tag]))}
          ON DUPLICATE KEY UPDATE grantId = grantId
        `, binds)
      } else {
        await db.delete('DELETE FROM accessRoleGrantTags WHERE grantId = ?', [grantId])
      }
    })
  }

  export async function deleteAccessRoleGrant (grantId: string) {
    // controls, subjects, and tags will be deleted due to foreign key constraint ON DELETE CASCADE
    await db.delete('DELETE FROM accessRoleGrants g WHERE id = ?', [grantId])
  }
}
