import { FastifyInstance } from 'fastify'
import { database } from '../../project/database'
import { createTransactionSchema, uuidParamSchema } from './schemas'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('', async () => {
    return await database('transactions').select('*')
  })

  app.get('/:id', async (req, res) => {
    const schema = uuidParamSchema.safeParse(req.params)
    if (schema.success) {
      return await database('transactions').where('id', schema.data.id).first()
    } else {
      return res.status(400).send(schema.error.format())
    }
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

  app.get('/summary', async () => {
    return await database('transactions')
      .sum('amount', { as: 'amount' })
      .first()
  })
}
