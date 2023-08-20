import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})
