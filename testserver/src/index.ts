import { RQServer } from '@reqquest/api'
import { TxStateUAuthContext } from '@txstate-mws/graphql-server'
import { analyticsPlugin, unifiedAuthenticate } from 'fastify-txstate'
import { have_yard_prompt, adopt_a_dog_program, have_big_yard_req, have_adequate_personal_space_req, adopt_a_cat_program, cat_tower_req, not_allergic_to_tuna_req, have_a_cat_tower_prompt, not_allergic_to_tuna_prompt, applicant_seems_nice_req, applicant_seems_nice_prompt, must_exercise_your_dog_req, must_exercise_your_dog_prompt, which_state_req, which_state_prompt } from './definitions/index.js'
import { testMigrations } from './testdata.js'

async function main () {
  const server = new RQServer({
    authenticate: unifiedAuthenticate,
    validOrigins: process.env.NODE_ENV === 'development' ? ['http://localhost', 'http://localhost:3000'] : undefined
  })

  await server.app.register(analyticsPlugin, { appName: 'reqquest', authorize: req => !!req.auth?.username.length })

  await server.start({
    customContext: TxStateUAuthContext,
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
    programs: [adopt_a_dog_program, adopt_a_cat_program],
    requirements: [have_big_yard_req, have_adequate_personal_space_req, cat_tower_req, not_allergic_to_tuna_req, applicant_seems_nice_req, must_exercise_your_dog_req, which_state_req],
    prompts: [have_yard_prompt, have_a_cat_tower_prompt, not_allergic_to_tuna_prompt, applicant_seems_nice_prompt, must_exercise_your_dog_prompt, which_state_prompt],
    migrations: testMigrations
  })
}

main().catch(e => { console.error(e) })
