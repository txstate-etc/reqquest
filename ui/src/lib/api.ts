import type { APIBase } from '@txstate-mws/sveltekit-utils'
import type { createClient } from './typed-client/index.js'

export interface ReqquestAPI extends APIBase { client: ReturnType<typeof createClient> }
