# Findings

## Research Notes

### Codebase Architecture Analysis
**Date**: 2026-02-25

**Key Findings**:
- Codebase has clear separation between framework/architecture and business logic
- Current structure: 15 files pure architecture, 9 files pure business logic, 9 files hybrid
- Architecture is highly reusable: PWA setup, gesture system, design tokens, routing patterns
- Business logic is entirely baby/pregnancy-focused with Chinese hardcoded strings
- No backend dependencies - all data stored locally (Dexie.js + localStorage)

**Files Examined**:
- `src/lib/` - 11 utility files (mix of generic and baby-specific)
- `src/components/` - 5 components (mostly pure, some hybrid)
- `src/pages/` - All 4 tool directories + 3 main pages (Home, History, Settings)
- `src/hooks/` - 1 generic gesture hook
- Root config files - all architecture

**Implications**:
- Can cleanly extract architecture without breaking core patterns
- Need to preserve 8 key architectural patterns (routing, database setup, settings, gestures, dark mode, PWA, tool system, design tokens)
- Most deletion work in `src/pages/tools/` and `src/lib/` business utilities

---

## Code Patterns to Preserve

### Routing Pattern
**Location**: `src/App.tsx`

**Description**: Two-tier routing system with Layout-wrapped routes vs full-screen session routes

**Example**:
```tsx
// Layout routes (with Dock navigation)
<Route element={<Layout />}>
  <Route path="/" element={<Home />} />
  <Route path="/history" element={<History />} />
</Route>

// Full-screen routes (no Layout)
<Route path="/tools/:feature/session/:id" element={<Session />} />
```

---

### Database Pattern
**Location**: `src/lib/db.ts`

**Description**: Dexie.js with incremental schema versioning and TypeScript EntityTable types

**Example**:
```typescript
class Database extends Dexie {
  sessions!: EntityTable<Session, 'id'>

  constructor() {
    super('DatabaseName')
    this.version(1).stores({
      sessions: 'id, createdAt'
    })
  }
}
```

---

### Settings Pattern
**Location**: `src/lib/settings.ts`

**Description**: Type-safe localStorage management with defaults and getters/setters

**Example**:
```typescript
interface Settings {
  colorMode: 'system' | 'light' | 'dark'
  customField: string
}

const DEFAULTS: Settings = { colorMode: 'system', customField: 'value' }

export function getSettings(): Settings {
  const stored = localStorage.getItem('app-settings')
  return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS
}

export function updateSettings(updates: Partial<Settings>) {
  const current = getSettings()
  localStorage.setItem('app-settings', JSON.stringify({ ...current, ...updates }))
}
```

---

### Gesture Pattern
**Location**: `src/hooks/useDockGesture.ts`

**Description**: Pointer event-based swipe detection with spring animations and haptic feedback

**Key States**: `idle → pressing → panning → animating`

**Features**:
- Threshold-based gesture recognition (8px horizontal movement)
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Haptic feedback on navigation change
- Preserves tap behavior for quick clicks

---

### Dark Mode Pattern
**Location**: `src/main.tsx` + `src/index.css`

**Description**: CSS class toggle on `<html>` element with CSS variables for theming

**Example**:
```typescript
// Apply dark mode
function applyColorMode(mode: 'system' | 'light' | 'dark') {
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}
```

```css
/* CSS variables */
:root {
  --dock-accent-1: #1a1a1a;
}
.dark {
  --dock-accent-1: #ffffff;
}
```

---

### Tool System Pattern
**Location**: `src/lib/tools.tsx`

**Description**: Configurable grid of feature cards with dynamic ordering and availability gating

**Example**:
```typescript
interface ToolCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  isAvailable?: () => boolean
}

const allTools: ToolCard[] = [...]

export function getOrderedTools(): ToolCard[] {
  // Dynamic ordering based on app state
  return allTools.filter(t => t.isAvailable?.() ?? true)
}
```

---

## Dependencies & Tools

### @base-ui/react
**Version**: 0.2.6
**Purpose**: Headless UI components (unstyled, accessible)
**Key APIs**: Dialog, Collapsible, Tabs, Progress, NumberField, Toggle, ScrollArea
**Docs**: Provides WAI-ARIA compliant primitives for custom-styled components

### Dexie.js
**Version**: 4.0.10
**Purpose**: IndexedDB wrapper with TypeScript support
**Key APIs**: `EntityTable`, `db.version().stores()`, `db.transaction()`
**Docs**: Used for persistent local data storage with versioned schemas

### sileo
**Version**: 1.1.3
**Purpose**: Toast notification system
**Key APIs**: `sileo.success()`, `sileo.error()`, `sileo.info()`
**Docs**: Lightweight toast library with customizable styling via CSS variables

### react-day-picker
**Version**: 9.4.4
**Purpose**: Date picker component
**Key APIs**: `<DayPicker>` with Chinese localization (`zh-CN`)
**Docs**: Used in bottom sheet dialogs for date selection

### vite-plugin-pwa
**Version**: 0.21.3
**Purpose**: Progressive Web App generation with Workbox
**Key APIs**: `VitePWA()` plugin config in `vite.config.ts`
**Docs**: Generates service worker, manifest.json, and handles offline caching

---

## Issues & Blockers

### No Current Blockers
**Status**: 🟢 Resolved

**Description**: Analysis complete, all patterns documented, clear execution path identified

**Impact**: Ready to proceed with phased cleanup

**Resolution**: N/A

---
