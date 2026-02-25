export type ColorMode = 'system' | 'light' | 'dark'

export interface Settings {
  colorMode: ColorMode
}

const SETTINGS_KEY = 'app-settings'

const defaultSettings: Settings = {
  colorMode: 'system',
}

export function getSettings(): Settings {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (!raw) return defaultSettings
  return { ...defaultSettings, ...JSON.parse(raw) }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  applyColorMode(settings.colorMode)
}

let _systemDarkQuery: MediaQueryList | null = null

export function applyColorMode(mode: ColorMode): void {
  if (mode === 'system') {
    if (!_systemDarkQuery) {
      _systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    }
    document.documentElement.classList.toggle('dark', _systemDarkQuery.matches)
    _systemDarkQuery.addEventListener('change', _onSystemChange)
  } else {
    _systemDarkQuery?.removeEventListener('change', _onSystemChange)
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }
}

function _onSystemChange(e: MediaQueryListEvent): void {
  document.documentElement.classList.toggle('dark', e.matches)
}
