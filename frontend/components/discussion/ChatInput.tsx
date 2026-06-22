'use client'

import { useState } from 'react'
import { Send, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DiscussionMessage } from '@/lib/types'
import { generateId } from '@/lib/utils'

const COST_PER_MESSAGE = 0.05
const MAX_CHARS = 300

interface ChatInputProps {
  onSend: (message: DiscussionMessage) => void
  totalAdded: number
  currentRound: number
}

export function ChatInput({ onSend, totalAdded, currentRound }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const remaining = MAX_CHARS - value.length
  const isOverLimit = remaining < 0
  const canSend = value.trim().length > 0 && !isOverLimit

  const handleSend = () => {
    if (!canSend) return
    const msg: DiscussionMessage = {
      id: generateId(),
      from: 'user',
      to: 'all',
      content: value.trim(),
      type: 'user_question',
      round: currentRound,
      timestamp: Date.now(),
    }
    onSend(msg)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-white p-4 space-y-2">
      {/* Cost indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <DollarSign size={11} className="text-gain-accent" />
          <span className="text-xs font-mono text-slate">
            +${COST_PER_MESSAGE.toFixed(2)} per message you send
          </span>
          {totalAdded > 0 && (
            <span className="text-xs font-mono text-muted ml-2">
              · total added: <span className="text-gain-accent">${totalAdded.toFixed(2)}</span>
            </span>
          )}
        </div>
        <span
          className={cn(
            'text-xs font-mono',
            remaining < 50 ? 'text-warning' : 'text-muted',
            isOverLimit && 'text-conflict',
          )}
        >
          {remaining < 100 ? `${remaining}` : ''}
        </span>
      </div>

      {/* Input row */}
      <div
        className={cn(
          'flex items-end gap-2 rounded-xl border bg-cream px-3 py-2 transition-colors',
          focused ? 'border-blue' : 'border-border',
          isOverLimit && 'border-conflict',
        )}
      >
        {/* User avatar */}
        <div className="shrink-0 mb-0.5">
          <div className="w-6 h-6 rounded-full bg-blue-soft border border-blue/20 flex items-center justify-center">
            <span className="text-[9px] font-mono font-bold text-blue">YOU</span>
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or challenge any mind... (Enter to send)"
          className="flex-1 resize-none bg-transparent text-sm text-navy placeholder:text-muted outline-none min-h-[36px] max-h-[120px] leading-relaxed py-1"
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'shrink-0 mb-0.5 w-7 h-7 rounded-lg border flex items-center justify-center transition-all',
            canSend
              ? 'border-navy text-navy hover:bg-navy hover:text-white active:scale-95'
              : 'bg-cream text-muted cursor-not-allowed border-border',
          )}
        >
          <Send size={13} />
        </button>
      </div>

      <p className="text-[10px] font-mono text-muted text-center">
        Your message will be sent to all 6 minds · Shift+Enter for new line
      </p>
    </div>
  )
}
