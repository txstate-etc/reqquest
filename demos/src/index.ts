import { RQServer } from '@reqquest/api'
import { analyticsPlugin, unifiedAuthenticate } from 'fastify-txstate'
import { have_yard_prompt, adopt_a_dog_program, have_big_yard_req, have_adequate_personal_space_req, adopt_a_cat_program, cat_tower_req, not_allergic_to_tuna_req, have_a_cat_tower_prompt, not_allergic_to_tuna_prompt, applicant_seems_nice_req, applicant_seems_nice_prompt, must_exercise_your_dog_req, must_exercise_your_dog_prompt, which_state_req, which_state_prompt, other_cats_applicant_req, other_cats_prompt, other_cats_vaccines_prompt, other_cats_reviewer_req, vaccine_review_prompt } from './default/index.js'
import { adopt_a_pet_program, state_residence_confirmation_prompt, state_residence_confirmation_req, state_residence_prompt, state_residence_req } from './simple/index.js'
import { defaultTestMigrations } from './default/testdata.js'
import { simpleTestMigrations } from './simple/testdata.js'
import { DateTime } from 'luxon'
import { foster_a_pet_program as multi_foster_a_pet_program, adopt_a_dog_program as multi_adopt_a_dog_program, adopt_a_cat_program as multi_adopt_a_cat_program } from './multi/definitions/programs.js'
import { multiTestMigrations } from './multi/testdata.js'
import { StringifyOptions } from 'node:querystring'

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
            if (login.startsWith('su')) return ['Staff']
            if (login.startsWith('admin')) return ['Staff', 'Faculty']
            if (login.startsWith('review')) return ['Faculty']
            return ['Student']
          }
          return logins.filter(login => userTypePrefixes.some(p => login.startsWith(p))).map(
            login => ({
              login,
              fullname: `${login} Full Name`,
              groups: userTypes[userTypePrefixes.find(p => login.startsWith(p))!].groups,
              otherInfo: {
                email: `${login}@txstate.edu`,
                labels: {
                  institutionalRoles: pseudoInstitutionalRoles(login),
                  lastLogin: DateTime.fromJSDate(new Date())
                }
              }
            })
          )
        },
        indexes: [{
          label: 'institutionalRoles',
          heading: 'Institutional Roles',
          useInFilters: true,
          useInList: true,
          dataToIndexes: (data: string[]) => data,
          indexesToTags: (indexes: string[]) => indexes.map(idx => ({ index: idx, tag: idx }))

        }, {
          label: 'lastLogin',
          heading: 'Last Login',
          useInFilters: false,
          useInList: true,
          dataToIndexes: (data: DateTime) => [data.toString()],
          indexesToTags: (indexes: string[]) => indexes.map(idx => ({ index: idx, tag: idx }))
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
    programs: [adopt_a_pet_program],
    requirements: [state_residence_req, state_residence_confirmation_req],
    prompts: [state_residence_prompt, state_residence_confirmation_prompt],
    migrations: simpleTestMigrations,
    multipleRequestsPerPeriod: false
  }
  else if (process.env.DEMO_INSTANCE === 'multi') return { // TODO - Currently set to mimic default demo but allowing multi requests, once multi spec is done update
    programGroups: [],
    programs: [adopt_a_dog_program, adopt_a_cat_program],
    requirements: [have_big_yard_req, have_adequate_personal_space_req, cat_tower_req, not_allergic_to_tuna_req, applicant_seems_nice_req, must_exercise_your_dog_req, which_state_req, other_cats_applicant_req, other_cats_reviewer_req],
    prompts: [have_yard_prompt, have_a_cat_tower_prompt, not_allergic_to_tuna_prompt, applicant_seems_nice_prompt, must_exercise_your_dog_prompt, which_state_prompt, other_cats_prompt, other_cats_vaccines_prompt, vaccine_review_prompt],
    migrations: multiTestMigrations,
    multipleRequestsPerPeriod: true
  }
  else if (process.env.DEMO_INSTANCE === 'complex') return { // TODO
    programGroups: [],
    programs: [],
    requirements: [],
    prompts: [],
    migrations: simpleTestMigrations, // TODO
    multipleRequestsPerPeriod: false
  }
  return {
    programGroups: [],
    programs: [adopt_a_dog_program, adopt_a_cat_program],
    requirements: [have_big_yard_req, have_adequate_personal_space_req, cat_tower_req, not_allergic_to_tuna_req, applicant_seems_nice_req, must_exercise_your_dog_req, which_state_req, other_cats_applicant_req, other_cats_reviewer_req],
    prompts: [have_yard_prompt, have_a_cat_tower_prompt, not_allergic_to_tuna_prompt, applicant_seems_nice_prompt, must_exercise_your_dog_prompt, which_state_prompt, other_cats_prompt, other_cats_vaccines_prompt, vaccine_review_prompt],
    migrations: defaultTestMigrations,
    multipleRequestsPerPeriod: false
  }
}
