import { RQServer } from '@reqquest/api'
import { analyticsPlugin, unifiedAuthenticate } from 'fastify-txstate'
import { DateTime } from 'luxon'
import { StringifyOptions } from 'node:querystring'

import { defaultTestMigrations } from './default/testdata.js'
import * as defaultPrograms from './default/definitions/programs.js'
import * as defaultRequirements from './default/definitions/requirements/index.js'
import * as defaultPrompts from './default/definitions/prompts/index.js'

import { simpleTestMigrations } from './simple/testdata.js'
import * as simplePrograms from './simple/definitions/programs.js'
import * as simpleRequirements from './simple/definitions/requirements/index.js'
import * as simplePrompts from './simple/definitions/prompts/index.js'

import { multiTestMigrations } from './multi/testdata.js'
import * as multiPrograms from './default/definitions/programs.js'
import * as multiRequirements from './default/definitions/requirements/index.js'
import * as multiPrompts from './default/definitions/prompts/index.js'

import { complexTestMigrations } from './complex/testdata.js'
import * as complexPrograms from './complex/definitions/programs.js'
import * as complexRequirements from './complex/definitions/requirements/index.js'
import * as complexPrompts from './complex/definitions/prompts/index.js'

async function main () {
  const server = new RQServer({
    authenticate: unifiedAuthenticate,
    validOrigins: process.env.NODE_ENV === 'development' ? ['http://localhost', 'http://localhost:3000'] : undefined
  })

  await server.app.register(analyticsPlugin, { appName: 'reqquest', authorize: req => !!req.auth?.username.length })

  const { programGroups, programs, requirements, prompts, migrations, multipleRequestsPerPeriod } = configureDemoInstanceParams()

  const userTypes: Record<string, { groups: string[], otherInfo: { email: {} } }> = {
    su: { groups: ['sudoers'], otherInfo: { email: {} } },
    admin: { groups: ['administrators'], otherInfo: { email: {} } },
    reviewer: { groups: ['reviewers'], otherInfo: { email: {} } },
    applicant: { groups: ['applicants'], otherInfo: { email: {} } }
  }
  const userTypePrefixes = Object.keys(userTypes)
  await server.start({
    appConfig: {
      multipleRequestsPerPeriod,
      userLookups: {
        byLogins: async (logins: string[], applicableGroups: string[]) => {
          const pseudoInstitutionalRoles = (login: string) => {
            if (login.startsWith('su')) return ['STAFF']
            if (login.startsWith('admin')) return ['STAFF', 'FACULTY']
            if (login.startsWith('review')) return ['FACULTY']
            return ['STUDENT']
          }
          return logins.filter(login => userTypePrefixes.some(p => login.startsWith(p))).map(
            login => ({
              login,
              fullname: `${login} Full Name`,
              groups: userTypes[userTypePrefixes.find(p => login.startsWith(p))!].groups,
              otherInfo: {
                email: `${login}@txstate.edu`,
                indexes: {
                  institutionalRoles: pseudoInstitutionalRoles(login),
                  lastLogin: DateTime.fromJSDate(new Date())
                }
              }
            })
          )
        },
        indexes: [{
          category: 'institutionalRoles',
          label: 'Institutional Roles',
          useInFilters: true,
          useInList: true,
          // Example of reformatting so tag may be used both for index and display.
          dataToCategoryTags: (data: string[]) => data.map(role => ({ tag: role.charAt(0).toLocaleUpperCase() + role.slice(1).toLocaleLowerCase() }))
        }, {
          category: 'lastLogin',
          label: 'Last Login',
          useInFilters: false,
          useInList: true,
          // Example of tag turning date data into epoch index for sortable timestamp.
          // and label simplifying date for display format.
          dataToCategoryTags: (data: DateTime) => [{ tag: data.toSeconds().toString(), label: data.toFormat('MM/dd/yyyy') }]
        }]
      },
      groups: async (groupnames: string[]) => {
        const groupDateAdded = (groupname: string): DateTime => {
          if (['sudoers', 'administrators', 'reviewers', 'applicants'].includes(groupname)) return DateTime.fromFormat('20240101080000', 'yyyyMMddHHmmss')
          return DateTime.fromFormat('20250601080000', 'yyyyMMddHHmmss')
        }
        return groupnames.map(groupName => ({ groupName, managers: [{ fullname: `${String(groupName).charAt(0).toLocaleUpperCase() + String(groupName).slice(1)} Lastname`, email: `${groupName.toLocaleLowerCase()}@txstate.edu` }], dateCreated: groupDateAdded(groupName) }))
      }
    },
    programGroups,
    programs,
    requirements,
    prompts,
    migrations
  })
}

main().catch(e => { console.error(e) })

function configureDemoInstanceParams () {
  if (process.env.DEMO_INSTANCE === 'simple') return {
    programGroups: [],
    programs: Object.values(simplePrograms),
    requirements: Object.values(simpleRequirements),
    prompts: Object.values(simplePrompts),
    migrations: simpleTestMigrations,
    multipleRequestsPerPeriod: false
  }
  else if (process.env.DEMO_INSTANCE === 'multi') return {
    programGroups: [],
    programs: Object.values(multiPrograms),
    requirements: Object.values(multiRequirements),
    prompts: Object.values(multiPrompts),
    migrations: multiTestMigrations,
    multipleRequestsPerPeriod: true
  }
  else if (process.env.DEMO_INSTANCE === 'complex') return {
    programGroups: [],
    programs: Object.values(complexPrograms),
    requirements: Object.values(complexRequirements),
    prompts: Object.values(complexPrompts),
    migrations: complexTestMigrations,
    multipleRequestsPerPeriod: false
  }
  return {
    programGroups: [],
    programs: Object.values(defaultPrograms),
    requirements: Object.values(defaultRequirements),
    prompts: Object.values(defaultPrompts),
    migrations: defaultTestMigrations,
    multipleRequestsPerPeriod: false
  }
}
