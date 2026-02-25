import { beforeEach, describe, expect, it, vi } from 'vitest'

interface ControlledMediaQueryList extends MediaQueryList {
  emitChange: (matches: boolean) => void
}

function installMatchMedia(initialMatches = false): ControlledMediaQueryList {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const mediaQueryList = {
    matches: initialMatches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn((type: string, callback: EventListenerOrEventListenerObject) => {
      if (type !== 'change') return
      if (typeof callback === 'function') {
        listeners.add(callback as (event: MediaQueryListEvent) => void)
      }
    }),
    removeEventListener: vi.fn((type: string, callback: EventListenerOrEventListenerObject) => {
      if (type !== 'change') return
      if (typeof callback === 'function') {
        listeners.delete(callback as (event: MediaQueryListEvent) => void)
      }
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    emitChange(matches: boolean) {
      mediaQueryList.matches = matches
      const event = { matches, media: mediaQueryList.media } as MediaQueryListEvent
      for (const listener of listeners) listener(event)
    },
  } as ControlledMediaQueryList

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => mediaQueryList),
  })

  return mediaQueryList
}

async function loadSettingsModule() {
  vi.resetModules()
  return import('./settings.ts')
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.className = ''
})

describe('settings', () => {
  it('returns default settings when storage is empty', async () => {
    installMatchMedia(false)
    const { getSettings } = await loadSettingsModule()

    expect(getSettings()).toEqual({
      colorMode: 'system',
    })
  })

  it('applies explicit color mode and persists via saveSettings', async () => {
    installMatchMedia(false)
    const { saveSettings } = await loadSettingsModule()

    saveSettings({
      colorMode: 'dark',
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('app-settings')).toContain('"colorMode":"dark"')
  })

  it('follows system theme and updates on system changes', async () => {
    const mql = installMatchMedia(false)
    const { applyColorMode } = await loadSettingsModule()

    applyColorMode('system')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    mql.emitChange(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    applyColorMode('light')
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
