export default function Header() {
  return (
    <header className="bg-keells-green text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-keells-green font-extrabold text-xs leading-none">K</span>
        </div>
        <div>
          <div className="font-bold text-base leading-tight">SmartProduce AI</div>
          <div className="text-green-200 text-xs leading-tight">Keells Super</div>
        </div>
      </div>
      <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full border border-white/30">
        Demo Mode
      </span>
    </header>
  )
}
