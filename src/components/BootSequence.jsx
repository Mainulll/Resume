import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const LINES = [
  { kind: 'cmd', text: './portfolio.sh --theme=electric' },
  { kind: 'ok', text: 'mounting /minul/portfolio' },
  { kind: 'ok', text: 'loading config.json' },
  { kind: 'ok', text: 'initialising theme → electric' },
  { kind: 'ok', text: 'hydrating sections (5 found)' },
  { kind: 'ok', text: 'ready in 0.8s' },
  { kind: 'done', text: 'open hero' },
]

export default function BootSequence() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reduce) {
      setVisible(false)
      return
    }
    const total = 1350 // ms — matches last animation-delay + buffer
    const t = setTimeout(() => setVisible(false), total)
    return () => clearTimeout(t)
  }, [reduce])

  if (reduce) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="boot-overlay"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="boot-window">
            <div className="boot-titlebar">
              <div className="boot-dots"><span /><span /><span /></div>
              <div className="boot-title mono">portfolio.sh — booting…</div>
              <div style={{ width: 47 }} />
            </div>
            <div className="boot-body mono">
              {LINES.map((l, i) => (
                <div
                  key={i}
                  className={`boot-line boot-${l.kind}`}
                  style={{ animationDelay: `${0.1 + i * 0.2}s` }}
                >
                  {l.kind === 'cmd' && <span className="boot-prompt">$</span>}
                  {l.kind === 'ok' && <span className="boot-ok">[ OK ]</span>}
                  {l.kind === 'done' && <span className="boot-prompt">$</span>}
                  <span className="boot-text">{l.text}</span>
                  {l.kind === 'done' && <span className="boot-cursor" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
