import { useState } from 'react'
import { getPricePerKg, calcPrice } from '../data/produce'

export default function WeightScreen({ produce, onPrint }) {
  const [weight, setWeight] = useState(250)
  const pricePerKg = getPricePerKg(produce.category)
  const totalPrice = calcPrice(weight, pricePerKg)

  const label = produce.variety
    ? `${produce.categoryLabel} — ${produce.variety}`
    : produce.categoryLabel

  return (
    <div className="flex flex-col h-full fade-in">
      <div className="flex-1 bg-white px-4 pt-6 pb-4 flex flex-col gap-6 overflow-y-auto">

        {/* Confirmed item */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <div className="w-8 h-8 bg-keells-green rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Confirmed item</p>
            <p className="font-semibold text-gray-800">{label}</p>
          </div>
        </div>

        {/* Weight slider */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-sm font-semibold text-gray-700">Weight</span>
            <span className="text-2xl font-bold text-gray-900">{weight}g</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={5}
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer
                       [&::-webkit-slider-runnable-track]:bg-gray-200
                       [&::-webkit-slider-runnable-track]:rounded-full
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-6
                       [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-keells-green
                       [&::-webkit-slider-thumb]:shadow-md"
            style={{
              background: `linear-gradient(to right, #1d6f42 0%, #1d6f42 ${((weight - 50) / 1950) * 100}%, #e5e7eb ${((weight - 50) / 1950) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50g</span>
            <span>2000g</span>
          </div>
        </div>

        {/* Price display */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-sm">Price per kg</span>
            <span className="text-gray-700 font-medium">Rs {pricePerKg.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-sm">Weight</span>
            <span className="text-gray-700 font-medium">{weight}g</span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-2xl text-keells-green">
              Rs {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center -mt-2">
          Demo prices only — not actual retail prices
        </p>
      </div>

      {/* Action button */}
      <div className="bg-white px-4 pb-6 pt-2 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => onPrint({ weight, totalPrice, pricePerKg, label, produce })}
          className="w-full bg-keells-green text-white font-semibold text-base rounded-2xl py-4
                     active:scale-95 transition-transform shadow-md hover:bg-keells-light"
        >
          Print Label
        </button>
      </div>
    </div>
  )
}
