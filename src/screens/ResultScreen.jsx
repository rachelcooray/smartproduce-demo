import { useState } from 'react'
import { getVarieties } from '../data/produce'

export default function ResultScreen({ capturedImage, result, onConfirm, onRetry }) {
  const varieties = getVarieties(result.category)
  const [selectedVariety, setSelectedVariety] = useState(varieties ? null : 'none')

  const confidence = Math.round((result.confidence ?? 0) * 100)
  const categoryLabel = result.category
    ? result.category.charAt(0).toUpperCase() + result.category.slice(1)
    : 'Unknown'

  const canConfirm = selectedVariety !== null

  function handleConfirm() {
    onConfirm({
      category: result.category,
      categoryLabel,
      variety: selectedVariety === 'none' ? null : selectedVariety,
      confidence,
    })
  }

  return (
    <div className="flex flex-col h-full fade-in overflow-y-auto">
      {/* Captured image — smaller */}
      <div className="relative bg-black h-44 overflow-hidden flex-shrink-0">
        <img
          src={capturedImage}
          alt="Identified produce"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-white text-xs bg-keells-green/80 rounded-full px-3 py-0.5 font-medium">
            Captured image
          </span>
        </div>
      </div>

      {/* Result card */}
      <div className="flex-1 bg-white px-4 pt-5 pb-6 flex flex-col gap-4">

        {!result.identified ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="text-5xl">🤔</div>
            <p className="text-gray-700 font-semibold text-lg">No produce detected</p>
            <p className="text-gray-400 text-sm text-center">
              {result.notes || 'Please make sure the produce is clearly visible and try again.'}
            </p>
            <button
              onClick={onRetry}
              className="mt-2 bg-keells-green text-white font-semibold rounded-2xl py-3 px-8
                         active:scale-95 transition-transform"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Produce name + confidence */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{categoryLabel}</h2>
              {result.notes && (
                <p className="text-gray-400 text-sm mt-0.5">{result.notes}</p>
              )}
              {/* Confidence bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Confidence</span>
                  <span className="font-semibold text-keells-green">{confidence}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-keells-green rounded-full transition-all duration-700"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Variety selection */}
            {varieties && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Select variety</p>
                <div className="flex flex-wrap gap-2">
                  {varieties.map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariety(v)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                        ${selectedVariety === v
                          ? 'bg-keells-green text-white border-keells-green shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-keells-green'
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="w-full bg-keells-green text-white font-semibold text-base rounded-2xl py-4
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 transition-transform shadow-md hover:bg-keells-light"
              >
                {varieties && !selectedVariety ? 'Select a variety to continue' : 'Confirm'}
              </button>
              <button
                onClick={onRetry}
                className="w-full text-gray-500 font-medium text-sm py-2 hover:text-keells-green transition-colors"
              >
                Retake photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
