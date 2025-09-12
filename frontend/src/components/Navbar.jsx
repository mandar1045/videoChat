import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageCircleCode, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="border-b border-border fixed w-full top-0 z-40 bg-bg-primary"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <img src="/yochat-logo.svg" alt="Yochat Logo" className="w-9 h-9" />
              <h1 className="text-lg font-bold text-text-primary">Yochat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              
              className="hover:bg-bg-tertiary rounded-full p-2 transition-colors flex items-center gap-2 text-text-primary"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="hover:bg-bg-tertiary rounded-full p-2 transition-colors flex items-center gap-2 text-text-primary">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="hover:bg-bg-tertiary rounded-full p-2 transition-colors flex items-center gap-2 text-text-primary" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
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
