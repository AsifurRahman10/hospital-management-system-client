import { IDoctorCard, IDoctorAnswer } from '@/types/chatbot.types'
import { IRagSource } from '@/service/rag.service'

/** Parse key facts from the raw `content` string in a source chunk */
function parseSourceContent(content: string): {
  experience?: string
  fee?: string
  hospital?: string
  qualification?: string
} {
  const get = (label: string) => {
    const match = content.match(new RegExp(`${label}:\\s*(.+)`))
    return match?.[1]?.trim()
  }
  return {
    experience: get('Experience'),
    fee: get('Appointment Fee'),
    hospital: get('Current Working Place'),
    qualification: get('Qualification'),
  }
}

/** Match each doctor answer to its richer source chunk and merge */
export function mergeAnswerWithSources(
  doctors: IDoctorAnswer[],
  sources: IRagSource[]
): IDoctorCard[] {
  return doctors.map((doc) => {
    const source = sources.find((s) =>
      s.content.includes(doc.name)
    )
    const meta = source ? parseSourceContent(source.content) : {}
    return { ...doc, ...meta, sourceId: source?.sourceId }
  })
}
