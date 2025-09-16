import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageCircleCode, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="fixed w-full top-0 z-40 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary backdrop-blur-2xl border-b border-border shadow-2xl"
      style={{
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        transform: 'perspective(1200px) rotateX(2deg)',
        transformOrigin: 'center top'
      }}
    >
      <div className="container mx-auto px-6 h-16 relative">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-pink-400/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        </div>

        <div className="flex items-center justify-between h-full relative z-10">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 hover:scale-110 transition-all duration-500 group"
              style={{
                transform: 'perspective(1000px) rotateX(0deg)',
                transformOrigin: 'center center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(-10deg) translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
              }}
            >
              <div className="relative">
                <img
                  src="/yochat-logo.svg"
                  alt="Yochat Logo"
                  className="w-10 h-10 drop-shadow-2xl group-hover:drop-shadow-[0_0_20px_rgba(102,126,234,0.6)] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
              </div>
              <h1 className="text-xl font-bold text-text-primary drop-shadow-lg group-hover:text-primary transition-colors duration-500">Yochat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className="hover:bg-bg-tertiary rounded-full p-3 transition-all duration-500 flex items-center gap-2 text-text-primary hover:scale-110 group relative overflow-hidden"
              style={{
                transform: 'perspective(1000px) rotateX(0deg)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(-8deg) translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Settings className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
              <span className="hidden sm:inline font-medium relative z-10">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="hover:bg-bg-tertiary rounded-full p-3 transition-all duration-500 flex items-center gap-2 text-text-primary hover:scale-110 group relative overflow-hidden"
                  style={{
                    transform: 'perspective(1000px) rotateX(0deg)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(-8deg) translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <User className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  <span className="hidden sm:inline font-medium relative z-10">Profile</span>
                </Link>

                <button
                  className="hover:bg-bg-tertiary rounded-full p-3 transition-all duration-500 flex items-center gap-2 text-text-primary hover:scale-110 group relative overflow-hidden"
                  onClick={logout}
                  style={{
                    transform: 'perspective(1000px) rotateX(0deg)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(-8deg) translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <LogOut className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                  <span className="hidden sm:inline font-medium relative z-10">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
