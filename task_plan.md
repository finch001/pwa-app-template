# Task Plan: BabyCare → Generic App Architecture

## Overview

Transform the BabyCare application into a reusable app architecture template by removing all business logic while preserving the technical infrastructure. The goal is to extract a clean, production-ready PWA foundation with:

- Duolingo-inspired design system (flat colors, no shadows, bold typography)
- React 19 + TypeScript 5.9 + Vite 7 + Tailwind 4
- PWA capabilities (offline-first, installable, safe area handling)
- Floating dock navigation with gesture support
- Dark mode with CSS variables
- Local data management patterns (Dexie.js + localStorage)
- Headless UI components (@base-ui/react)

**Complexity**: 33 files total (15 keep as-is, 9 delete, 9 modify)

---

## Phases

### Phase 1: Clean Deletion of Pure Business Logic
**Status**: 🔵 Not Started

**Goals**:
- [ ] Delete `src/lib/db.ts` (baby data models: KickSession, ContractionSession, FeedingRecord, HospitalBagItem)
- [ ] Delete `src/lib/tips.ts` (25 Chinese pregnancy tips)
- [ ] Delete `src/lib/encouragements.ts` (10 Chinese encouragement messages)
- [ ] Delete `src/lib/feeding-helpers.ts` (feeding-specific logic with Chinese labels)
- [ ] Delete `src/lib/hospital-bag-presets.ts` (30 hospital bag items in Chinese)
- [ ] Delete `src/pages/tools/kick-counter/` directory (entire feature: KickHome, KickSession, tests)
- [ ] Delete `src/pages/tools/contraction-timer/` directory (entire feature)
- [ ] Delete `src/pages/tools/hospital-bag/` directory (entire feature)
- [ ] Delete `src/pages/tools/feeding-log/` directory (entire feature: 4 files)

**Dependencies**: None

**Risks**:
- Import errors in hybrid files that reference deleted modules
- Build will fail after this phase until Phase 2 cleanup

**Validation**:
```bash
# After this phase, these directories should not exist:
! test -d src/pages/tools/kick-counter
! test -d src/pages/tools/contraction-timer
! test -d src/pages/tools/hospital-bag
! test -d src/pages/tools/feeding-log
```

---

### Phase 2: Modify Hybrid Files - Remove Business Logic
**Status**: 🔵 Not Started

**Goals**:
- [ ] **`src/lib/settings.ts`**: Remove `goalCount`, `mergeWindowMinutes`, `dueDate`, `getDaysUntilDue()`, `getWeeksPregnant()` — keep `colorMode` only
- [ ] **`src/lib/tools.tsx`**: Delete entire file (or convert to empty array + keep ToolCard interface for reference)
- [ ] **`src/components/TipBanner.tsx`**: Remove `getRandomTip()` import and tip display logic, convert to generic banner or delete
- [ ] **`src/components/Dock.tsx`**: Remove Chinese labels ("首页", "记录", "设置"), remove tool picker dialog, convert nav items to generic placeholders or parameterize
- [ ] **`src/pages/Home.tsx`**: Remove all baby content (greeting, pregnancy stats, kick count, feeding time), keep hero banner + grid structure with placeholder content
- [ ] **`src/pages/History.tsx`**: Remove baby tabs (胎动, 宫缩, 喂奶), remove chart/timeline logic, keep tab UI pattern with placeholder
- [ ] **`src/pages/Settings.tsx`**: Remove kick counter settings, due date picker, goal count, merge window toggle, feeding/bag data export — keep color mode toggle and PWA update check only
- [ ] **`src/pages/history-helpers.ts`**: Delete or parameterize `getTimeline()` and `getChartPoints()` to be label-agnostic

**Dependencies**: Phase 1 (deletion must happen first to avoid import errors)

**Risks**:
- Need to ensure no dangling imports from deleted files
- TypeScript errors if imports not cleaned up
- Routing errors if tool paths still referenced in App.tsx

**Validation**:
```bash
pnpm build  # Should succeed with no TypeScript errors
```

