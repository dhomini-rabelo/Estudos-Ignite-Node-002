import { FastifyInstance } from 'fastify'
import { IsAuthenticatedMiddleware } from '../../middlewares/auth'
import { createMealSchema } from './schemas'
import { database } from '../../project/database'
import { randomUUID } from 'node:crypto'

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
      })
      return res.status(204).send()
    } else {
      return res.status(400).send(schema.error.format())
    }
  })
}
