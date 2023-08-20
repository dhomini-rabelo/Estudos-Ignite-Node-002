import { expect, test, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/project/server'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('creation route', () => {
  test('create credit transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'Credit transaction',
      type: 'credit',
      amount: 1000,
    })
    expect(response.statusCode).toBe(204)
  })

  test('create debit transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Debit transaction',
        type: 'debit',
        amount: 2000,
      })
      .expect(204)
  })
})

describe('listing route', () => {
  test('listing transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Debit transaction',
        type: 'debit',
        amount: 2000,
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(response.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        session_id: expect.any(String),
        title: 'Debit transaction',
        amount: -2000,
      },
    ])

    expect(response.body).toEqual([
      expect.objectContaining({
        title: 'Debit transaction',
        amount: -2000,
      }),
    ])
  })
})
