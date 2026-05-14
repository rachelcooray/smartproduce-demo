import { getPLU } from '../data/produce'

function Barcode() {
  const bars = Array.from({ length: 30 }, (_, i) => ({
    width: [1, 2, 1, 3, 1, 2, 2, 1, 1, 3][i % 10],
    gap: i % 7 === 0 ? 3 : 1,
  }))
  return (
    <div className="flex items-end gap-px h-10 justify-center my-1">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="bg-gray-900"
          style={{ width: bar.width * 2 + 'px', height: i % 5 === 0 ? '40px' : '32px' }}
        />
      ))}
    </div>
  )
}

export default function LabelScreen({ labelData, onNewItem }) {
  const { weight, totalPrice, label, produce } = labelData
  const plu = getPLU(produce.category)
  const today = new Date().toLocaleDateString('en-LK', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="flex flex-col h-full fade-in">
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center px-4 py-6 gap-6">

        <div>
          <p className="text-center text-gray-500 text-sm font-medium mb-3">Label Preview</p>

          {/* Simulated label */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-5 w-72 font-mono shadow-sm">
            <div className="border-b border-gray-200 pb-2 mb-2">
              <div className="font-bold text-base tracking-tight">KEELLS SUPER</div>
              <div className="text-xs text-gray-400">Fresh Produce Department</div>
            </div>

            <div className="text-sm font-bold mb-1 tracking-tight leading-snug">{label}</div>

            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">{weight}g</span>
              <span className="font-bold">Rs {totalPrice.toFixed(2)}</span>
            </div>

            <Barcode />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>PLU: {plu}</span>
              <span>{today}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center max-w-xs leading-relaxed">
          In production this label prints at the scale terminal via a thermal label printer.
        </p>
      </div>

      {/* Actions */}
      <div className="bg-white px-4 pb-6 pt-3 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] flex flex-col gap-2">
        <button
          onClick={onNewItem}
          className="w-full bg-keells-green text-white font-semibold text-base rounded-2xl py-4
                     active:scale-95 transition-transform shadow-md hover:bg-keells-light"
        >
          New Item
        </button>
        <p className="text-center text-xs text-gray-400">
          Tap "New Item" to weigh another product
        </p>
      </div>
    </div>
  )
}
