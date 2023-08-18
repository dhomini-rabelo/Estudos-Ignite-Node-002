import { FastifyInstance } from 'fastify'
import { database } from '../../project/database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('', async () => {
    return await database('transactions').select('*')
  })
}
