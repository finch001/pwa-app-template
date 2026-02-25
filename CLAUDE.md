# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev               # Start dev server (Vite)
pnpm build             # Type-check (tsc -b) then build for production
pnpm lint              # ESLint
pnpm preview           # Preview production build locally
pnpm test              # Run unit tests (Vitest)
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Generate test coverage report
pnpm test:e2e          # Run E2E tests (Playwright)
```

## Tech Stack

- **React 19** + **TypeScript 5.9** (strict mode) with **Vite 7**
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin (no postcss config needed)
- **React Router DOM 7** with browser routing (`BrowserRouter` in `main.tsx`)
- **@base-ui/react** — headless UI components (Dialog, Collapsible, ScrollArea, etc.)
- **sileo** — toast notifications (`sileo.success()`, `sileo.error()`, `sileo.info()`)
- **Dexie.js 4** (IndexedDB) for persistent data (see `src/lib/db.example.ts` for pattern)
- **vite-plugin-pwa** for offline-first PWA with Workbox caching (prompt mode)
- **Nucleo icons** — `nucleo-glass` (dock nav), `nucleo-ui-outline-duo-18` / `nucleo-ui-fill-duo-18` (tool icons)
- **agentation** — dev-only live state inspector (Zustand/Jotai support)
- **liveline** — dev-only network monitor overlay
- **canvas-confetti** — celebration effects library
- **Vitest** + **Testing Library** for unit tests, **Playwright** for E2E
- **pnpm** as package manager

## Architecture

This is a **PWA Template** — a Duolingo-inspired starter kit for building offline-first Progressive Web Apps. It's designed as a foundation for custom tools and features. No backend, no auth — everything runs locally in the browser.

### Routing

Routes are defined in [src/App.tsx](src/App.tsx). Two patterns:

- **Layout routes** (wrapped in `<Layout>` with Dock + ScrollArea): `/`, `/settings`, `/tools/*` home pages
- **Full-screen routes** (no Dock, no Layout): Add these for immersive flows/sessions

Current routes:
- `/` — Home page with tool grid
- `/settings` — Settings page
- `/tools/timer` — Timer tool home
- `/tools/notes` — Notes tool home

When building session-based tools, use `navigate(path, { replace: true })` when leaving sessions to prevent back-button confusion.

### Data Layer

- **Dexie database** (`src/lib/db.example.ts`): Example pattern for IndexedDB via Dexie. Schema versions are incremental — always add a new `db.version(N+1)` when adding tables/indexes. Use `crypto.randomUUID()` for IDs and `Date.now()` for timestamps.
- **Settings** (`src/lib/settings.example.ts`): Example pattern for localStorage-based settings with TypeScript safety.

### File Organization

- `src/components/` — reusable UI components (Layout, Dock, StickyHeader, ProgressRing)
- `src/hooks/` — custom React hooks (useDockGesture)
- `src/lib/` — pure utilities (haptics, time, plus example patterns for db/settings)
- `src/config/` — configuration files (navigation, tools)
- `src/pages/` — route-level components
- `src/pages/tools/<feature>/` — each tool gets its own subdirectory

### Key Conventions

- Components are **default exports**: `export default function ComponentName()`
- Hooks are **named exports**: `export function useHookName()`
- Imports use **explicit `.ts`/`.tsx` extensions**
- Timestamps are **milliseconds** (`Date.now()`), IDs are **`crypto.randomUUID()`**
- No state management library — React hooks + local component state only
- Use `sileo.success()` / `sileo.error()` / `sileo.info()` for user feedback instead of `alert()`
- Dev tools: `agentation` (state inspector) and `liveline` (network monitor) auto-load in dev mode

### Design System

Duolingo-inspired, flat, clean, and playful. Defined in `src/index.css` and applied via Tailwind utility classes throughout.

#### Core Principles

1. **No shadows** — Never use `shadow-*` classes on cards, containers, or buttons.
2. **Border-based contrast** — Use soft borders to define card edges: `border border-gray-200 dark:border-gray-700/60`.
3. **Bold typography** — Headlines use `font-extrabold`, labels use `font-bold`.
4. **Flat color fills** — Buttons and accents use solid Duo palette colors, never gradients (except the hero banner).

#### Color Palette (`src/index.css`)

| Token              | Hex       | Usage                                   |
|--------------------|-----------|------------------------------------------|
| `duo-green`        | `#58CC02` | Primary actions, kick counter, active toggle states |
| `duo-green-dark`   | `#46a302` | Button bottom borders (pressed look)     |
| `duo-orange`       | `#FF9600` | Streaks, contraction timer, warnings     |
| `duo-blue`         | `#1CB0F6` | Kick counter icon, informational accents |
| `duo-purple`       | `#CE82FF` | Due date, date picker accent             |
| `duo-red`          | `#FF4B4B` | Danger actions, stop buttons, alerts     |
| `duo-yellow`       | `#FFC800` | Celebrations, highlights                 |
| `duo-gray`         | `#E5E5E5` | Disabled states, separators              |

#### CSS Variables (`src/index.css`)

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--sileo-fill` | `#f3f3f3` | `#161616` | Toast notification SVG fill |
| `--dock-accent-1` | `#1a1a1a` | `#d4d4d4` | Nucleo glass icon gradient stop 1 |
| `--dock-accent-2` | `#404040` | `#eeeeee` | Nucleo glass icon gradient stop 2 |
| `--safe-area-top` | `env(safe-area-inset-top, 0px)` | - | iOS safe area top inset |
| `--safe-area-bottom` | `env(safe-area-inset-bottom, 0px)` | - | iOS safe area bottom inset |

#### Cards

- Background: `bg-white dark:bg-[#16213e]`
- Border: `border border-gray-200 dark:border-gray-700/60`
- Radius: `rounded-2xl` (standard) or `rounded-3xl` (hero/featured)
- Padding: `p-5` (standard) or `p-4` (compact lists)
- No shadows ever

#### Section Headers

Uppercase, tiny, bold, gray:
```
<p class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
  SECTION NAME
</p>
```

#### Bottom Sheet Dialog

For pickers, tool picker, and confirmations that slide up from bottom:
```tsx
<Dialog.Popup className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#16213e] rounded-t-3xl px-5 pt-5 pb-8 transition-all duration-300 data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full">
  <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />
  ...
</Dialog.Popup>
```

#### Dark Mode Tokens

| Element      | Light               | Dark                   |
|-------------|----------------------|------------------------|
| Page bg     | `bg-gray-50`         | `bg-[#1a1a2e]`        |
| Card bg     | `bg-white`           | `bg-[#16213e]`        |
| Card border | `border-gray-200`    | `border-gray-700/60`  |
| Text primary| `text-gray-800`      | `text-white`           |
| Text muted  | `text-gray-400`      | `text-gray-500`        |
| Input bg    | `bg-gray-100`        | `bg-gray-800`          |

### Dock ([src/components/Dock.tsx](src/components/Dock.tsx))

Floating bottom nav with frosted glass styling.

**Structure**: Nav items defined in [src/config/navigation.ts](src/config/navigation.ts). Each item has:
- `to`: Route path
- `label`: Display text
- `Icon`: Nucleo Glass icon component

**Customization**: Add/remove items in `navItems` array. Keep 2-4 items for optimal UX. Default items: Home, Settings.

**Swipe gesture** ([src/hooks/useDockGesture.ts](src/hooks/useDockGesture.ts)): Horizontal swipe shifts focus with spring scale animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`) and haptic feedback. Gesture activates only on horizontal movement >8px.

**Icon theming**: Nucleo glass icons use `--nc-gradient-1-color-1` / `--nc-gradient-1-color-2` CSS variables (set via `--dock-accent-1`/`--dock-accent-2`) for theme-aware gradients.

### Tools System

Tools are defined in [src/config/tools.tsx](src/config/tools.tsx). Each tool card includes:
- `id`: Unique identifier
- `title`: Display name
- `description`: Short description
- `icon`: React icon component
- `path`: Route path
- `available`: Whether enabled (shows "Coming Soon" badge if false)

Default tools: Timer, Notes. Add your own by following the same pattern.

### PWA Configuration

Configured in [vite.config.ts](vite.config.ts):
- Display mode: `standalone` (full-screen like native app)
- Register type: `prompt` (user chooses when to update)
- Theme color: `#58CC02` (duo-green)
- Orientation: `portrait`
- Workbox: Caches all JS, CSS, HTML, images, and SVGs

Safe area insets are handled via CSS env variables (`--safe-area-top`, `--safe-area-bottom`) in [src/index.css](src/index.css).

Custom Tailwind variant `pwa:` targets `@media (display-mode: standalone)` for PWA-specific styles.

### Testing

- **Unit tests**: Vitest + Testing Library for components and utilities
- **E2E tests**: Playwright for end-to-end flows
- **Coverage**: Configured to track `src/lib/**/*.ts`, `src/components/**/*.tsx`, `src/pages/**/*.tsx`
- **Setup**: Test config in [src/test/setup.ts](src/test/setup.ts), includes fake-indexeddb for Dexie testing

### Dev Tools

- **Agentation** (`import.meta.env.DEV` only): Live state inspector with Zustand/Jotai support
- **Liveline** (optional): Network monitor overlay for debugging API calls
- **Commit hash**: Exposed via `__COMMIT_HASH__` global for versioning

## Best Practices

1. **Always use Context7 MCP** (`resolve-library-id` → `query-docs`) when needing library/API documentation — ensures up-to-date docs instead of training data
2. **Read example files first** — `src/lib/db.example.ts` and `src/lib/settings.example.ts` demonstrate patterns
3. **Follow immutability** — Never mutate state, always create new objects
4. **Test coverage** — Aim for 80%+ on new code
5. **Flat color fills** — No shadows, use borders for contrast
6. **Explicit extensions** — Always use `.ts`/`.tsx` in imports
