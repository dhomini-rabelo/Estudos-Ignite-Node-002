import { FastifyInstance } from 'fastify'
import { database } from '../../project/database'
import { createTransactionSchema, uuidParamSchema } from './schemas'
import { randomUUID } from 'node:crypto'
import { CheckSessionIdCookieExists } from '../../middlewares/session'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('', { preHandler: CheckSessionIdCookieExists }, async (req) => {
    return await database('transactions').where({
      session_id: req.cookies.sessionId,
    })
  })

  app.get(
    '/:id',
    { preHandler: CheckSessionIdCookieExists },
    async (req, res) => {
      const schema = uuidParamSchema.safeParse(req.params)
      if (schema.success) {
        const transaction = await database('transactions')
          .where({ id: schema.data.id, session_id: req.cookies.sessionId })
          .first()
        return transaction
          ? res.status(200).send(transaction)
          : res.status(404).send({ error: 'Not Found' })
      } else {
        return res.status(400).send(schema.error.format())
      }
    },
  )

  app.post('', async (req, res) => {
    const schema = createTransactionSchema.safeParse(req.body)
    if (schema.success) {
      let sessionId = req.cookies.sessionId
      if (!sessionId) {
        sessionId = randomUUID()
        res.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
      }
      await database('transactions').insert({
        id: randomUUID(),
        session_id: sessionId,
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

  app.get(
    '/summary',
    { preHandler: CheckSessionIdCookieExists },
    async (req) => {
      return await database('transactions')
        .where({
          session_id: req.cookies.sessionId,
        })
        .sum('amount', { as: 'amount' })
        .first()
    },
  )
}
