import { FastifyInstance } from 'fastify'
import { database } from '../../project/database'
import { randomUUID } from 'node:crypto'
import { createUserSchema, loginSchema } from './schemas'
import { hashModule } from '../../project/modules'

export async function authRoutes(app: FastifyInstance) {
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

  app.post('/login', async (req, res) => {
    const schema = loginSchema.safeParse(req.body)
    if (schema.success) {
      const user = await database('users')
        .where({
          username: schema.data.username,
        })
        .first()
      if (user) {
        const passwordIsCorrect = hashModule.compare(
          schema.data.password,
          user.password,
        )
        if (passwordIsCorrect) {
          return res.status(200).send({
            token: user.token,
          })
        }
      }
      return res.status(401).send({
        message: 'Invalid credentials',
        error: 'Unauthorized',
        statusCode: 401,
      })
    } else {
      return res.status(400).send(schema.error.format())
    }
  })
}
