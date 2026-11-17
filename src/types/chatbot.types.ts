export interface IDoctorAnswer {
  name: string
  specialty: string
  reason: string
}

export interface IParsedDoctorMeta {
  experience?: string
  fee?: string
  hospital?: string
  qualification?: string
}

export interface IDoctorCard extends IDoctorAnswer, IParsedDoctorMeta {
  sourceId?: string
}

export interface IChatMessage {
  id: string
  role: 'user' | 'assistant'
  text?: string
  doctors?: IDoctorCard[]
  sourceCount?: number
  isLoading?: boolean
  /** Original user query — used to craft the assistant's intro line */
  query?: string
}

export const QUICK_PROMPTS = [
  'Find a Cardiologist',
  'Pediatrician consultation fee',
  'Best rated doctors',
] as const
