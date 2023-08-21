import { execSync } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { app } from '../middlewares/authMiddleware.test'

// beforeAll(async () => {
//   execSync('npm run knex migrate:latest')
//   await app.ready()
// })

// afterAll(async () => {
//   await app.close()
// })

describe('Test create-user route', async () => {
  it('must create a user', async () => {
    const userData = {
      username: `test-${randomUUID()}`,
      password: 'test12345678',
    }

    await request(app.server)
      .post('/api/auth/create-user')
      .send(userData)
      .expect(204)
  })

  test('invalid body', async () => {
    const response = await request(app.server)
      .post('/api/auth/create-user')
      .expect(400)

    expect(response.body).toEqual(
      expect.objectContaining({
        _errors: ['Required'],
      }),
    )
  })

  test('required fields error', async () => {
    const userData = {}

    const response = await request(app.server)
      .post('/api/auth/create-user')
      .send(userData)
      .expect(400)

    expect(response.body).toEqual(
      expect.objectContaining({
        username: expect.objectContaining({
          _errors: ['Required'],
        }),
        password: expect.objectContaining({
          _errors: ['Required'],
        }),
      }),
    )
  })

  test('short fields error', async () => {
    const userData = {
      username: `tes`,
      password: 'tes',
    }

    const response = await request(app.server)
      .post('/api/auth/create-user')
      .send(userData)
      .expect(400)

    expect(response.body).toEqual(
      expect.objectContaining({
        username: expect.objectContaining({
          _errors: ['String must contain at least 4 character(s)'],
        }),
        password: expect.objectContaining({
          _errors: ['String must contain at least 8 character(s)'],
        }),
      }),
    )
  })
})