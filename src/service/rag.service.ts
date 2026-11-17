'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@/app/lib/axios/httpClient'

interface IRagQueryPayload {
  query: string
  limit?: number
  sourceType?: string
}
export interface IRagQueryData {
  answer: any
  sources: IRagSource[]
  contextUsed: string
}

export interface IIngestDoctorsData {
  success: boolean
  message: string
  indexedCount: number
}

export interface IRagSource {
  id: string
  content: string
  similarity: number
  metadata?: {
    name?: string
    [key: string]: unknown
  }
  sourceType?: string
}

export const queryRagService = async (payload: IRagQueryPayload) => {
  const response = await httpClient.post<IRagQueryData>('/rag/query', payload)
  return response
}

export const ingestDoctorsService = async () => {
  const response = await httpClient.post<IIngestDoctorsData>(
    '/rag/ingest-doctors'
  )
  return response
}
