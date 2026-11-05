'use server'

import { httpClient } from '@/app/lib/axios/httpClient'
import {
  IChangeUserRolePayload,
  IChangeUserStatusPayload,
  IUpdatedUser
} from '@/types/user.types'

export const changeUserStatus = async (payload: IChangeUserStatusPayload) => {
  return httpClient.patch<IUpdatedUser>('/admin/change-user-status', payload)
}

export const changeUserRole = async (payload: IChangeUserRolePayload) => {
  return httpClient.patch<IUpdatedUser>('/admin/change-user-role', payload)
}
