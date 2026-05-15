export default function Header() {
  return (
    <header className="bg-keells-green text-white px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-keells-green font-extrabold text-sm leading-none">K</span>
        </div>
        <div>
          <div className="font-bold text-base leading-tight">SmartProduce AI</div>
          <div className="text-green-200 text-xs leading-tight">Fresh Produce</div>
        </div>
      </div>
      <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full border border-white/30">
        Demo
      </span>
    </header>
  )
}
