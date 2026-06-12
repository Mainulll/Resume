import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import json from 'highlight.js/lib/languages/json'
import { getPost } from '../lib/posts.js'
import 'highlight.js/styles/github-dark-dimmed.css'

// Register only the languages posts actually use, so highlighting is
// deterministic. Note: rehype-highlight statically imports lowlight's
// `common` set either way, so this doesn't shrink the chunk itself. The
// bundle win comes from this whole route being lazy-loaded (see main.jsx).
const HLJS_LANGUAGES = { javascript, typescript, bash, python, json }

export default function PostPage() {
  const { slug } = useParams()
  const post = getPost(slug)

  useEffect(() => {
    if (post) document.title = `${post.title} — Minul Lokuliyana`
    return () => { document.title = 'Minul Lokuliyana — Customer Success @ Aphex' }
  }, [post])

  if (!post) return <Navigate to="/404" replace />

  return (
    <main className="page-shell container">
      <p className="page-breadcrumb mono">
        <Link to="/">~</Link> / <Link to="/writing">writing</Link> / <span className="page-bc-current">{post.slug}</span>
      </p>
      <article className="post-article">
        <h1 className="post-h1">{post.title}</h1>
        <p className="post-meta-row mono">
          <span>{post.displayDate}</span>
          <span className="post-meta-sep">·</span>
          <span>~{post.readingMinutes} min</span>
          {post.tags.length > 0 && (
            <>
              <span className="post-meta-sep">·</span>
              <span className="post-tags">{post.tags.map((t) => `#${t}`).join(' ')}</span>
            </>
          )}
        </p>
        <div className="post-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { languages: HLJS_LANGUAGES }]]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
      <p className="page-back mono">
        <Link to="/writing"><span className="footer-p">$</span> cd .. <span aria-hidden="true">→</span> writing</Link>
      </p>
    </main>
  )
}