---

### Phase 3: Clean Up Routing & Remove Tool References
**Status**: 🔵 Not Started

**Goals**:
- [ ] **`src/App.tsx`**: Remove all tool routes (`/tools/kick-counter`, `/tools/contraction-timer`, `/tools/hospital-bag`, `/tools/feeding-log`)
- [ ] Keep routing structure (Layout routes vs full-screen routes) as pattern example
- [ ] Add comment documenting the routing pattern
- [ ] Remove `/tools` directory if empty (or keep as placeholder for future tools)

**Dependencies**: Phase 2 (Dock and Home must be cleaned up first to avoid broken navigation)

**Risks**:
- None - this is purely cleanup

**Validation**:
```bash
# Should have only 3 main routes left:
# /, /history (or remove), /settings
pnpm dev  # Navigate to / and verify no broken links
```

---

### Phase 4: Update Documentation & Create Generic Data Layer
**Status**: 🔵 Not Started

**Goals**:
- [ ] **`CLAUDE.md`**: Rewrite to document the generic architecture (remove all baby-specific sections)
- [ ] **`README.md`**: Update to describe the architecture template (not a baby app)
- [ ] **Create `src/lib/db.example.ts`**: Demonstrate Dexie.js pattern with generic example entities (e.g., `Task`, `Note`)
- [ ] **Create `src/lib/settings.example.ts`**: Document the settings pattern with generic example fields
- [ ] **Update `package.json`**: Change `name` to `pwa-app-template` or similar, update `description`

**Dependencies**: Phase 3 (all code cleanup must be complete)

**Risks**:
- None - documentation only

**Validation**:
- [ ] CLAUDE.md has no mentions of "baby", "pregnancy", "kick", "contraction", "feeding", "hospital bag"
- [ ] README clearly states this is an architecture template
- [ ] Example files demonstrate patterns clearly

---

### Phase 5: Final Verification & Template Preparation
**Status**: 🔵 Not Started

**Goals**:
- [ ] Run full build: `pnpm build`
- [ ] Run tests: `pnpm test` (if any tests remain)
- [ ] Run linter: `pnpm lint`
- [ ] Test PWA functionality: `pnpm preview` and install as PWA
- [ ] Verify dark mode toggle works
- [ ] Verify safe area insets work on PWA
- [ ] Check all remaining pages (/, /settings) render without errors
- [ ] Remove babycare-related assets (if any custom images/icons exist)
- [ ] Create `.env.example` if needed
- [ ] Add template usage instructions to README

**Dependencies**: Phase 4 (documentation must be updated)

**Risks**:
- Potential runtime errors if cleanup wasn't thorough
- CSS references to removed components

**Validation**:
```bash
pnpm build && pnpm preview
# Open http://localhost:4173
# Test: dark mode toggle, navigation, PWA install
```

---

## Decisions Log

### Decision 1: Keep or Remove History Page
**Date**: 2026-02-25 ✅ **DECIDED**

**Context**: The History page (`src/pages/History.tsx`) is entirely built around baby data (kick logs, contraction logs, feeding logs). Without business logic, it has no content to display.

**Options Considered**:
1. **Delete entirely** - Remove the page and `/history` route
   - Pros: Clean slate, no confusing empty page
   - Cons: Loses the tab + chart UI patterns as reference
2. **Keep with placeholder content** - Convert to generic "Activity Log" or "Records" page with placeholder tabs
   - Pros: Preserves UI patterns (tab system, chart component, collapsible groups)
   - Cons: Requires creating generic dummy data or placeholder UI
3. **Keep as example file** - Rename to `History.example.tsx` and remove from routing
   - Pros: Documents the pattern without requiring functional implementation
   - Cons: Not immediately usable in the template

**Decision**: **Option 1 — Delete entirely**

**Rationale**: Clean slate approach preferred. Tab + chart UI patterns can be implemented when needed. Keeps template minimal and focused.

---

