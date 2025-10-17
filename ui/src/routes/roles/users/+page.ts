import { api } from '$lib'
import { extractMergedFilters, extractPaginationParams, type ColumnDefinition } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import type { AccessUserFilter, Pagination } from '$lib'

export const load: PageLoad = async ({ url, depends }) => {
  const { search, applicationRoles } = extractMergedFilters(url)
  const { page, pagesize } = extractPaginationParams(url)
  const pageFilter: Pagination = { page, perPage: pagesize }
  // Get access data
  const accessUsersFilter: AccessUserFilter = {}
  if (search) accessUsersFilter.search = search
  // groupings is a map<label, ids>
  if (Array.isArray(applicationRoles) && applicationRoles.length > 0) {
    accessUsersFilter.roles = applicationRoles
  }
  // Dynamically add groupings
  // const groupings = new Map<string, string[]>()
  // if (Array.isArray(institutionalRoles) && institutionalRoles.length > 0) {
  //   for (const id of institutionalRoles) groupings.push({ label: 'institutionalRole', id })
  // }
  // if (groupings.size > 0) accessUsersFilter.otherGroupingsByLabel = Array.from(groupings).map(g => ({ label: g[0], ids: g[1] }))
  const { users, pageInfo } = await api.getAccessUsers(accessUsersFilter, pageFilter)

  interface User {
    // Local data
    id: string
    // ids = id + otherId
    ids: string
    // contact = fullname + email
    contact: string
    applicationRoles: string
    groups: string
    // Remote data
    // otherInfo?: any
    // institutionalRoles?: string[]
    // lastLogin?: string
    [key: string]: string | undefined
  }
  const rows = users.map(u => {
    const user: User = {
      id: u.login,
      ids: [u.login, u.otherInfo?.otherId].filter(id => id != null).join('<br>'),
      contact: u.otherInfo?.email ? u.fullname + '<br>' + u.otherInfo.email : u.fullname,
      applicationRoles: u.roles.map(r => r.name).join(', '),
      groups: u.groups.join(', ')
      // otherInfo: u.otherInfo
      // institutionalRoles: u.otherInfo?.institutionalRoles ?? [],
      // lastLogin: u.otherInfo?.lastLogin ? DateTime.fromISO(u.otherInfo?.lastLogin).toFormat('MM/dd/yyyy') : 'unknown'
    }
    if (u.otherInfo) {
      for (const group of pageInfo?.groupings ?? []) {
        const label = group.label
        if (group.useInList) user[label] = Array.isArray(u.otherInfo[label]) ? u.otherInfo[label].join(', ') : u.otherInfo[label].toString()
      }
    }
    return user
  })

  const columns: ColumnDefinition<User>[] = [
    { id: 'contact', label: 'Name', get: 'contact' },
    { id: 'id', label: 'IDs', get: 'ids' },
    { id: 'applicationRoles', label: 'Application Roles', get: 'applicationRoles' },
    { id: 'groups', label: 'Groups', get: 'groups' }
    // TODO: Dynamically pull extra grouping columns
    // { id: 'institutionalRoles', label: 'Institutional Roles', render: user => user['institutionalRoles'] ? user['institutionalRoles'].join(', ') : '' },
    // { id: 'lastLogin', label: 'Last Login', get: 'lastLogin' }
  ]
  for (const group of pageInfo?.groupings ?? []) {
    const label = group.label
    if (group.useInList) columns.push({ id: label, label: group.displayLabel ? group.displayLabel : label, get: label })
    // if (group.useInFilters)
  }

  depends('api:getAccessUsers')
  return { columns, rows, page: pageInfo?.currentPage, totalItems: pageInfo?.totalItems }
}
