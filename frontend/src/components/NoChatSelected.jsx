import { useAuthStore } from "../store/useAuthStore";

const NoChatSelected = () => {
  const { authUser } = useAuthStore();
  const isLawyer = authUser?.role === 'admin';

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-12 chat-bg relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(201,168,76,0.04) 0%, transparent 55%), radial-gradient(circle at 75% 20%, rgba(26,58,92,0.06) 0%, transparent 55%)' }}></div>
      </div>

      <div className="max-w-md text-center space-y-8 relative z-10">
        {/* Logo icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(135deg, #0c1f3d 0%, #1e3a5c 100%)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <img src="/yochat-logo.svg" alt="LexConnect" className="w-20 h-20" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg animate-bounce" style={{ background: 'linear-gradient(135deg, #c9a84c, #a67c3a)' }}>
              ⚖
            </div>
          </div>
        </div>

        {/* Welcome text */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold" style={{ color: '#0c1f3d', fontFamily: "'Playfair Display', serif" }}>
            Welcome to{" "}
            <span style={{ color: '#1a3a5c' }}>Lex</span>
            <span style={{ color: '#c9a84c' }}>Connect</span>
          </h2>
          <p className="text-base leading-relaxed max-w-sm mx-auto" style={{ color: '#4b5c7e' }}>
            {isLawyer
              ? "Select a client from the sidebar to begin a secure chat or video consultation."
              : "Select your attorney from the sidebar to start a secure consultation."
            }
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '💬', label: 'Secure Chat', desc: 'Encrypted messaging' },
            { icon: '📹', label: 'Video Calls', desc: 'HD consultations' },
            { icon: '📁', label: 'Case Files', desc: 'Document sharing' },
          ].map((feat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default group"
              style={{ background: 'white', border: '1px solid #d1dae6', boxShadow: '0 2px 8px rgba(12,31,61,0.06)' }}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{feat.icon}</span>
              <span className="text-sm font-semibold" style={{ color: '#0c1f3d' }}>{feat.label}</span>
              <span className="text-xs" style={{ color: '#6b7a94' }}>{feat.desc}</span>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-xs" style={{ color: '#94a3b8' }}>
          🔒 All communications are protected under attorney-client privilege
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
