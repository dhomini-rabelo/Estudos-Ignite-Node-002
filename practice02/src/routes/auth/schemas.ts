import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().min(6),
  password: z.string().min(8),
})
