import { RQServer } from '@reqquest/api'
import { analyticsPlugin, unifiedAuthenticate } from 'fastify-txstate'
import { adopt_a_pet_program, state_residence_req, state_residence_prompt } from './definitions/index.js'
import { testMigrations } from './testdata.js'
import { DateTime } from 'luxon'

async function main () {
  const server = new RQServer({
    authenticate: unifiedAuthenticate,
    validOrigins: process.env.NODE_ENV === 'development' ? ['http://localhost', 'http://localhost:3000'] : undefined
  })

  await server.app.register(analyticsPlugin, { appName: 'reqquest', authorize: req => !!req.auth?.username.length })

  const userTypes: Record<string, { groups: string[], otherInfo: { email: {} } }> = {
    su: { groups: ['sudoers'], otherInfo: { email: {} } },
    admin: { groups: ['administrators'], otherInfo: { email: {} } },
    reviewer: { groups: ['reviewers'], otherInfo: { email: {} } },
    applicant: { groups: ['applicants'], otherInfo: { email: {} } }
  }
  const userTypePrefixes = Object.keys(userTypes)
  const groupDateAdded = function (groupname: string): DateTime {
    if (['sudoers', 'administrators', 'reviewers', 'applicants'].includes(groupname)) return DateTime.fromFormat('20240101080000', 'yyyyMMddHHmmss')
    return DateTime.fromFormat('20250601080000', 'yyyyMMddHHmmss')
  }
  await server.start({
    appConfig: {
      multipleRequestsPerPeriod: false,
      userLookups: {
        byLogins: async (logins: string[], applicableGroups: string[]) => {
          return logins.filter(login => userTypePrefixes.some(p => login.startsWith(p))).map(login => ({ login, fullname: `${login} Full Name`, groups: userTypes[userTypePrefixes.find(p => login.startsWith(p))!].groups, otherInfo: { email: `${login}@txstate.edu` } }))
        },
        searchUsers: async (searchQuery: string) => {
          return [{ groups: ['applicants'], otherInfo: { email: 'applicant@txstate.edu' }, login: 'applicant', fullname: 'Applicant Fullname' }]
        }
      },
      groups: async (groupnames: string[]) => {
        return groupnames.map(groupname => ({ name: groupname, manager: { fullname: `${String(groupname).charAt(0).toLocaleUpperCase() + String(groupname).slice(1)} Lastname`, email: `${groupname.toLocaleLowerCase()}@txstate.edu` }, dateAdded: groupDateAdded(groupname) }))
      }
    },
    programGroups: [],
    programs: [adopt_a_pet_program],
    requirements: [state_residence_req],
    prompts: [state_residence_prompt],
    migrations: testMigrations
  })
}

main().catch(e => { console.error(e) })
