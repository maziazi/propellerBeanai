'use client'

import { useEffect, useRef } from 'react'
import type { DiscussionMessage } from '@/lib/types'
import { MessageBubble } from './MessageBubble'

interface DiscussionTimelineProps {
  messages: DiscussionMessage[]
  autoScroll?: boolean
}

export function DiscussionTimeline({ messages, autoScroll = true }: DiscussionTimelineProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, autoScroll])

  const rounds = [...new Set(messages.map((m) => m.round))].sort()

  return (
    <div className="flex flex-col gap-4 px-1">
      {rounds.map((round) => {
        const roundMsgs = messages.filter((m) => m.round === round)
        return (
          <div key={round}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-mono text-muted px-2">Round {round}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col gap-3">
              {roundMsgs.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} />
              ))}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
