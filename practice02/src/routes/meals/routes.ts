import { FastifyInstance } from 'fastify'
import { IsAuthenticatedMiddleware } from '../../middlewares/auth'
// import { database } from '../../project/database'
// import { randomUUID } from 'node:crypto'
// import { hashModule } from '../../project/modules'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', IsAuthenticatedMiddleware)

  app.post('', async (req, res) => {
    // const schema = createUserSchema.safeParse(req.body)
    // if (schema.success) {
    //   await database('users').insert({
    //     id: randomUUID(),
    //     token: randomUUID(),
    //     username: schema.data.username,
    //     password: hashModule.generate(schema.data.password),
    //   })
    //   return res.status(204).send()
    // } else {
    //   return res.status(400).send(schema.error.format())
    // }
    return res.status(204).send()
  })
}
