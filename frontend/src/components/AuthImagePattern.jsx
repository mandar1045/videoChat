const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c1f3d 0%, #162d4a 50%, #0c1f3d 100%)' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}></div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      <div className="max-w-md text-center px-12 relative z-10">
        {/* Logo ring */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="w-36 h-36 rounded-full border-2 border-[#c9a84c]/30 flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.06)' }}>
              <div className="w-28 h-28 rounded-full border border-[#c9a84c]/20 flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.08)' }}>
                <img src="/yochat-logo.svg" alt="LexConnect" className="w-20 h-20" />
              </div>
            </div>
            <div className="absolute top-1 right-3 w-3 h-3 rounded-full bg-[#c9a84c] opacity-70 animate-pulse"></div>
            <div className="absolute bottom-3 left-1 w-2 h-2 rounded-full bg-[#c9a84c] opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Lex<span className="text-[#c9a84c]">Connect</span>
        </h1>
        <p className="text-xs text-[#c9a84c]/60 uppercase tracking-[0.2em] mb-8">Secure Legal Consultations</p>

        <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
        <p className="text-[#94a3b8] text-sm leading-relaxed mb-10">{subtitle}</p>

        {/* Feature pills */}
        <div className="flex flex-col gap-3">
          {[
            { icon: '🔒', text: 'End-to-end encrypted consultations' },
            { icon: '📹', text: 'HD video calls with your attorney' },
            { icon: '📁', text: 'Secure case document sharing' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl text-left border border-[#c9a84c]/15" style={{ background: 'rgba(201,168,76,0.05)' }}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-[#cbd5e1]">{item.text}</span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-[#6b7a94] italic border-t border-[#c9a84c]/10 pt-6">
          "Justice delayed is justice denied."
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
