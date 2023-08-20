import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      username: string
      password: string
      created_at: string
      token: string
    }
    meals: {
      id: string
      name: string
      description: string
      is_in_the_diet: boolean
      created_at: string
    }
  }
}
