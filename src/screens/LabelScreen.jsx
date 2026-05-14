import { useMemo } from 'react'
import { getPLU, randomWeight, calcPrice, getPricePerKg } from '../data/produce'

function Barcode() {
  const pattern = [3,1,2,1,4,1,1,3,2,1,1,2,3,1,2,2,1,1,3,1,2,1,1,4,2,1,3,1,1,2]
  return (
    <div className="flex items-end gap-[2px] h-10 justify-center my-2">
      {pattern.map((w, i) => (
        <div
          key={i}
          className="bg-gray-900"
          style={{ width: w * 2 + 'px', height: i % 4 === 0 ? '40px' : '30px' }}
        />
      ))}
    </div>
  )
}

export default function LabelScreen({ produce, onNewItem }) {
  // Generate weight once on mount
  const weight = useMemo(() => randomWeight(), [])
  const pricePerKg = getPricePerKg(produce.category)
  const totalPrice = calcPrice(weight, pricePerKg)
  const plu = getPLU(produce.category)

  const itemLine = produce.variety
    ? `${produce.categoryLabel} — ${produce.variety}`
    : produce.categoryLabel

  const today = new Date().toLocaleDateString('en-LK', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="flex-1 flex flex-col bg-gray-50 fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">

        {/* Label sticker */}
        <div className="bg-white border border-gray-300 rounded-xl w-full max-w-xs shadow-lg overflow-hidden">
          {/* Green header strip */}
          <div className="bg-keells-green px-4 py-2 flex justify-between items-center">
            <span className="text-white font-bold text-sm tracking-wider">SUPER MARKET</span>
            <span className="text-green-200 text-xs">Fresh Produce</span>
          </div>

          <div className="px-4 pt-3 pb-4 font-mono">
            <div className="text-gray-900 font-bold text-lg leading-tight">{itemLine}</div>

            <div className="flex justify-between items-baseline mt-3 border-t border-dashed border-gray-300 pt-2">
              <div>
                <div className="text-gray-500 text-xs">Weight</div>
                <div className="text-gray-900 font-bold text-base">{weight}g</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-xs">Total Price</div>
                <div className="text-gray-900 font-extrabold text-xl">Rs {totalPrice.toFixed(2)}</div>
              </div>
            </div>

            <Barcode />

            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>PLU: {plu}</span>
              <span>{today}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          In production this prints via a thermal label printer at the scale terminal.
        </p>
      </div>

      {/* New Item button */}
      <div className="px-4 pb-8 pt-2">
        <button
          onClick={onNewItem}
          className="w-full bg-keells-green text-white font-bold text-lg rounded-2xl py-5
                     active:scale-95 transition-transform shadow-lg hover:bg-keells-light"
        >
          New Item
        </button>
      </div>
    </div>
  )
}
