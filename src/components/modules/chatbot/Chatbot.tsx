'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { ChatbotWindow } from './ChatbotWindow'
import { cn } from '@/app/lib/utils'

export function Chatbot() {
  const [open, setOpen] = useState(false)

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3'>
      {/* Chat window */}
      {open && <ChatbotWindow onClose={() => setOpen(false)} />}

      {/* "Chat with us" label — visible only when closed */}
      {!open && (
        <span className='rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm'>
          Chat with us
        </span>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Chat with our AI hospital assistant'}
        className={cn(
          'size-13 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 cursor-pointer',
          'bg-primary text-primary-foreground',
          'hover:scale-105 hover:shadow-xl active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        {open ? <X className='size-5' /> : <MessageCircle className='size-5' />}
      </button>
    </div>
  )
}
