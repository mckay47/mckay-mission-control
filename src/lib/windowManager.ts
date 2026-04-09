// Central window manager — tracks opened windows, focuses existing instead of opening duplicates

const windows = new Map<string, Window>()

export function openOrFocus(path: string, features = 'width=1440,height=900,menubar=no,toolbar=no') {
  const existing = windows.get(path)

  // If window exists and is still open → focus it
  if (existing && !existing.closed) {
    existing.focus()
    return
  }

  // Open new window with a named target (prevents duplicates even if ref is lost)
  const name = `mc_${path.replace(/[^a-zA-Z0-9]/g, '_')}`
  const win = window.open(path, name, features)
  if (win) {
    windows.set(path, win)
  }
}
