'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import { IPrescription } from '@/types/prescription.type'

export const getPrescriptions = async () => {
  try {
    return await httpClient.get<IPrescription[]>('/prescription')
  } catch (error) {
    console.log('Error fetching prescriptions:', error)
    throw error
  }
}
