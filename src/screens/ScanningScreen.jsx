export default function ScanningScreen({ capturedImage }) {
  return (
    <div className="flex-1 flex flex-col fade-in">
      {/* Frozen frame with scan line */}
      <div className="relative flex-1 bg-black overflow-hidden">
        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scan-line" />
        </div>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Status */}
      <div className="bg-white px-4 py-5 flex flex-col items-center gap-2 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-keells-green border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-700 font-semibold">Identifying produce…</span>
        </div>
        <p className="text-gray-400 text-xs">Powered by Claude Vision AI</p>
      </div>
    </div>
  )
}
