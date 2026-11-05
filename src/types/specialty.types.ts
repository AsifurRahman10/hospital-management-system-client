export interface ISpecialty {
  id: string
  title: string
  icon?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface IUpdateSpecialtyPayload {
  title?: string
  description?: string
  icon?: string
}
