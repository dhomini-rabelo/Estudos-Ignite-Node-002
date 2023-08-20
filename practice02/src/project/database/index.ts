import knex, { Knex } from 'knex'
import { env } from '../env'

export const databaseSettings: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: 'ts',
    directory: './src/project/database/migrations',
  },
  useNullAsDefault: true,
}

export const database = knex(databaseSettings)
