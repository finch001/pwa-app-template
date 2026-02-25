/**
 * Navigation Configuration
 *
 * Defines the navigation items shown in the Dock (floating bottom nav bar).
 * Each item requires:
 * - to: Route path
 * - label: Display text
 * - Icon: Nucleo Glass icon component
 *
 * Customization:
 * 1. Add/remove items from the navItems array
 * 2. Import icons from 'nucleo-glass' package
 * 3. Ensure routes exist in App.tsx
 * 4. Keep 2-4 items for optimal gesture system UX
 */

import { IconHouse } from "nucleo-glass"
import { IconGear } from "nucleo-glass"

export interface NavItem {
  to: string
  label: string
  Icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>
}

export const navItems: NavItem[] = [
  { to: "/", label: "Home", Icon: IconHouse },
  { to: "/settings", label: "Settings", Icon: IconGear },
]
