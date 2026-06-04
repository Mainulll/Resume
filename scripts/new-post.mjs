import { mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join } from 'node:path'
import { argv, exit, cwd } from 'node:process'

const title = argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: npm run new-post "Your title here"')
  exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const slug = title
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)

if (!slug) {
  console.error('Could not derive a slug from the title.')
  exit(1)
}

const filename = `${today}-${slug}.md`
const dir = join(cwd(), 'src', 'content', 'posts')
const filepath = join(dir, filename)

await mkdir(dir, { recursive: true })

try {
  await access(filepath, constants.F_OK)
  console.error(`File already exists: ${filepath}`)
  exit(1)
} catch {
  // doesn't exist — good
}

const body = `---
title: ${title}
date: ${today}
excerpt: TODO — one-sentence summary that shows up on the index and in RSS.
tags: []
draft: true
---

Write here. Set draft: false when ready to publish.
`

await writeFile(filepath, body, 'utf-8')
console.log(`✔ Created src/content/posts/${filename}`)
console.log(`  Open it in your editor and start writing.`)
