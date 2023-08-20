import fastify from 'fastify'
import { authRoutes } from '../routes/auth/routes'
import { mealsRoutes } from '../routes/meals/routes'

export const app = fastify()

app.addHook('preHandler', async (req) => {
  console.log(`[${req.method}] ${req.url}`)
})

app.register(authRoutes, {
  prefix: 'api/auth',
})

app.register(mealsRoutes, {
  prefix: 'api/meals',
})

app.listen({ port: 3333 }).then(() => {
  console.log('server running')
})
