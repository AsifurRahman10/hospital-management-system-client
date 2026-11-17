'use client'

import { useState, useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { queryRagService } from '@/service/rag.service'
import { IChatMessage } from '@/types/chatbot.types'
import { mergeAnswerWithSources } from './chatbot.utils'

function makeId() {
  return Math.random().toString(36).slice(2)
}

export function useChatbot() {
  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    // rAF keeps it after React paint
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    )
  }, [])

  const { mutate, isPending } = useMutation({
    mutationFn: (query: string) => queryRagService({ query, limit: 5 }),
    onSuccess: (res, query) => {
      const data = res.data
      const sources = data?.sources ?? []
      const rawAnswer = data?.answer

      let doctorsCards = undefined
      let text: string | undefined = undefined

      if (rawAnswer?.doctors?.length) {
        doctorsCards = mergeAnswerWithSources(rawAnswer.doctors, sources)
      } else if (typeof rawAnswer === 'string') {
        text = rawAnswer
      } else {
        text = 'Sorry, I could not find relevant information for that query.'
      }

      setMessages((prev) =>
        prev
          .filter((m) => !m.isLoading)
          .concat({
            id: makeId(),
            role: 'assistant',
            doctors: doctorsCards,
            text,
            sourceCount: sources.length,
            query,
          })
      )
      scrollToBottom()
    },
    onError: () => {
      setMessages((prev) =>
        prev
          .filter((m) => !m.isLoading)
          .concat({
            id: makeId(),
            role: 'assistant',
            text: 'Something went wrong. Please try again.',
          })
      )
    },
  })

  const send = useCallback(
    (query: string) => {
      const q = query.trim()
      if (!q || isPending) return
      setInput('')
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'user', text: q },
        { id: makeId(), role: 'assistant', isLoading: true },
      ])
      scrollToBottom()
      mutate(q)
    },
    [isPending, mutate, scrollToBottom]
  )

  const clear = useCallback(() => setMessages([]), [])

  return { messages, input, setInput, send, clear, isPending, bottomRef }
}
