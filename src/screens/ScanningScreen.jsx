export default function ScanningScreen({ capturedImage }) {
  return (
    <div className="flex flex-col h-full fade-in">
      {/* Frozen captured frame with scan line */}
      <div className="relative flex-1 bg-black overflow-hidden">
        <img
          src={capturedImage}
          alt="Captured produce"
          className="w-full h-full object-cover"
        />
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scan-line" />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Bottom panel */}
      <div className="bg-white px-4 pt-5 pb-8 flex flex-col items-center gap-3 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-3 border-keells-green border-t-transparent rounded-full animate-spin border-2" />
          <span className="text-gray-700 font-semibold text-base">Identifying produce…</span>
        </div>
        <p className="text-gray-400 text-sm">Analysing with Claude Vision AI</p>
      </div>
    </div>
  )
}
