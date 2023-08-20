import { FastifyInstance } from 'fastify'
import { IsAuthenticatedMiddleware } from '../../middlewares/auth'
import { mealSchema } from './schemas'
import { database } from '../../project/database'
import { randomUUID } from 'node:crypto'
import { uuidParamSchema } from '../../utils/schemas'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', IsAuthenticatedMiddleware)

  app.post('', async (req, res) => {
    const schema = mealSchema.safeParse(req.body)
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

  app.put('/:id', async (req, res) => {
    const paramsSchema = uuidParamSchema.safeParse(req.params)
    if (paramsSchema.success) {
      const meal = await database('meals')
        .where({ id: paramsSchema.data.id, user_id: req.user?.id })
        .first()
      if (meal) {
        const schema = mealSchema.safeParse(req.body)
        if (schema.success) {
          await database('meals')
            .where({ id: paramsSchema.data.id, user_id: req.user?.id })
            .update({
              name: schema.data.name,
              description: schema.data.description,
              is_in_the_diet: schema.data.is_in_the_diet,
            })
          return res.status(204).send()
        } else {
          return res.status(400).send(schema.error.format())
        }
      }
      return res.status(404).send({ error: 'Not Found' })
    } else {
      return res.status(400).send(paramsSchema.error.format())
    }
  })

  app.get('/summary', async (req, res) => {
    const meals = await database('meals').where({
      user_id: req.user?.id,
    })

    let bestSequence = 0

    const summary = meals.reduce(
      (acc, meal) => {
        if (meal.is_in_the_diet) {
          return {
            total: acc.total + 1,
            totalInDiet: acc.totalInDiet + 1,
            totalOutDiet: acc.totalOutDiet,
            bestSequence: acc.bestSequence + 1,
          }
        } else {
          if (acc.bestSequence > bestSequence) {
            bestSequence = acc.bestSequence
          }

          return {
            total: acc.total + 1,
            totalInDiet: acc.totalInDiet,
            totalOutDiet: acc.totalOutDiet + 1,
            bestSequence: 0,
          }
        }
      },
      { total: 0, totalInDiet: 0, totalOutDiet: 0, bestSequence: 0 },
    )

    return res.status(200).send({ ...summary, bestSequence })
  })
}
