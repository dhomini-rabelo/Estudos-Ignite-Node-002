import { FastifyInstance } from 'fastify'
import { database } from '../../project/database'
import { createTransactionSchema } from './schemas'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('', async () => {
    return await database('transactions').select('*')
  })

  app.post('', async (req, res) => {
    const schema = createTransactionSchema.safeParse(req.body)
    if (schema.success) {
      await database('transactions').insert({
        id: randomUUID(),
        title: schema.data.title,
        amount:
          schema.data.type === 'credit'
            ? schema.data.amount
            : schema.data.amount * -1,
      })
      return res.status(204).send()
    } else {
      return res.status(400).send(schema.error.format())
    }
  })
}
