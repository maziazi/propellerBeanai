'use client'

import { motion } from 'framer-motion'
import { MINDS } from '@/lib/minds'

const RADIUS = 90
const CENTER = 120

function getHexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
}

export function HexagonOrbit() {
  return (
    <div className="relative w-[240px] h-[240px] flex items-center justify-center">
      <svg
        width={240}
        height={240}
        viewBox="0 0 240 240"
        className="absolute inset-0"
      >
        {/* Orbit ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#1E1E1E"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        {/* Center hexagon */}
        <polygon
          points={getHexPoints(CENTER, CENTER, 24)}
          fill="#141414"
          stroke="#3A3A3A"
          strokeWidth={1}
        />
        <text
          x={CENTER}
          y={CENTER + 4}
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
          fill="#F0F0F0"
        >
          BEAN
        </text>
      </svg>

      {MINDS.map((mind, i) => {
        const angle = (Math.PI * 2 / MINDS.length) * i - Math.PI / 2
        const x = CENTER + RADIUS * Math.cos(angle)
        const y = CENTER + RADIUS * Math.sin(angle)

        return (
          <motion.div
            key={mind.key}
            className="absolute"
            style={{
              left: x - 20,
              top: y - 20,
              width: 40,
              height: 40,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2.5 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              <svg width={40} height={40} viewBox="0 0 40 40">
                <polygon
                  points={getHexPoints(20, 20, 16)}
                  fill={mind.bg}
                  stroke={mind.accent}
                  strokeWidth={1.5}
                />
                <text
                  x={20}
                  y={24}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill={mind.accent}
                >
                  {mind.label.slice(0, 2)}
                </text>
              </svg>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
