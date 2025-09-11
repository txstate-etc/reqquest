import { RQServer } from '@reqquest/api'
import { analyticsPlugin, unifiedAuthenticate } from 'fastify-txstate'
import { have_yard_prompt, adopt_a_dog_program, have_big_yard_req, have_adequate_personal_space_req, adopt_a_cat_program, cat_tower_req, not_allergic_to_tuna_req, have_a_cat_tower_prompt, not_allergic_to_tuna_prompt, applicant_seems_nice_req, applicant_seems_nice_prompt, must_exercise_your_dog_req, must_exercise_your_dog_prompt, which_state_req, which_state_prompt, other_cats_applicant_req, other_cats_prompt, other_cats_vaccines_prompt, other_cats_reviewer_req, vaccine_review_prompt } from './definitions/index.js'
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
        return groupnames.map(groupName => ({ groupName, managers: [{ fullname: `${String(groupName).charAt(0).toLocaleUpperCase() + String(groupName).slice(1)} Lastname`, email: `${groupName.toLocaleLowerCase()}@txstate.edu` }], dateCreated: groupDateAdded(groupName) }))
      }
    },
    programGroups: [],
    programs: [adopt_a_dog_program, adopt_a_cat_program],
    requirements: [have_big_yard_req, have_adequate_personal_space_req, cat_tower_req, not_allergic_to_tuna_req, applicant_seems_nice_req, must_exercise_your_dog_req, which_state_req, other_cats_applicant_req, other_cats_reviewer_req],
    prompts: [have_yard_prompt, have_a_cat_tower_prompt, not_allergic_to_tuna_prompt, applicant_seems_nice_prompt, must_exercise_your_dog_prompt, which_state_prompt, other_cats_prompt, other_cats_vaccines_prompt, vaccine_review_prompt],
    migrations: testMigrations
  })
}

main().catch(e => { console.error(e) })
