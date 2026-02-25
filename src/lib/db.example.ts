/**
 * Database Pattern Example — Dexie.js with TypeScript
 *
 * This file demonstrates the Dexie.js database pattern used in this template.
 * Dexie is a minimalistic wrapper for IndexedDB with TypeScript support.
 *
 * Key Concepts:
 * 1. EntityTable<T, PK> — Type-safe table with auto-incrementing or manual IDs
 * 2. Schema versioning — Use db.version(N).stores({ ... }) for each schema change
 * 3. Incremental migrations — Add new version() calls, never modify old ones
 *
 * @see https://dexie.org/docs/Tutorial/Design
 */

import Dexie, { type EntityTable } from 'dexie'

// ==================== Example 1: Task Management ====================

/**
 * Task entity — represents a single task
 */
export interface Task {
  id: string // Use crypto.randomUUID() for manual IDs
  title: string
  description: string
  completed: boolean
  createdAt: number // Timestamp in milliseconds (Date.now())
  updatedAt: number
}

/**
 * Note entity — represents a simple note
 */
export interface Note {
  id: string
  content: string
  tags: string[] // Array fields are supported
  createdAt: number
}

/**
 * Example database class with two tables
 */
class ExampleDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  notes!: EntityTable<Note, 'id'>

  constructor() {
    super('ExampleDatabase') // Database name (used in IndexedDB)

    // Version 1: Initial schema
    this.version(1).stores({
      tasks: 'id, createdAt, completed', // Primary key + indexed fields
      notes: 'id, createdAt', // Tags are not indexed (array fields rarely need indexes)
    })

    // Version 2: Add a new index (example of migration)
    // this.version(2).stores({
    //   tasks: 'id, createdAt, completed, updatedAt', // Add updatedAt index
    // })

    // Version 3: Add a new table (example)
    // this.version(3).stores({
    //   categories: 'id, name',
    // })
  }
}

// Export singleton instance
export const exampleDb = new ExampleDatabase()

// ==================== Usage Examples ====================

/**
 * Example: Create a new task
 */
export async function createTask(title: string, description: string): Promise<Task> {
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await exampleDb.tasks.add(task)
  return task
}

/**
 * Example: Get all incomplete tasks, sorted by creation date (newest first)
 */
export async function getIncompleteTasks(): Promise<Task[]> {
  return exampleDb.tasks
    .where('completed')
    .equals(0) // In IndexedDB, false is stored as 0
    .reverse() // Reverse the order (newest first)
    .sortBy('createdAt')
}

/**
 * Example: Mark a task as complete
 */
export async function completeTask(id: string): Promise<void> {
  await exampleDb.tasks.update(id, {
    completed: true,
    updatedAt: Date.now(),
  })
}

/**
 * Example: Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  await exampleDb.tasks.delete(id)
}

/**
 * Example: Full-text search in notes (case-insensitive)
 * Note: Dexie doesn't have built-in full-text search, so we filter in memory
 */
export async function searchNotes(query: string): Promise<Note[]> {
  const allNotes = await exampleDb.notes.toArray()
  const lowerQuery = query.toLowerCase()
  return allNotes.filter(note =>
    note.content.toLowerCase().includes(lowerQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

// ==================== Best Practices ====================

/**
 * 1. Always use manual IDs (crypto.randomUUID()) for offline-first apps
 *    - Avoids ID conflicts when syncing data across devices
 *    - Makes it easy to reference entities before they're saved
 *
 * 2. Use timestamps (Date.now()) instead of Date objects
 *    - IndexedDB stores Date objects as numbers anyway
 *    - Easier to work with for sorting and filtering
 *
 * 3. Index only fields you'll query by
 *    - Primary key is always indexed
 *    - Add indexes for fields used in .where() queries
 *    - Don't over-index — it slows down writes
 *
 * 4. Use incremental versioning for schema changes
 *    - Never modify existing version() calls
 *    - Always add a new version(N+1) for migrations
 *    - Dexie handles migrations automatically
 *
 * 5. Keep entities flat when possible
 *    - Nested objects work but are harder to index
 *    - Use separate tables for relationships (normalize)
 *
 * 6. Transaction safety
 *    - Dexie auto-wraps operations in transactions
 *    - Use db.transaction('rw', [tables], async () => { ... }) for multi-table updates
 */
