'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Stethoscope, X, Trash2, Minus } from 'lucide-react'
import { useChatbot } from './useChatbot'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

export function ChatbotWindow({ onClose }: { onClose: () => void }) {
  const { messages, input, setInput, send, clear, isPending, bottomRef } =
    useChatbot()
  const [minimized, setMinimized] = useState(false)

  return (
    <div
      className='flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden'
      style={{ width: 'min(400px, calc(100vw - 2rem))', height: minimized ? 'auto' : '540px' }}
    >
      {/* Header */}
      <div className='flex items-center gap-3 border-b border-border bg-card px-4 py-3'>
        <div className='flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center'>
          <Stethoscope className='size-4 text-primary' />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-foreground'>
            Hospital Assistant
          </p>
          <p className='flex items-center gap-1 text-xs text-muted-foreground'>
            <span className='size-1.5 rounded-full bg-green-500 inline-block' />
            AI-powered · Doctor finder
          </p>
        </div>
        <div className='flex items-center gap-1'>
          {messages.length > 0 && (
            <Button
              variant='ghost'
              size='icon-xs'
              onClick={clear}
              aria-label='Clear chat'
              title='Clear chat'
            >
              <Trash2 />
            </Button>
          )}
          <Button
            variant='ghost'
            size='icon-xs'
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? 'Expand' : 'Minimize'}
          >
            <Minus />
          </Button>
          <Button
            variant='ghost'
            size='icon-xs'
            onClick={onClose}
            aria-label='Close chatbot'
          >
            <X />
          </Button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <ScrollArea className='flex-1 min-h-0'>
            <div className='p-4 space-y-3'>
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className='rounded-2xl rounded-tl-sm bg-muted px-3 py-2.5 text-sm text-muted-foreground'>
                  Hi! I can help you find the right doctor, check consultation
                  fees, or explore specialties. What are you looking for?
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className='border-t border-border bg-card p-3'>
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={send}
              disabled={isPending}
              showQuickPrompts={messages.length === 0}
            />
          </div>
        </>
      )}
    </div>
  )
}
