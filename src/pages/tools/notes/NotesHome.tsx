/**
 * Notes Tool — Example tool implementation
 *
 * This is a simple note-taking app to demonstrate:
 * - localStorage persistence
 * - List rendering
 * - Basic CRUD operations
 *
 * Replace with your own tool logic.
 */

import { useState, useEffect } from 'react'
import StickyHeader from '../../../components/StickyHeader.tsx'
import { IconNoteOutlineDuo18 } from "nucleo-ui-outline-duo-18"
import { sileo } from "sileo"

interface Note {
  id: string
  content: string
  createdAt: number
}

const NOTES_KEY = 'app-notes'

function loadNotes(): Note[] {
  const raw = localStorage.getItem(NOTES_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

export default function NotesHome() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const [newNoteContent, setNewNoteContent] = useState('')

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return

    const newNote: Note = {
      id: crypto.randomUUID(),
      content: newNoteContent.trim(),
      createdAt: Date.now(),
    }

    setNotes(prev => [newNote, ...prev])
    setNewNoteContent('')
    sileo.success({ title: 'Note saved' })
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    sileo.info({ title: 'Note deleted' })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="max-w-lg mx-auto pb-4">
      <StickyHeader>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white text-center">
          Notes
        </h1>
      </StickyHeader>

      <div className="px-4">
        {/* Add Note Input */}
        <div className="mb-6">
          <div className="bg-white dark:bg-[#16213e] rounded-2xl p-4 border border-gray-200 dark:border-gray-700/60">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAddNote()
                }
              }}
              placeholder="Write a note... (Cmd/Ctrl+Enter to save)"
              className="w-full bg-transparent text-gray-800 dark:text-white text-sm resize-none outline-none min-h-[80px]"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="px-4 py-2 bg-duo-purple text-white font-bold text-sm rounded-xl active:scale-95 transition-transform disabled:opacity-40 disabled:scale-100"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        {notes.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              YOUR NOTES ({notes.length})
            </p>
            {notes.map(note => (
              <div
                key={note.id}
                className="bg-white dark:bg-[#16213e] rounded-2xl p-4 border border-gray-200 dark:border-gray-700/60"
              >
                <div className="flex items-start gap-3">
                  <IconNoteOutlineDuo18 size={20} className="text-duo-purple mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-white whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-duo-red transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <IconNoteOutlineDuo18 size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
              No notes yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Add your first note above
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
