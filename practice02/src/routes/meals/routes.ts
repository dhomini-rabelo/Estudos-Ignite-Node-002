import { FastifyInstance } from 'fastify'
import { IsAuthenticatedMiddleware } from '../../middlewares/auth'
import { createMealSchema } from './schemas'
import { database } from '../../project/database'
import { randomUUID } from 'node:crypto'
import { uuidParamSchema } from '../../utils/schemas'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', IsAuthenticatedMiddleware)

  app.post('', async (req, res) => {
    const schema = createMealSchema.safeParse(req.body)
    if (schema.success) {
      await database('meals').insert({
        id: randomUUID(),
        name: schema.data.name,
        description: schema.data.description,
        is_in_the_diet: schema.data.is_in_the_diet,
        user_id: req.user?.id,
      })
      return res.status(204).send()
    } else {
      return res.status(400).send(schema.error.format())
    }
  })

  app.get('', async (req) => {
    return await database('meals').where({
      user_id: req.user?.id,
    })
  })

  app.get('/:id', async (req, res) => {
    const schema = uuidParamSchema.safeParse(req.params)
    if (schema.success) {
      const meal = await database('meals')
        .where({ id: schema.data.id, user_id: req.user?.id })
        .first()
      return meal
        ? res.status(200).send(meal)
        : res.status(404).send({ error: 'Not Found' })
    } else {
      return res.status(400).send(schema.error.format())
    }
  })
}
