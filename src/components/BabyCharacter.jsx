import { motion } from 'motion/react'
import { getWeek } from '../data/index.js'

/**
 * Animated baby illustration — floats gently up and down.
 * Uses the week's generated PNG/SVG when available, falls back to the SVG character.
 *
 * @param {{ week: number, className?: string }} props
 */
export default function BabyCharacter({ week, className = '' }) {
  const weekData = getWeek(week)
  const src = weekData?.illustration ?? null

  if (src) {
    return (
      <motion.img
        src={src}
        alt={`Week ${week} baby illustration`}
        className={className}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        draggable={false}
      />
    )
  }

  // Fallback SVG for weeks without a generated image
  return (
    <motion.svg
      viewBox="0 0 200 260"
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Twinkling stars */}
      <motion.circle cx="30" cy="30" r="3" fill="var(--color-primary)"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }} />
      <motion.circle cx="170" cy="50" r="2" fill="var(--color-primary)"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
      <motion.circle cx="160" cy="20" r="2.5" fill="var(--color-blue)"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 1 }} />

      {/* Stubby legs */}
      <ellipse cx="78" cy="215" rx="18" ry="22" fill="#fccdb7" />
      <ellipse cx="122" cy="215" rx="18" ry="22" fill="#fccdb7" />
      <ellipse cx="78" cy="230" rx="14" ry="10" fill="#fccdb7" />
      <ellipse cx="122" cy="230" rx="14" ry="10" fill="#fccdb7" />

      {/* Body */}
      <ellipse cx="100" cy="175" rx="42" ry="50" fill="#fdf8f0" />
      <ellipse cx="62" cy="175" rx="15" ry="24" fill="#fdf8f0" />
      <ellipse cx="138" cy="175" rx="15" ry="24" fill="#fdf8f0" />
      <circle cx="58" cy="195" r="10" fill="#fccdb7" />
      <circle cx="142" cy="195" r="10" fill="#fccdb7" />

      {/* Head */}
      <circle cx="100" cy="85" r="72" fill="#fccdb7" />
      <circle cx="52" cy="95" r="38" fill="#f2a07b" opacity="0.85" />
      <circle cx="148" cy="95" r="38" fill="#f2a07b" opacity="0.85" />
      <circle cx="50" cy="100" r="26" fill="#f2a07b" opacity="0.6" />
      <circle cx="150" cy="100" r="26" fill="#f2a07b" opacity="0.6" />

      {/* Eyes */}
      <ellipse cx="75" cy="80" rx="12" ry="14" fill="#5a4038" />
      <ellipse cx="125" cy="80" rx="12" ry="14" fill="#5a4038" />
      <circle cx="78" cy="77" r="4" fill="white" />
      <circle cx="128" cy="77" r="4" fill="white" />

      {/* Nose & smile */}
      <ellipse cx="100" cy="98" rx="5" ry="4" fill="#e89368" opacity="0.5" />
      <path d="M 90 110 Q 100 114 110 110" stroke="#8a6a5a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Hair */}
      <circle cx="100" cy="20" r="8" fill="#5a4038" />
      <circle cx="92" cy="24" r="6" fill="#5a4038" />
      <circle cx="108" cy="24" r="6" fill="#5a4038" />
    </motion.svg>
  )
}
