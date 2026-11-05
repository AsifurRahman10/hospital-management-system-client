'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import {
  IAdmin,
  ICreateAdminPayload,
  ICreateSuperAdminPayload,
  IUpdateAdminPayload
} from '@/types/admin.types'

export const createAdmin = async (payload: ICreateAdminPayload) => {
  return httpClient.post<IAdmin>('/user/create-admin', payload)
}

export const createSuperAdmin = async (payload: ICreateSuperAdminPayload) => {
  return httpClient.post<IAdmin>('/user/create-super-admin', payload)
}

export const getAdmins = async () => {
  return httpClient.get<IAdmin[]>('/admin')
}

export const getAdminById = async (id: string) => {
  return httpClient.get<IAdmin>(`/admin/${id}`)
}

export const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  return httpClient.patch<IAdmin>(`/admin/${id}`, payload)
}

export const deleteAdmin = async (id: string) => {
  return httpClient.delete<{ message: string }>(`/admin/${id}`)
}
