import { config } from 'dotenv'

// import { envSchema } from '@/infra/env/env'

config({ path: '.env', override: true })
config({ path: '.env.development', override: true })

// const env = envSchema.parse(process.env)
