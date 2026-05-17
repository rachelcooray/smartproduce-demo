import { useState } from 'react'

export default function DebugLog({ entries, onClear }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative z-50">
      {/* Toggle pill */}
      <div className="flex justify-center py-1 bg-gray-50 border-b border-gray-100">
        <button
          onClick={() => setOpen(o => !o)}
          className="text-xs font-mono text-gray-400 px-3 py-0.5 rounded-full hover:bg-gray-200 transition-colors"
        >
          {open ? '▲ hide debug' : `▼ debug log (${entries.length})`}
        </button>
        {open && entries.length > 0 && (
          <button onClick={onClear} className="text-xs text-red-300 px-2 hover:text-red-500 transition-colors">
            clear
          </button>
        )}
      </div>

      {open && (
        <div className="bg-gray-950 text-green-400 font-mono text-xs overflow-y-auto max-h-52 px-3 py-2 space-y-3">
          {entries.length === 0 && (
            <p className="text-gray-600">No scans yet.</p>
          )}
          {entries.map((e, i) => (
            <div key={i} className="border-b border-gray-800 pb-2">
              <div className="text-gray-500 mb-1">
                {e.time} · <span className={e.model === 'onnx' ? 'text-green-400' : 'text-yellow-400'}>{e.model}</span>
                {' → '}
                <span className="text-white font-bold">{e.category ?? 'none'}</span>
                {' '}
                <span className="text-green-300">{e.confidence != null ? `${e.confidence}%` : ''}</span>
              </div>
              <div className="space-y-0.5">
                {e.top.map((t, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="w-24 truncate text-gray-300">{t.label}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${j === 0 ? 'bg-green-400' : 'bg-gray-500'}`}
                        style={{ width: `${t.pct}%` }}
                      />
                    </div>
                    <span className={`w-8 text-right ${j === 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      {t.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
