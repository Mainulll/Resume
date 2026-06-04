import { Link } from 'react-router-dom'
import { allPosts } from '../lib/posts.js'

export default function WritingIndex() {
  return (
    <main className="page-shell container">
      <p className="page-breadcrumb mono">
        <Link to="/">~</Link> / <span className="page-bc-current">writing</span>
      </p>
      <header className="section-header" style={{ marginTop: '0.5rem' }}>
        <span className="section-hash mono">#</span>
        <span className="section-num mono">all /</span>
        <h1 className="section-title">writing</h1>
        <span className="section-fill-line" aria-hidden="true" />
      </header>
      {allPosts.length === 0 ? (
        <p className="post-empty mono">
          <span className="post-empty-prompt">$</span> ls ~/writing/ <span className="post-empty-arrow">→</span> (empty)
        </p>
      ) : (
        <div className="post-list">
          {allPosts.map((p) => (
            <Link key={p.slug} to={`/writing/${p.slug}`} className="post-row">
              <span className="post-date mono">{p.displayDate}</span>
              <span className="post-title">{p.title}<span className="post-arrow" aria-hidden="true"> →</span></span>
              <span className="post-meta mono">~{p.readingMinutes} min</span>
            </Link>
          ))}
        </div>
      )}
      <p className="page-back mono" style={{ marginTop: '2rem' }}>
        <Link to="/"><span className="footer-p">$</span> cd .. <span aria-hidden="true">→</span> home</Link>
      </p>
    </main>
  )
}
