import { useState } from 'react'
import { ALL_PRODUCE } from '../data/produce'

export default function ManualPickScreen({ onSelect, onRetry }) {
  const [search, setSearch] = useState('')

  const filtered = ALL_PRODUCE.filter(p =>
    p.toLowerCase().includes(search.toLowerCase())
  )

  function handleSelect(name) {
    onSelect({
      category: name.toLowerCase(),
      categoryLabel: name,
      variety: null,
      confidence: null,
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-white fade-in overflow-hidden">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-800 font-bold text-base">Select produce manually</p>
            <p className="text-gray-400 text-xs mt-0.5">Camera couldn't identify — tap your item</p>
          </div>
          <button
            onClick={onRetry}
            className="text-keells-green text-sm font-semibold"
          >
            Retry
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search produce…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:border-keells-green focus:ring-1 focus:ring-keells-green"
            autoFocus
          />
        </div>
      </div>

      {/* Produce grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No matches for "{search}"</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filtered.map(name => (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-4 px-2
                           text-gray-800 font-medium text-sm text-center leading-tight
                           active:scale-95 active:bg-keells-green active:text-white active:border-keells-green
                           hover:border-keells-green transition-all"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
