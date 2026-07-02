'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { DiscussionMessage } from '@/lib/types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

/**
 * Replays a debate as a live conversation: each mind "types" (indicator shown)
 * then posts its message, so arguments arrive turn-by-turn instead of all at once.
 */
export function LiveDebate({ messages }: { messages: DiscussionMessage[] }) {
  const ordered = useMemo(
    () => [...messages].sort((a, b) => a.round - b.round || a.timestamp - b.timestamp),
    [messages],
  )

  const [live, setLive] = useState(true)
  const [count, setCount] = useState(0)
  const [typing, setTyping] = useState<DiscussionMessage | null>(null)
  const revealedRef = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!live) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    let i = revealedRef.current

    const step = () => {
      if (cancelled) return
      if (i >= ordered.length) { setTyping(null); return }
      const msg = ordered[i]
      const isUser = msg.from === 'user'
      // typing time scales with message length (feels like real composing)
      const delay = isUser ? 0 : Math.min(2600, 700 + msg.content.length * 11)
      if (!isUser) setTyping(msg)
      timers.push(setTimeout(() => {
        if (cancelled) return
        setTyping(null)
        i += 1
        revealedRef.current = i
        setCount(i)
        timers.push(setTimeout(step, isUser ? 120 : 450))
      }, delay))
    }

    step()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [ordered, live])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [count, typing])

  const shown = live ? count : ordered.length
  const activeTyping = live ? typing : null
  const visible = ordered.slice(0, shown)
  const rounds = [...new Set(visible.map((m) => m.round))].sort((a, b) => a - b)
  const done = shown >= ordered.length && activeTyping === null
  const typingInNewRound = activeTyping !== null && !rounds.includes(activeTyping.round)

  return (
    <div className="flex flex-col gap-4 px-1">
      {rounds.map((round) => {
        const roundMsgs = visible.filter((m) => m.round === round)
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
              <AnimatePresence>
                {activeTyping && activeTyping.round === round && <TypingIndicator key="typing" message={activeTyping} />}
              </AnimatePresence>
            </div>
          </div>
        )
      })}

      {/* First message of a brand-new round: show its divider + typing indicator */}
      {typingInNewRound && activeTyping && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-mono text-muted px-2">Round {activeTyping.round}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <TypingIndicator message={activeTyping} />
        </div>
      )}

      {live && !done && (
        <button
          onClick={() => setLive(false)}
          className="self-center text-[11px] font-mono text-muted hover:text-navy transition-colors mt-1"
        >
          Skip animation ▶▶
        </button>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
