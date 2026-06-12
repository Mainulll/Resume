import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { shouldPlayBoot, markBootPlayed } from '../lib/boot.js'

const LINES = [
  { kind: 'cmd', text: './portfolio.sh --theme=electric' },
  { kind: 'ok', text: 'mounting /minul/portfolio' },
  { kind: 'ok', text: 'loading config.json' },
  { kind: 'ok', text: 'initialising theme → electric' },
  { kind: 'ok', text: 'hydrating sections (6 found)' },
  { kind: 'ok', text: 'ready in 0.8s' },
  { kind: 'done', text: 'open hero' },
]

const BOOT_MS = 1350

export default function BootSequence() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(() => !reduce && shouldPlayBoot())
  const overlayRef = useRef(null)

  // Auto-dismiss after BOOT_MS (and re-sync if reduce flips on mid-session)
  useEffect(() => {
    if (!visible) return
    if (reduce) {
      setVisible(false)
      return
    }
    const t = setTimeout(() => {
      markBootPlayed()
      setVisible(false)
    }, BOOT_MS)
    return () => clearTimeout(t)
  }, [reduce, visible])

  // While visible, make siblings inert so keyboard + AT can't reach them
  useEffect(() => {
    if (!visible || !overlayRef.current) return
    const parent = overlayRef.current.parentElement
    if (!parent) return
    const inerted = []
    for (const child of parent.children) {
      if (child !== overlayRef.current && !child.hasAttribute('inert')) {
        child.setAttribute('inert', '')
        inerted.push(child)
      }
    }
    return () => {
      for (const el of inerted) el.removeAttribute('inert')
    }
  }, [visible])

  if (reduce) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={overlayRef}
          className="boot-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-label="Loading portfolio"
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
