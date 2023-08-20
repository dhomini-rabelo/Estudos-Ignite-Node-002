import { z } from 'zod'

export const createMealSchema = z.object({
  name: z.string().min(4),
  description: z.string(),
  is_in_the_diet: z.boolean(),
})
