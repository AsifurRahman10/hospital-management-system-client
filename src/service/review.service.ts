'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { IReview } from '@/types/review.type'

export const getReviews = async () => {
  try {
    return await httpClient.get<IReview[]>('/review')
  } catch (error) {
    console.log('Error fetching reviews:', error)
    throw error
  }
}
