import { IChatMessage } from '@/types/chatbot.types'
import { DoctorCard } from './DoctorCard'
import { cn } from '@/app/lib/utils'

/** Three animated dots for loading state */
function LoadingDots() {
  return (
    <div className='flex items-center gap-1 px-3 py-2'>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className='size-1.5 rounded-full bg-muted-foreground/50 animate-bounce'
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export function ChatMessage({ msg }: { msg: IChatMessage }) {
  const isUser = msg.role === 'user'

  if (msg.isLoading) {
    return (
      <div className='flex justify-start'>
        <div className='rounded-2xl rounded-tl-sm bg-card border border-border'>
          <LoadingDots />
        </div>
      </div>
    )
  }

  if (isUser) {
    return (
      <div className='flex justify-end'>
        <div className='max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground'>
          {msg.text}
        </div>
      </div>
    )
  }

  // Assistant: may be text-only or doctor cards
  const count = msg.doctors?.length ?? 0
  const intro = count > 0
    ? count === 1
      ? `Here's the best match I found for you:`
      : `Here are the top ${count} doctors I found that match your request:`
    : null

  return (
    <div className='flex justify-start'>
      <div
        className={cn(
          'max-w-[90%] space-y-2',
          count > 0 ? 'w-full' : ''
        )}
      >
        {/* Conversational intro before cards */}
        {intro && (
          <div className='rounded-2xl rounded-tl-sm bg-card border border-border px-3 py-2 text-sm text-foreground leading-relaxed'>
            {intro}
          </div>
        )}

        {/* Plain text response (no cards) */}
        {msg.text && !count && (
          <div className='rounded-2xl rounded-tl-sm bg-card border border-border px-3 py-2 text-sm text-foreground leading-relaxed'>
            {msg.text}
          </div>
        )}

        {msg.doctors?.map((doc, i) => <DoctorCard key={i} doc={doc} />)}

        {/* Closing nudge after cards */}
        {count > 0 && (
          <div className='rounded-2xl rounded-tl-sm bg-card border border-border px-3 py-2 text-sm text-foreground leading-relaxed'>
            Would you like to book an appointment or know more about any of
            these doctors?
          </div>
        )}

        {/* Source transparency footer */}
        {!!msg.sourceCount && (
          <p className='text-[10px] text-muted-foreground pl-1'>
            Based on {msg.sourceCount} verified hospital record
            {msg.sourceCount > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
