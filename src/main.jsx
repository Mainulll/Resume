import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Blog routes are code-split: the homepage no longer ships react-markdown,
// remark/rehype, or highlight.js. The chunks load on first visit to /writing.
const WritingIndex = lazy(() => import('./components/WritingIndex.jsx'))
const PostPage = lazy(() => import('./components/PostPage.jsx'))
const NotFound = lazy(() => import('./components/NotFound.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/writing" element={<WritingIndex />} />
          <Route path="/writing/:slug" element={<PostPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
