import { execSync } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../src/project/server'

import { randomUUID } from 'node:crypto'
import request from 'supertest'

beforeAll(async () => {
  execSync('npm run knex migrate:latest')
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Test auth middleware', () => {
  const routeWithMiddleware = '/api/meals'

  it('must return 401 because token was not sent', async () => {
    await request(app.server).get(routeWithMiddleware).expect(401)
  })

  it('must return 401 because token is invalid', async () => {
    const invalidToken = 'invalidToken'
    await request(app.server)
      .get(routeWithMiddleware)
      .set('Authorization', `Token ${invalidToken}`)
      .expect(401)
  })

  it('must return 401 because token is invalid', async () => {
    const invalidToken = 'invalidToken'
    await request(app.server)
      .get(routeWithMiddleware)
      .set('Authorization', `Token ${invalidToken}`)
      .expect(401)
  })

  it('must return 200 because token is valid', async () => {
    const userData = {
      username: `test-${randomUUID()}`,
      password: 'test12345678',
    }

    await request(app.server).post('/api/auth/create-user').send(userData)

    const loginResponse = await request(app.server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send(userData)

    const validToken = loginResponse.body.token

    const response = await request(app.server)
      .get(routeWithMiddleware)
      .set('Authorization', `Token ${validToken}`)
      .set('Content-Type', 'application/json')
      .expect(200)

    expect(response.body).toEqual([])
  })
})

export { app }
