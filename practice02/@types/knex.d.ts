import { Knex } from 'knex'

interface IUser {
  id: string
  username: string
  password: string
  created_at: string
  token: string
}

declare module 'knex/types/tables' {
  export interface Tables {
    users: IUser
    meals: {
      id: string
      name: string
      description: string
      is_in_the_diet: boolean
      created_at: string
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: IUser // Adicione a propriedade 'user' com o tipo apropriado
  }
}
