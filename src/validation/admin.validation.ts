import { z } from 'zod'

export const createAdminFormSchema = z.object({
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  contactNumber: z
    .string()
    .trim()
    .min(11, 'Contact number must be at least 11 characters')
    .max(14, 'Contact number must be at most 14 characters')
})

export type CreateAdminFormValues = z.infer<typeof createAdminFormSchema>
