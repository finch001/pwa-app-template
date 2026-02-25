/**
 * Settings Pattern Example — Type-safe localStorage management
 *
 * This file demonstrates the settings pattern used in this template.
 * Settings are stored in localStorage with JSON serialization and type-safe getters/setters.
 *
 * Key Concepts:
 * 1. Type-safe interface — Define your settings schema once
 * 2. Default values — Provide sensible defaults for all settings
 * 3. Partial updates — Allow updating only specific fields
 * 4. Side effects — Apply settings changes immediately (e.g., theme, language)
 *
 * @see src/lib/settings.ts for the actual implementation (only colorMode)
 */

// ==================== Example Settings Schema ====================

export type Language = 'en' | 'zh' | 'ja' | 'es'
export type NotificationPreference = 'all' | 'important' | 'none'

export interface ExampleSettings {
  // Display preferences
  language: Language
  fontSize: number // 12-20px
  compactMode: boolean

  // Notification preferences
  notifications: NotificationPreference
  soundEnabled: boolean

  // Privacy preferences
  analyticsEnabled: boolean
  autoSave: boolean
  autoSaveInterval: number // seconds

  // User preferences
  username: string | null
  favoriteColor: string // hex color
}

// ==================== Storage Key ====================

const EXAMPLE_SETTINGS_KEY = 'app-example-settings'

// ==================== Default Values ====================

const defaultExampleSettings: ExampleSettings = {
  language: 'en',
  fontSize: 16,
  compactMode: false,
  notifications: 'all',
  soundEnabled: true,
  analyticsEnabled: true,
  autoSave: true,
  autoSaveInterval: 30,
  username: null,
  favoriteColor: '#58CC02', // duo-green
}

// ==================== Getters & Setters ====================

/**
 * Get current settings from localStorage with defaults
 */
export function getExampleSettings(): ExampleSettings {
  const raw = localStorage.getItem(EXAMPLE_SETTINGS_KEY)
  if (!raw) return defaultExampleSettings
  return { ...defaultExampleSettings, ...JSON.parse(raw) }
}

/**
 * Update settings (partial update) and apply side effects
 */
export function updateExampleSettings(updates: Partial<ExampleSettings>): void {
  const current = getExampleSettings()
  const next = { ...current, ...updates }
  localStorage.setItem(EXAMPLE_SETTINGS_KEY, JSON.stringify(next))

  // Apply side effects
  if ('language' in updates) {
    applyLanguage(next.language)
  }
  if ('fontSize' in updates) {
    applyFontSize(next.fontSize)
  }
  if ('favoriteColor' in updates) {
    applyAccentColor(next.favoriteColor)
  }
}

/**
 * Reset settings to defaults
 */
export function resetExampleSettings(): void {
  localStorage.removeItem(EXAMPLE_SETTINGS_KEY)
  // Re-apply defaults
  updateExampleSettings(defaultExampleSettings)
}

// ==================== Side Effect Handlers ====================

/**
 * Apply language setting (example: change HTML lang attribute)
 */
function applyLanguage(language: Language): void {
  document.documentElement.lang = language
  // In a real app, you'd load translations here
  console.log(`Language changed to: ${language}`)
}

/**
 * Apply font size setting (example: CSS variable)
 */
function applyFontSize(fontSize: number): void {
  document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`)
}

/**
 * Apply accent color (example: CSS variable for theming)
 */
function applyAccentColor(color: string): void {
  document.documentElement.style.setProperty('--accent-color', color)
}

// ==================== Initialization ====================

/**
 * Initialize settings on app load
 * Call this in main.tsx before rendering the app
 */
export function initializeExampleSettings(): void {
  const settings = getExampleSettings()
  applyLanguage(settings.language)
  applyFontSize(settings.fontSize)
  applyAccentColor(settings.favoriteColor)
}

// ==================== Usage Examples ====================

/**
 * Example: Toggle compact mode
 */
export function toggleCompactMode(): void {
  const current = getExampleSettings()
  updateExampleSettings({ compactMode: !current.compactMode })
}

/**
 * Example: Update multiple settings at once
 */
export function updateUserPreferences(username: string, language: Language): void {
  updateExampleSettings({ username, language })
}

/**
 * Example: React hook for settings
 * (You'd use this in a component with useState)
 */
// import { useState } from 'react'
//
// export function useExampleSettings() {
//   const [settings, setSettings] = useState<ExampleSettings>(getExampleSettings)
//
//   function update(patch: Partial<ExampleSettings>) {
//     const next = { ...settings, ...patch }
//     setSettings(next)
//     localStorage.setItem(EXAMPLE_SETTINGS_KEY, JSON.stringify(next))
//     // Apply side effects here
//   }
//
//   return [settings, update] as const
// }

// ==================== Best Practices ====================

/**
 * 1. Always provide defaults
 *    - Prevents undefined/null checks throughout the app
 *    - Makes it easy to add new settings (old users get the default)
 *
 * 2. Use a single settings object
 *    - Easier to manage than multiple localStorage keys
 *    - One JSON.parse/stringify per read/write
 *
 * 3. Apply side effects in updateSettings()
 *    - Ensures settings changes take effect immediately
 *    - Examples: theme changes, language switches, feature toggles
 *
 * 4. Type safety is key
 *    - Define an interface for your settings
 *    - Use Partial<Settings> for updates
 *    - Never use `any` for settings values
 *
 * 5. Migration strategy
 *    - When renaming settings, support old keys for one release
 *    - Check for old keys in getSettings() and migrate automatically
 *    - Example: if ('oldKey' in parsed) { ... }
 *
 * 6. Validation (optional)
 *    - For user-editable settings, validate ranges/formats
 *    - Example: fontSize should be 12-20, not 999
 *    - Use Zod or similar for complex validation
 */
