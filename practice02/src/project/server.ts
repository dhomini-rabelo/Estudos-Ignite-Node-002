import fastify from 'fastify'

export const app = fastify()

app.addHook('preHandler', async (req, res) => {
  console.log(`[${req.method}] ${req.url}`)
})


app.listen({ port: 3333 }).then(() => {
  console.log('server running')
})