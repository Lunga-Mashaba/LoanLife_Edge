"use client"

import { useEffect, useState, memo } from "react"

function AnimatedBackgroundComponent() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    // Generate random data stream particles (reduced count for performance)
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 20,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      {/* Data stream lines */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-[oklch(0.55_0.20_220)] to-transparent animate-data-stream"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Security grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(0deg, transparent 24%, oklch(0.25 0.04 250 / 0.05) 25%, oklch(0.25 0.04 250 / 0.05) 26%, transparent 27%, transparent 74%, oklch(0.25 0.04 250 / 0.05) 75%, oklch(0.25 0.04 250 / 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, oklch(0.25 0.04 250 / 0.05) 25%, oklch(0.25 0.04 250 / 0.05) 26%, transparent 27%, transparent 74%, oklch(0.25 0.04 250 / 0.05) 75%, oklch(0.25 0.04 250 / 0.05) 76%, transparent 77%, transparent)
        `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanning line effect */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[oklch(0.55_0.20_220)] to-transparent animate-scan-line opacity-50" />
    </div>
  )
}

// Memoize to prevent re-renders on every parent update
export const AnimatedBackground = memo(AnimatedBackgroundComponent)
