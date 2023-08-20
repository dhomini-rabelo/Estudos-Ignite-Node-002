import fastify from 'fastify'
import { transactionsRoutes } from '../routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()

app.addHook('preHandler', async (req, res) => {
  console.log(`[${req.method}] ${req.url}`)
})

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.listen({ port: 3333 }).then(() => {
  console.log('server running')
})
