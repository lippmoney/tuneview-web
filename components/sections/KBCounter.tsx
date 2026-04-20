'use client'
import { useEffect, useRef, useState } from 'react'

interface Stats {
  kb_entries: number
  categories: number
  engine_families: number
  active_tips: number
  added_this_month: number
  outcomes_recorded: number
  last_kb_update: string
}

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0)
  const raf = useRef<number | undefined>(undefined)
  const start = useRef<number | undefined>(undefined)

  useEffect(() => {
    start.current = undefined
    const step = (timestamp: number) => {
      if (!start.current) start.current = timestamp
      const progress = Math.min((timestamp - start.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])

  return <>{current.toLocaleString()}</>
}

export default function KBCounter() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const STATS = [
    {
      value: stats?.kb_entries ?? 0,
      label: 'calibration entries',
      sub: stats?.added_this_month
        ? `+${stats.added_this_month} this month`
        : 'and growing',
      color: '#00DCFF',
    },
    {
      value: stats?.categories ?? 0,
      label: 'categories',
      sub: 'knock · fuel · MAF · VT · trans...',
      color: '#00DCFF',
    },
    {
      value: stats?.engine_families ?? 0,
      label: 'engine families',
      sub: 'Gen5 LT · LS · marine · more',
      color: '#00DCFF',
    },
    {
      value: stats?.active_tips ?? 0,
      label: 'injectable tips',
      sub: 'bad ones get retired',
      color: '#00DCB4',
    },
  ]

  const lastUpdate = stats?.last_kb_update
    ? new Date(stats.last_kb_update).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : '—'

  return (
    <section className="py-28 px-5 md:px-10" ref={ref}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-[11px] text-cyan tracking-[3px] mb-4">
            // CALIBRATION KNOWLEDGE BASE
          </p>
          <h2 className="font-display font-bold text-t1 leading-tight mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
            The platform learns.<br />
            <span className="text-cyan">Here&apos;s the proof.</span>
          </h2>
          <p className="font-mono text-[13px] text-t2 tracking-wide leading-relaxed max-w-xl">
            Every entry is sourced from real calibration data, forum expertise,
            and tuner outcomes. Bad tips get retired. Good ones get more confident.
            The numbers below are live — pulled from the database right now.
          </p>
        </div>

        {/* Counter grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px mb-px"
          style={{ background: 'var(--border)' }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col gap-3 p-8" style={{ background: 'var(--panel)' }}>
              <div className="w-8 h-px opacity-40" style={{ background: 'var(--cyan)' }} />
              <div
                className="font-display font-bold leading-none"
                style={{
                  fontSize: 'clamp(48px, 5vw, 72px)',
                  color: s.color,
                  textShadow: `0 0 20px ${s.color}40`,
                }}
              >
                {visible && stats ? <AnimatedNumber target={s.value} /> : '—'}
              </div>
              <div className="font-mono text-[11px] text-t2 tracking-[2px] uppercase">
                {s.label}
              </div>
              <div className="font-mono text-[10px] text-t3 tracking-[1px]">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Last updated row */}
        <div
          className="flex justify-between items-center px-6 py-3"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
        >
          <span className="font-mono text-[11px] text-t3 tracking-[2px]">
            // LAST UPDATED
          </span>
          <span className="font-mono text-[11px] text-t2 tracking-[1px]">
            {lastUpdate}
          </span>
        </div>

        {/* Retirement proof note */}
        <div
          className="mt-4 px-6 py-4"
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderLeft: '2px solid var(--amber)',
          }}
        >
          <p className="font-mono text-[12px] text-t2 leading-relaxed tracking-wide">
            <span className="text-amber">// NOTE:</span>{' '}
            Tips with low helpfulness ratings are automatically retired.
            The active tip count above reflects only tips that have proven useful
            across real tune sessions. This number goes up and down.
          </p>
        </div>

      </div>
    </section>
  )
}
