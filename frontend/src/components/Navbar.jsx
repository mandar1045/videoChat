import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, LayoutDashboard, Briefcase, FileText, MessageSquare } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed w-full top-0 z-40 bg-[#0c1f3d] border-b border-[#c9a84c]/20 shadow-lg">
      <div className="container mx-auto px-6 h-16">
        <div className="flex items-center justify-between h-full">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#162d4a] border border-[#c9a84c]/30 shadow-md group-hover:border-[#c9a84c]/70 transition-all duration-300">
              <img
                src="/yochat-logo.svg"
                alt="LexConnect Logo"
                className="w-7 h-7"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                Lex<span className="text-[#c9a84c]">Connect</span>
              </span>
              <span className="text-[10px] text-[#94a3b8] uppercase tracking-widest hidden sm:block">Secure Legal Consultations</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <NavItem to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />

            {authUser?.role === 'admin' && (
              <>
                <NavItem to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                <NavItem to="/cases" icon={<Briefcase className="w-4 h-4" />} label="Cases" />
              </>
            )}

            {authUser?.role === 'client' && (
              <NavItem to="/client-portal" icon={<FileText className="w-4 h-4" />} label="My Portal" />
            )}

            {authUser && (
              <>
                <NavItem to="/" icon={<MessageSquare className="w-4 h-4" />} label="Messages" />
                <NavItem to="/profile" icon={<User className="w-4 h-4" />} label="Profile" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-white hover:bg-[#162d4a] transition-all duration-200 border border-transparent hover:border-[#c9a84c]/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-white hover:bg-[#162d4a] transition-all duration-200 border border-transparent hover:border-[#c9a84c]/20"
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </Link>
);

export default Navbar;
