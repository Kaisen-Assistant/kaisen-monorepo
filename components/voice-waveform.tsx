"use client"

import { useEffect, useRef } from "react"

export default function VoiceWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const bars: { height: number; direction: number; speed: number }[] = []

    // Initialize bars
    const barCount = 8
    for (let i = 0; i < barCount; i++) {
      bars.push({
        height: Math.random() * 20 + 5,
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.5 + 0.2,
      })
    }

    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = 4
      const barGap = 4
      const startX = (canvas.width - (barCount * barWidth + (barCount - 1) * barGap)) / 2

      // Draw and update bars
      for (let i = 0; i < barCount; i++) {
        const bar = bars[i]

        // Update height
        bar.height += bar.direction * bar.speed

        // Change direction if reaching limits
        if (bar.height > 25 || bar.height < 5) {
          bar.direction *= -1
        }

        const x = startX + i * (barWidth + barGap)
        const y = (canvas.height - bar.height) / 2

        // Draw bar
        ctx.fillStyle = i % 2 === 0 ? "#a855f7" : "#8b5cf6"
        ctx.fillRect(x, y, barWidth, bar.height)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} width={100} height={30} className="voice-waveform" />
}

