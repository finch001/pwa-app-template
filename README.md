# PWA App Template

A modern, production-ready PWA starter with a Duolingo-inspired design system. Built with React 19, TypeScript, Vite, and Tailwind CSS 4.

## Features

- **🎨 Duolingo-Inspired Design** — Flat colors, no shadows, bold typography, playful animations
- **📱 PWA-First** — Offline support, installable, safe area handling for mobile devices
- **🌙 Dark Mode** — System/light/dark theme switching with CSS variables
- **🗄️ Local Data** — Dexie.js (IndexedDB) + localStorage patterns for offline-first apps
- **⚡ Fast Build** — Vite 7 with optimized production builds
- **🎯 Type-Safe** — TypeScript 5.9 in strict mode
- **🧩 Headless UI** — Base UI components for custom styling
- **🎭 Gesture System** — Floating dock navigation with swipe gestures and haptic feedback
- **📦 Zero Config** — Works out of the box, customize as needed

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9 + Vite 7
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Routing**: React Router DOM 7 (hash-based)
- **UI Components**: @base-ui/react (headless)
- **Icons**: Nucleo Glass + Nucleo UI
- **Database**: Dexie.js 4 (IndexedDB wrapper)
- **Notifications**: sileo (toast system)
- **PWA**: vite-plugin-pwa (Workbox)
- **Package Manager**: pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## Architecture Patterns

### 1. Routing Pattern

Two-tier routing system with layout-wrapped routes vs full-screen routes:

```tsx
// Layout routes (with Dock navigation)
<Route element={<Layout />}>
  <Route path="/" element={<Home />} />
  <Route path="/settings" element={<Settings />} />
</Route>

// Full-screen routes (no Layout, no Dock)
<Route path="/tools/:feature/session/:id" element={<Session />} />
```

### 2. Database Pattern

Dexie.js with incremental schema versioning and TypeScript `EntityTable` types:

```typescript
class Database extends Dexie {
  tasks!: EntityTable<Task, 'id'>

  constructor() {
    super('DatabaseName')
    this.version(1).stores({
      tasks: 'id, createdAt'
    })
  }
}
```

See [src/lib/db.example.ts](src/lib/db.example.ts) for a complete example.

### 3. Settings Pattern

Type-safe localStorage management with defaults and side effects:

```typescript
export function updateSettings(updates: Partial<Settings>) {
  const current = getSettings()
  const next = { ...current, ...updates }
  localStorage.setItem('app-settings', JSON.stringify(next))
  // Apply side effects (theme, language, etc.)
}
```

See [src/lib/settings.example.ts](src/lib/settings.example.ts) for a complete example.

### 4. Gesture Pattern

Pointer event-based swipe detection with spring animations:

```typescript
const { navRef, getItemProps } = useDockGesture(navItems, navigate)
```

See [src/hooks/useDockGesture.ts](src/hooks/useDockGesture.ts) for implementation.

### 5. Dark Mode Pattern

CSS class toggle on `<html>` element with CSS variables:

```typescript
applyColorMode('dark') // Adds .dark class
applyColorMode('system') // Follows prefers-color-scheme
```

See [src/lib/settings.ts](src/lib/settings.ts) for implementation.

## Design System

### Color Palette

| Token              | Hex       | Usage                                   |
|--------------------|-----------|------------------------------------------|
| `duo-green`        | `#58CC02` | Primary actions, active states          |
| `duo-orange`       | `#FF9600` | Warnings, streaks, highlights           |
| `duo-blue`         | `#1CB0F6` | Informational accents                   |
| `duo-purple`       | `#CE82FF` | Secondary accents                       |
| `duo-red`          | `#FF4B4B` | Danger actions, alerts                  |
| `duo-yellow`       | `#FFC800` | Celebrations, highlights                |
| `duo-gray`         | `#E5E5E5` | Disabled states, separators             |

### Design Principles

1. **No shadows** — Use borders for depth: `border border-gray-200 dark:border-gray-700/60`
2. **Bold typography** — Headlines: `font-extrabold`, labels: `font-bold`
3. **Flat color fills** — Solid colors, no gradients (except hero banner)
4. **Rounded corners** — Cards: `rounded-2xl`, buttons: `rounded-xl`

### Dark Mode Tokens

| Element      | Light               | Dark                   |
|-------------|----------------------|------------------------|
| Page bg     | `bg-gray-50`         | `bg-[#1a1a2e]`        |
| Card bg     | `bg-white`           | `bg-[#16213e]`        |
| Card border | `border-gray-200`    | `border-gray-700/60`  |
| Text primary| `text-gray-800`      | `text-white`           |
| Text muted  | `text-gray-400`      | `text-gray-500`        |

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Dock.tsx      # Floating bottom navigation with gesture support
│   ├── Layout.tsx    # Page layout wrapper with ScrollArea
│   └── StickyHeader.tsx
├── config/           # App configuration
│   ├── navigation.ts # Dock navigation items (configurable)
│   └── tools.ts      # Tool cards for home page grid
├── hooks/            # Custom React hooks
│   └── useDockGesture.ts
├── lib/              # Pure utilities
│   ├── settings.ts   # Settings management (actual)
│   ├── settings.example.ts  # Pattern documentation
│   ├── db.example.ts # Database pattern documentation
│   ├── haptics.ts    # Haptic feedback
│   └── time.ts       # Date/time utilities
├── pages/            # Route components
│   ├── Home.tsx
│   └── Settings.tsx
└── main.tsx          # App entry point
```

## PWA Configuration

Configured in [vite.config.ts](vite.config.ts):

- **Display mode**: `standalone` (full-screen like native)
- **Safe area insets**: Handled via CSS `env()` variables
- **Offline caching**: Workbox with runtime caching strategies
- **Update prompt**: Service worker update detection in Settings page

## Customization

### 1. Update App Identity

- **Name**: Change in [package.json](package.json), [public/manifest.json](public/manifest.json), and [src/pages/Home.tsx](src/pages/Home.tsx)
- **Logo**: Replace [public/mascot.png](public/mascot.png) and PWA icons in [public/](public/)
- **Colors**: Customize in [src/index.css](src/index.css) (`:root` CSS variables)

### 2. Add Navigation Items

Edit [src/config/navigation.ts](src/config/navigation.ts):

```typescript
export const navItems = [
  { to: "/", label: "Home", Icon: IconHouse },
  { to: "/settings", label: "Settings", Icon: IconGear },
]
```

### 3. Add Tools

Edit [src/config/tools.ts](src/config/tools.ts) to add tool cards to the home page grid.

## License

MIT

---

Made with care by [Cali](https://cali.so)
