import { expect, beforeAll, afterAll, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/project/server'
import { execSync } from 'node:child_process'

beforeAll(async () => {
  execSync('npm run knex migrate:latest')
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

// beforeEach(() => {
//   execSync('npm run knex migrate:rollback --all')
//   execSync('npm run knex migrate:latest')
// })

describe('creation route', () => {
  it('must create a credit transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'Credit transaction',
      type: 'credit',
      amount: 1000,
    })
    expect(response.statusCode).toBe(204)
  })

  it('must create a debit transaction', async () => {
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
  it('must list transactions', async () => {
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

describe('detail route', () => {
  it('must get transaction data', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .set('Cookie', [])
      .send({
        title: 'Credit transaction',
        type: 'credit',
        amount: 3000,
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listingResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    const transactionId = listingResponse.body[0].id

    const response = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(response.body).toEqual({
      id: transactionId,
      created_at: expect.any(String),
      session_id: expect.any(String),
      title: 'Credit transaction',
      amount: 3000,
    })
  })
})

describe('summary route', () => {
  it('must get summary data', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .set('Cookie', [])
      .send({
        title: 'Credit transaction',
        type: 'credit',
        amount: 3000,
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        type: 'debit',
        amount: 2000,
      })

    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(response.body).toEqual({
      amount: 1000,
    })
  })
})
