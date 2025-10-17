import { api } from '$lib'
import { extractMergedFilters, extractPaginationParams, type ColumnDefinition, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import type { AccessUserFilter, Pagination } from '$lib'
import { omit } from 'txstate-utils'

export const load: PageLoad = async ({ url, depends }) => {
  const query = extractMergedFilters(url)
  const { search, applicationRoles } = query
  const groupingsQuery = omit(query, 'search', 'applicationRoles')
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
  const groupings = Object.keys(groupingsQuery)
  for (const grouping of groupings) {
    if (groupingsQuery[grouping] != null) {
      accessUsersFilter.otherCategoriesByLabel ??= []
      accessUsersFilter.otherCategoriesByLabel.push({ label: grouping, ids: groupingsQuery[grouping] })
    }
  }
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
      ids: [u.login, u.otherInfo?.otherId].filter(id => id != null).join('\n'),
      contact: u.otherInfo?.email ? u.fullname + '\n' + u.otherInfo.email : u.fullname,
      applicationRoles: u.roles.map(r => r.name).join(', '),
      groups: u.groups.join(', ')
      // otherInfo: u.otherInfo
      // institutionalRoles: u.otherInfo?.institutionalRoles ?? [],
      // lastLogin: u.otherInfo?.lastLogin ? DateTime.fromISO(u.otherInfo?.lastLogin).toFormat('MM/dd/yyyy') : 'unknown'
    }
    if (u.otherInfo) {
      for (const group of pageInfo?.categories ?? []) {
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
  interface Filter {
    id: string
    label: string
    items: ComboMenuItem[]
  }
  const filters: Filter[] = []
  for (const group of pageInfo?.categories ?? []) {
    const label = group.label
    if (group.useInList) columns.push({ id: label, label: group.displayLabel ? group.displayLabel : label, get: label })
    if (group.useInFilters) filters.push({ id: group.label, label: group.displayLabel, items: group.ids.map(id => ({ value: id })) })
  }

  depends('api:getAccessUsers')
  return { columns, rows, filters, page: pageInfo?.currentPage, totalItems: pageInfo?.totalItems }
}
