import { z } from 'zod'

export const createReviewZodSchema = z.object({
  appointmentId: z.string({
    error: 'Appointment ID is required'
  }),
  rating: z
    .number({
      error: 'Rating is required'
    })
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5'),
  comment: z
    .string({
      error: 'Comment is required'
    })
    .min(1, 'Comment cannot be empty')
})

export const updateReviewZodSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5')
    .optional(),
  comment: z.string().min(1, 'Comment cannot be empty').optional()
})

export type CreateReviewFormValues = z.infer<typeof createReviewZodSchema>
export type UpdateReviewFormValues = z.infer<typeof updateReviewZodSchema>
