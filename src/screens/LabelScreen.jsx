import { useMemo } from 'react'
import { getPLU, getPricePerKg, randomWeight, calcPrice } from '../data/produce'

function Barcode({ plu }) {
  const pattern = [3,1,2,1,4,1,1,3,2,1,1,2,3,1,2,2,1,1,3,1,2,1,1,4,2,1,3,1,1,2]
  const barcodeNum = String(plu).padStart(13, '0')
  return (
    <div className="my-3">
      <div className="flex items-end gap-[2px] h-10 justify-center">
        {pattern.map((w, i) => (
          <div key={i} className="bg-gray-900"
            style={{ width: w * 2 + 'px', height: i % 4 === 0 ? '40px' : '30px' }} />
        ))}
      </div>
      <p className="text-center font-mono text-xs text-gray-600 mt-1 tracking-widest">{barcodeNum}</p>
    </div>
  )
}

export default function LabelScreen({ produce, onNewItem }) {
  const weight     = useMemo(() => randomWeight(), [])
  const pricePerKg = getPricePerKg(produce.category)
  const total      = calcPrice(weight, pricePerKg)
  const plu        = getPLU(produce.category)

  const itemLine = produce.variety
    ? `${produce.category} — ${produce.variety}`
    : produce.category

  const today = new Date().toLocaleDateString('en-LK', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="flex-1 flex flex-col bg-gray-100 fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">

        <p className="text-gray-500 text-sm font-medium">Label Preview</p>

        {/* Thermal label */}
        <div className="bg-white border border-gray-800 rounded-sm w-full max-w-xs shadow-lg overflow-hidden"
          style={{ fontFamily: 'monospace' }}>

          {/* Header strip */}
          <div className="bg-keells-green px-4 py-2 flex items-center justify-between">
            <span className="text-white font-bold text-sm tracking-widest">KEELLS SUPER</span>
            <span className="text-green-200 text-xs">Fresh Produce</span>
          </div>

          <div className="px-4 pt-3 pb-4">
            {/* Item name */}
            <div className="text-gray-900 font-bold text-base leading-tight border-b border-dashed border-gray-300 pb-2 mb-2">
              {itemLine}
            </div>

            {/* Weight + Price */}
            <div className="flex justify-between items-baseline">
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wide">Weight</div>
                <div className="text-gray-900 font-bold text-lg">{weight}g</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-xs uppercase tracking-wide">Price</div>
                <div className="text-gray-900 font-extrabold text-2xl">Rs {total.toFixed(2)}</div>
              </div>
            </div>

            <Barcode plu={plu} />

            <div className="flex justify-between text-xs text-gray-400 border-t border-dashed border-gray-200 pt-2">
              <span>PLU: {plu}</span>
              <span>{today}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center max-w-xs leading-relaxed">
          In production this label prints via a thermal printer at the scale terminal.
        </p>
      </div>

      <div className="px-4 pb-8 pt-2">
        <button onClick={onNewItem}
          className="w-full bg-keells-green text-white font-bold text-lg rounded-2xl py-5
                     active:scale-95 transition-transform shadow-lg hover:bg-keells-light">
          New Item
        </button>
      </div>
    </div>
  )
}
