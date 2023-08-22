import { describe, expect, it, test } from 'vitest'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { app } from '../middlewares/authMiddleware.test'

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

describe('Test login route', async () => {
  test('login success case', async () => {
    const userData = {
      username: `test-${randomUUID()}`,
      password: 'test12345678',
    }

    await request(app.server).post('/api/auth/create-user').send(userData)

    const response = await request(app.server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send(userData)
      .expect(200)

    expect(response.body.token).toEqual(expect.any(String))
  })

  test('login with invalid password', async () => {
    const userData = {
      username: `test-${randomUUID()}`,
      password: 'test12345678',
    }

    await request(app.server).post('/api/auth/create-user').send(userData)

    await request(app.server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ ...userData, password: 'invalid password' })
      .expect(401)
  })

  test('login with unregistered username', async () => {
    const userData = {
      username: `test-${randomUUID()}`,
      password: 'test12345678',
    }

    await request(app.server).post('/api/auth/create-user').send(userData)

    await request(app.server)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ ...userData, password: 'invalid password' })
      .expect(401)
  })

  test('invalid body', async () => {
    const response = await request(app.server)
      .post('/api/auth/login')
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
      .post('/api/auth/login')
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
})
