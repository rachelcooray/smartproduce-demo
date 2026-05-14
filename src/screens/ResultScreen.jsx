import { useEffect } from 'react'
import { getVarieties } from '../data/produce'

export default function ResultScreen({ result, onConfirm, onRetry }) {
  const varieties = getVarieties(result.category)
  const confidence = Math.round((result.confidence ?? 0) * 100)
  const categoryLabel = result.category
    ? result.category.charAt(0).toUpperCase() + result.category.slice(1)
    : 'Unknown'

  // Screen 3B — no varieties: auto-advance after 1.5s
  useEffect(() => {
    if (!result.identified || varieties) return
    const t = setTimeout(() => onConfirm({ category: result.category, categoryLabel, variety: null, confidence }), 1500)
    return () => clearTimeout(t)
  }, [result, varieties]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!result.identified) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 fade-in bg-white">
        <div className="text-6xl">🤔</div>
        <p className="text-gray-800 font-bold text-xl">No produce detected</p>
        <p className="text-gray-400 text-sm text-center">
          {result.notes || 'Make sure the produce is clearly visible.'}
        </p>
        <button
          onClick={onRetry}
          className="mt-2 bg-keells-green text-white font-semibold rounded-2xl py-3 px-10
                     active:scale-95 transition-transform shadow"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white fade-in overflow-y-auto">

      {/* Back button */}
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 text-gray-400 text-sm px-4 pt-4 pb-1 w-fit hover:text-keells-green transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retake
      </button>

      {/* Produce name + confidence */}
      <div className="px-5 pt-2 pb-4">
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">{categoryLabel}</h2>
        <p className="text-keells-green text-sm font-semibold mt-1">{confidence}% match</p>
      </div>

      {varieties ? (
        /* Screen 3A — variety grid, tap = immediate advance */
        <div className="px-4 pb-6">
          <p className="text-gray-500 text-sm font-medium mb-3">Select variety to print label</p>
          <div className="grid grid-cols-2 gap-3">
            {varieties.map(v => (
              <button
                key={v}
                onClick={() => onConfirm({ category: result.category, categoryLabel, variety: v, confidence })}
                className="bg-gray-50 border-2 border-gray-200 rounded-2xl py-5 px-3
                           text-gray-800 font-semibold text-base text-center
                           active:scale-95 active:bg-keells-green active:text-white active:border-keells-green
                           hover:border-keells-green transition-all shadow-sm"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Screen 3B — no variety, show auto-advancing indicator */
        <div className="px-5 flex flex-col items-center gap-3 py-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-keells-green border-t-transparent rounded-full animate-spin" />
            Printing label…
          </div>
        </div>
      )}
    </div>
  )
}
