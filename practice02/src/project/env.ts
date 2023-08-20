import { z } from 'zod'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.test.env' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_URL: z.string(),
})

const schema = envSchema.safeParse(process.env)

if (schema.success === false) {
  console.error('Errors: ', schema.error.format())
  throw new Error(`Invalid environment variables!`)
}

export const env = schema.data
