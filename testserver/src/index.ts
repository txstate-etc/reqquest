import { RQServer } from '@txstate-mws/reqquest'
import { analyticsPlugin, unifiedAuthenticate } from 'fastify-txstate'
import { have_yard_prompt, adopt_a_dog_program, have_big_yard_req, have_adequate_personal_space_req } from './definitions/index.js'
import { testMigrations } from './testdata.js'

async function main () {
  const server = new RQServer({
    authenticate: unifiedAuthenticate,
    validOrigins: process.env.NODE_ENV === 'development' ? ['http://localhost', 'http://localhost:3000'] : undefined
  })

  await server.app.register(analyticsPlugin, { appName: 'reqquest', authorize: req => !!req.auth?.username.length })

  await server.start({
    appConfig: {
      userLookups: {
        byLogins: async (logins, applicableGroups) => {
          const groups: Record<string, string[]> = {
            admin: ['administrators'],
            reviewer: ['reviewers'],
            applicant: ['applicants']
          }
          return logins.map(login => ({ login, fullname: login, groups: groups[login] ?? applicableGroups }))
        }
      }
    },
    programGroups: [],
    programs: [adopt_a_dog_program],
    requirements: [have_big_yard_req, have_adequate_personal_space_req],
    prompts: [have_yard_prompt],
    migrations: testMigrations
  })
}

main().catch(e => { console.error(e) })