### Decision 2: Dock Navigation Items
**Date**: 2026-02-25 ✅ **DECIDED**

**Context**: Current Dock has 3 hardcoded nav items with Chinese labels ("首页", "记录", "设置"). For a generic template, these need to be either removed, parameterized, or replaced with English placeholders.

**Options Considered**:
1. **English placeholders** - Replace with "Home", "Activity", "Settings"
   - Pros: Immediately functional, demonstrates the pattern
   - Cons: Still hardcoded, not truly generic
2. **Parameterize via config** - Create `src/config/navigation.ts` with nav items array
   - Pros: More flexible, easier to customize
   - Cons: Adds abstraction layer for simple use case
3. **Remove all but Home/Settings** - Delete the middle "记录" (History) nav item
   - Pros: Minimal viable navigation
   - Cons: Only 2 items doesn't showcase the gesture system well

**Decision**: **Option 2 — Parameterize via config**

**Rationale**: Best balance of flexibility and demonstration. Created [src/config/navigation.ts](src/config/navigation.ts) with "Home" and "Settings" items (2 items since History was deleted). Easy to customize, well-documented pattern.

---

### Decision 3: Tool System - Keep or Remove
**Date**: 2026-02-25 ✅ **DECIDED**

**Context**: `src/lib/tools.tsx` defines a tool card system with dynamic ordering. The action button in Dock opens a tool picker. All current tools are baby-specific.

**Options Considered**:
1. **Delete entirely** - Remove tool system, remove action button from Dock
   - Pros: Clean, no orphaned patterns
   - Cons: Loses the tool card pattern and picker UI
2. **Keep as empty framework** - Keep ToolCard interface, empty `allTools` array, and Dock action button disabled/hidden
   - Pros: Pattern preserved for reference
   - Cons: Non-functional UI element (action button does nothing)
3. **Add 1-2 generic example tools** - Create dummy tools like "Timer" or "Notes" with placeholder pages
   - Pros: Demonstrates the full pattern end-to-end
   - Cons: Requires implementing generic tool pages (extra work)

**Decision**: **Option 3 — Add 1-2 generic example tools**

**Rationale**: Best demonstrates the full pattern. Created [src/config/tools.tsx](src/config/tools.tsx) with Timer and Notes tools. Implemented working examples in [src/pages/tools/timer/TimerHome.tsx](src/pages/tools/timer/TimerHome.tsx) and [src/pages/tools/notes/NotesHome.tsx](src/pages/tools/notes/NotesHome.tsx). Shows tool card grid pattern, routing, and Duolingo-style UI. Removed Dock action button (tool picker) since it was specific to dynamic ordering—tools now shown on home page grid only.

---

## Notes

### Key Preservation Targets (8 Patterns)

1. **Routing Pattern** - Layout wrapping with Outlet vs full-screen routes
2. **Database Pattern** - Dexie.js with versioned schemas + EntityTable types
3. **Settings Pattern** - localStorage with JSON serialization + type-safe getters/setters
4. **Gesture Pattern** - Pointer events state machine with spring animations + haptics
5. **Dark Mode Pattern** - CSS class toggle + CSS variables
6. **PWA Pattern** - Workbox caching + safe area insets + standalone display mode
7. **Tool System Pattern** - Tool cards grid with availability gating + dynamic ordering
8. **Design System** - Duo color palette, no shadows, bold typography, flat borders

### Chinese Content Removal Checklist

After completion, search codebase for any remaining Chinese strings:
```bash
rg "[\u4e00-\u9fff]" src/  # Should return 0 results
```

### Post-Cleanup File Count

- **Architecture (keep)**: ~15 files
- **Hybrid (modified)**: ~9 files
- **Business (deleted)**: ~9 files + 4 directories

**Expected final count**: ~24-25 files in `src/` (down from 33)

### Template Branding

After cleanup, rename project:
- Package name: `pwa-app-template` or `react-pwa-starter`
- App title: "PWA Template" or "React PWA Starter"
- Manifest: Update name, short_name, description

---
