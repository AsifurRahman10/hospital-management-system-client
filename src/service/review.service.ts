'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { ApiResponse } from '@/types/api.types'
import { IReview } from '@/types/review.type'

export interface ICreateReviewPayload {
  appointmentId: string
  rating: number
  comment: string
}

export interface IUpdateReviewPayload {
  rating?: number
  comment?: string
}

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

export const createReview = async (payload: ICreateReviewPayload) => {
  try {
    return await httpClient.post<ApiResponse<IReview>>('/review', payload)
  } catch (error) {
    console.log('Error creating review:', error)
    throw error
  }
}

export const updateReview = async (
  id: string,
  payload: IUpdateReviewPayload
) => {
  try {
    return await httpClient.patch<ApiResponse<IReview>>(
      `/review/${id}`,
      payload
    )
  } catch (error) {
    console.log('Error updating review:', error)
    throw error
  }
}

export const deleteReview = async (id: string) => {
  try {
    return await httpClient.delete<ApiResponse<unknown>>(`/review/${id}`)
  } catch (error) {
    console.log('Error deleting review:', error)
    throw error
  }
}
