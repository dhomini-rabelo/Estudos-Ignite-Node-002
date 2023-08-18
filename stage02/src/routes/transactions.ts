import { FastifyInstance } from 'fastify'
import { database } from '../project/database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const db = await database('sqlite_schema').select('*')
    return db
  })
}
