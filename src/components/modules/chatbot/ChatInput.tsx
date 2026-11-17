'use client'

import { FormEvent, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'
import { QUICK_PROMPTS } from '@/types/chatbot.types'

interface ChatInputProps {
  value: string
  onChange: (v: string) => void
  onSend: (q: string) => void
  disabled: boolean
  showQuickPrompts: boolean
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  showQuickPrompts,
}: ChatInputProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSend(value)
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(value)
    }
  }

  return (
    <div className='space-y-2'>
      {/* Quick prompt chips — only before first message */}
      {showQuickPrompts && (
        <div className='flex flex-wrap gap-1.5 px-1'>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => onSend(p)}
              className='inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer'
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <form
        onSubmit={handleSubmit}
        className='flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all'
      >
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder='Ask about doctors, specialties…'
          disabled={disabled}
          className='flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 max-h-24'
        />
        <Button
          type='submit'
          size='icon-sm'
          disabled={disabled || !value.trim()}
          className='flex-shrink-0'
          aria-label='Send message'
        >
          <SendHorizonal />
        </Button>
      </form>
    </div>
  )
}
