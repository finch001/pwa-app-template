/**
 * Tools Configuration
 *
 * Defines the tool cards displayed on the Home page grid.
 * These are example tools to demonstrate the pattern — replace with your own.
 *
 * Each tool card includes:
 * - id: Unique identifier
 * - title: Display name
 * - description: Short description
 * - icon: React icon component (Lucide or custom)
 * - path: Route path
 * - available: Whether the tool is enabled (shows "Coming Soon" badge if false)
 */

import { Timer, NotebookPen } from "lucide-react"

export interface ToolCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  available: boolean
}

export const tools: ToolCard[] = [
  {
    id: "timer",
    title: "Timer",
    description: "Simple countdown timer",
    icon: <Timer size={32} className="text-duo-blue" />,
    path: "/tools/timer",
    available: true,
  },
  {
    id: "notes",
    title: "Notes",
    description: "Quick note-taking",
    icon: <NotebookPen size={32} className="text-duo-purple" />,
    path: "/tools/notes",
    available: true,
  },
]
