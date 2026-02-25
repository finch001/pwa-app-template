import { useNavigate } from 'react-router-dom'
import { tools } from '../config/tools.tsx'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="pb-4">
      {/* Hero Banner — full bleed */}
      <div className="bg-gradient-to-b from-duo-green/15 to-transparent dark:from-duo-green/10 dark:to-transparent pb-10" style={{ paddingTop: 'calc(var(--safe-area-top) + 2rem)' }}>
        <div className="flex flex-col items-center max-w-lg mx-auto px-4">
          <div className="w-20 h-20 mb-3 rounded-full overflow-hidden ring-4 ring-duo-green/20 dark:ring-duo-green/15 animate-float">
            <img
              src="/mascot.png"
              alt="App Logo"
              className="w-full h-full object-cover scale-135"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            PWA Template
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            A modern React PWA starter
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* Tool Cards Grid */}
        <div className="mb-6">
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            TOOLS
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => tool.available && navigate(tool.path)}
                className={`rounded-2xl py-5 px-4 min-h-[7.5rem] flex flex-col items-center justify-center text-center transition-all duration-150 ${
                  tool.available
                    ? 'bg-white dark:bg-[#16213e] border border-gray-200 dark:border-gray-700/60 active:scale-[0.96]'
                    : 'bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 opacity-40'
                }`}
              >
                {!tool.available && (
                  <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full mb-1">
                    Coming Soon
                  </span>
                )}
                <div className="mb-2">{tool.icon}</div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  {tool.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
