/**
 * Timer Tool — Example tool implementation
 *
 * This is a simple countdown timer to demonstrate the tool pattern.
 * Replace with your own tool logic.
 */

import { useState, useEffect } from 'react'
import StickyHeader from '../../../components/StickyHeader.tsx'
import { Timer } from "lucide-react"
import { sileo } from "sileo"

export default function TimerHome() {
  const [duration, setDuration] = useState(60) // seconds
  const [remaining, setRemaining] = useState(60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || remaining <= 0) return

    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          sileo.success({ title: "Time's up!" })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, remaining])

  const handleStart = () => {
    if (remaining === 0) {
      setRemaining(duration)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setRemaining(duration)
  }

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div className="max-w-lg mx-auto pb-4">
      <StickyHeader>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white text-center">
          Timer
        </h1>
      </StickyHeader>

      <div className="px-4">
        {/* Timer Display */}
        <div className="mb-6">
          <div className="bg-white dark:bg-[#16213e] rounded-3xl p-8 border border-gray-200 dark:border-gray-700/60">
            <div className="flex items-center justify-center mb-6">
              <Timer size={48} className="text-duo-blue" />
            </div>
            <div className="text-center">
              <p className="text-6xl font-extrabold text-gray-800 dark:text-white">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                {isRunning ? 'Running...' : remaining === 0 ? 'Finished' : 'Paused'}
              </p>
            </div>
          </div>
        </div>

        {/* Duration Selector */}
        {!isRunning && remaining === duration && (
          <div className="mb-6">
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              DURATION
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[30, 60, 120, 300, 600, 900].map(sec => (
                <button
                  key={sec}
                  onClick={() => {
                    setDuration(sec)
                    setRemaining(sec)
                  }}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    duration === sec
                      ? 'bg-duo-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 py-4 bg-duo-green text-white font-bold text-lg rounded-2xl active:scale-95 transition-transform"
            >
              {remaining === duration ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 py-4 bg-duo-orange text-white font-bold text-lg rounded-2xl active:scale-95 transition-transform"
            >
              Pause
            </button>
          )}
          {remaining !== duration && (
            <button
              onClick={handleReset}
              className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-lg rounded-2xl active:scale-95 transition-transform"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
