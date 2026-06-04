import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="page-shell container">
      <p className="page-breadcrumb mono">
        <Link to="/">~</Link> / <span className="page-bc-current">404</span>
      </p>
      <div className="term-window" style={{ maxWidth: 520, margin: '2rem 0' }}>
        <div className="term-titlebar">
          <div className="term-dots"><span /><span /><span /></div>
          <div className="term-title mono">error — file not found</div>
          <div style={{ width: 47 }} />
        </div>
        <div className="term-body mono">
          <div className="term-line term-cmd"><span className="term-prompt">$</span><span className="term-content">cat /requested-path</span></div>
          <div className="term-line term-out" style={{ color: 'var(--accent-red)' }}>cat: no such file or directory</div>
          <div className="term-line term-cmd" style={{ marginTop: '0.5rem' }}><span className="term-prompt">$</span><span className="term-content">cd .. <span className="term-cursor" /></span></div>
        </div>
      </div>
      <p className="page-back mono">
        <Link to="/"><span className="footer-p">$</span> cd .. <span aria-hidden="true">→</span> home</Link>
      </p>
    </main>
  )
}
