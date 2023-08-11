import fastify from 'fastify'
import { database } from './database'

const app = fastify()

app.get('/', async () => {
  const db = await database('sqlite_schema').select('*')
  console.log({ db })
  return 'Hello World'
})

app.listen({ port: 3333 }).then(() => {
  console.log('server running')
})
