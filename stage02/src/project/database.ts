import knex, { Knex } from 'knex'

export const databaseSettings: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './src/project/database/database.db',
  },
  migrations: {
    extension: 'ts',
    directory: './src/project/database/migrations',
  },
  useNullAsDefault: true,
}

export const database = knex(databaseSettings)
