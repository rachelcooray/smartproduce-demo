import { useEffect } from 'react'
import { getVarieties, ALL_PRODUCE } from '../data/produce'

function BackButton({ onRetry }) {
  return (
    <button onClick={onRetry}
      className="flex items-center gap-1 text-gray-400 text-sm px-4 pt-4 pb-2 w-fit hover:text-keells-green transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Retake
    </button>
  )
}

export default function ResultScreen({ result, onConfirm, onRetry }) {
  const varieties  = getVarieties(result.category, result.has_varieties)
  const label      = result.category ?? 'Unknown'
  const confidence = result.confidence ?? 0

  // Auto-advance when no variety selection needed
  useEffect(() => {
    if (!result.category || varieties) return
    const t = setTimeout(() => onConfirm({ category: result.category, variety: null }), 1500)
    return () => clearTimeout(t)
  }, [result, varieties]) // eslint-disable-line react-hooks/exhaustive-deps

  // Non-grocery item scanned
  if (result.is_produce === false) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-white fade-in">
        <div className="text-5xl">🛒</div>
        <p className="text-gray-800 font-bold text-xl text-center">Groceries only</p>
        <p className="text-gray-400 text-sm text-center">Please place a fruit or vegetable under the scanner.</p>
        <button onClick={onRetry}
          className="bg-keells-green text-white font-semibold rounded-2xl py-3 px-10 active:scale-95 transition-transform shadow">
          Try Again
        </button>
      </div>
    )
  }

  // Produce detected but couldn't identify — show full fallback list
  if (!result.category) {
    return (
      <div className="flex-1 flex flex-col bg-white fade-in overflow-y-auto">
        <BackButton onRetry={onRetry} />
        <div className="px-5 pt-1 pb-3">
          <h2 className="text-2xl font-extrabold text-gray-900">Select item manually</h2>
          <p className="text-gray-400 text-sm mt-1">Couldn't identify — tap the item below to continue.</p>
          {result.error && (
            <p className="text-red-400 text-xs font-mono bg-red-50 rounded-lg px-3 py-2 mt-2 break-words">
              {result.error}
            </p>
          )}
        </div>
        <div className="px-4 pb-8">
          <div className="grid grid-cols-2 gap-2">
            {ALL_PRODUCE.map(item => (
              <button key={item}
                onClick={() => onConfirm({ category: item, variety: null })}
                className="bg-white border-2 border-gray-200 rounded-2xl py-4 px-3
                           text-gray-800 font-semibold text-sm text-center leading-tight
                           active:scale-95 active:bg-keells-green active:text-white
                           active:border-keells-green hover:border-keells-green transition-all shadow-sm">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Successfully identified
  return (
    <div className="flex-1 flex flex-col bg-white fade-in overflow-y-auto">
      <BackButton onRetry={onRetry} />

      <div className="px-5 pt-1 pb-4">
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">{label}</h2>
        <p className="text-keells-green text-sm font-semibold mt-1">{confidence}% match</p>
      </div>

      {varieties ? (
        <div className="px-4 pb-8">
          <p className="text-gray-500 text-sm font-medium mb-3">Select variety to print label</p>
          <div className="grid grid-cols-2 gap-3">
            {varieties.map(v => (
              <button key={v}
                onClick={() => onConfirm({ category: result.category, variety: v })}
                className="bg-white border-2 border-gray-200 rounded-2xl py-5 px-3
                           text-gray-800 font-semibold text-base text-center leading-tight
                           min-h-[60px] active:scale-95 active:bg-keells-green active:text-white
                           active:border-keells-green hover:border-keells-green transition-all shadow-sm">
                {v}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-5 flex items-center gap-2 text-gray-400 text-sm py-6">
          <div className="w-4 h-4 border-2 border-keells-green border-t-transparent rounded-full animate-spin" />
          Preparing label…
        </div>
      )}
    </div>
  )
}
