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

export const getMyReviews = async (queryString?: string) => {
  try {
    const endpoint = queryString
      ? `/review/my-reviews?${queryString}`
      : '/review/my-reviews'
    return await httpClient.get<IReview[]>(endpoint)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.response?.status === 404) {
      const fallbackEndpoint = queryString
        ? `/my-reviews?${queryString}`
        : '/my-reviews'
      return await httpClient.get<IReview[]>(fallbackEndpoint)
    }
    console.log('Error fetching my reviews:', error)
    throw error
  }
}
