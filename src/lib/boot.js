// Session gate for the boot animation. The overlay should greet a visitor
// once, not replay on every route change or refresh within the same tab.
// sessionStorage persists across reloads in the tab; the module-level flag
// covers client-side remounts and any environment where storage throws.

const KEY = 'minul:booted'
let played = false

export function shouldPlayBoot() {
  if (played) return false
  try {
    return sessionStorage.getItem(KEY) !== '1'
  } catch {
    return true
  }
}

export function markBootPlayed() {
  played = true
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // storage unavailable (private mode quirks); module flag still holds
  }
}
