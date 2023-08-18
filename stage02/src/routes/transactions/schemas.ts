import { z } from 'zod'

export const createTransactionSchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
})

export const uuidParamSchema = z.object({
  id: z.string().uuid(),
})
