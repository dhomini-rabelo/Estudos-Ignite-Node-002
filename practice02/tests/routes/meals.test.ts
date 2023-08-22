import { describe, expect, it, test } from 'vitest'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { app } from '../middlewares/authMiddleware.test'

describe('Test meal routes', async () => {
  const userData = {
    username: `test-${randomUUID()}`,
    password: 'test12345678',
  }

  await request(app.server).post('/api/auth/create-user').send(userData)

  const response = await request(app.server)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send(userData)

  const token = response.body.token

  describe('Test create meal route', () => {
    test('request without token', async () => {
      await request(app.server).post('/api/meals').send().expect(401)
    })

    test('success case', async () => {
      const mealData = {
        name: 'test',
        description: 'test',
        is_in_the_diet: true,
      }

      await request(app.server)
        .post('/api/meals')
        .set('Authorization', `Token ${token}`)
        .set('Content-Type', 'application/json')
        .send(mealData)
        .expect(204)
    })

    test('required invalid body error', async () => {
      const response = await request(app.server)
        .post('/api/meals')
        .set('Authorization', `Token ${token}`)
        .send()
        .expect(400)

      expect(response.body).toEqual(
        expect.objectContaining({
          _errors: ['Required'],
        }),
      )
    })

    test('required fields error', async () => {
      const mealData = {}

      const response = await request(app.server)
        .post('/api/meals')
        .set('Authorization', `Token ${token}`)
        .set('Content-Type', 'application/json')
        .send(mealData)
        .expect(400)

      expect(response.body).toEqual(
        expect.objectContaining({
          name: expect.objectContaining({
            _errors: ['Required'],
          }),
          description: expect.objectContaining({
            _errors: ['Required'],
          }),
          is_in_the_diet: expect.objectContaining({
            _errors: ['Required'],
          }),
        }),
      )
    })

    test('short name error error', async () => {
      const mealData = {
        name: 'tes',
        description: 'test',
        is_in_the_diet: true,
      }

      const response = await request(app.server)
        .post('/api/meals')
        .set('Authorization', `Token ${token}`)
        .set('Content-Type', 'application/json')
        .send(mealData)
        .expect(400)

      expect(response.body).toEqual(
        expect.objectContaining({
          name: expect.objectContaining({
            _errors: ['String must contain at least 4 character(s)'],
          }),
        }),
      )
    })
  })
})
