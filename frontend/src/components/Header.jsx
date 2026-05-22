export default function Header({ currentPage, setCurrentPage }) {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'howItWorks', label: 'How It Works' },
  ]

  return (
    <header className="header">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F8A4C] to-[#2AE06E] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(42,224,110,0.35)]">
              🌿
            </div>
            <div>
              <div className="font-['Space_Grotesk'] text-lg font-bold bg-gradient-to-r from-[#86efac] via-[#2AE06E] to-[#fbbf24] bg-clip-text text-transparent">
                CropAI — Disease Detection
              </div>
              <div className="text-xs text-gray-500 tracking-widest uppercase mt-0.5">
                Agriculture + Artificial Intelligence
              </div>
            </div>
          </div>
          <nav className="flex gap-4 md:gap-8 items-center">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  currentPage === item.key
                    ? 'text-[#2AE06E]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-[#2AE06E] shadow-[0_0_10px_#2AE06E] transition-all duration-300 ${
                    currentPage === item.key ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0'
                  }`} />
                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                    {item.label}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full bg-[#2AE06E] shadow-[0_0_10px_#2AE06E] transition-all duration-300 ${
                    currentPage === item.key ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0'
                  }`} />
                </div>
                
                {/* Background Hover Effect */}
                <div className={`absolute inset-0 rounded-lg bg-[rgba(42,224,110,0.08)] border border-[rgba(42,224,110,0.15)] transition-all duration-300 ${
                  currentPage === item.key ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                }`} />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
