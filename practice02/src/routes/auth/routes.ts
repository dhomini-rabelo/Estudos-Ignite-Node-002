import { FastifyInstance } from 'fastify'
import { database } from '../../project/database'
import { randomUUID } from 'node:crypto'
import { createUserSchema } from './schemas'
import { BCryptHashModule } from '../../modules/hash/modules/bcryptHash'

export async function authRoutes(app: FastifyInstance) {
  const hashModule = new BCryptHashModule()

  app.post('/create-user', async (req, res) => {
    const schema = createUserSchema.safeParse(req.body)
    if (schema.success) {
      await database('users').insert({
        id: randomUUID(),
        token: randomUUID(),
        username: schema.data.username,
        password: hashModule.generate(schema.data.password),
      })
      return res.status(204).send()
    } else {
      return res.status(400).send(schema.error.format())
    }
  })
}
