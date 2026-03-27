import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn, googleSignIn } = useAuthStore();

  const handleGoogleSignIn = (response) => {
    googleSignIn(response.credential);
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '491088596417-t8ma7ocemdh03jhdik8hhmej8sg9v6ck.apps.googleusercontent.com',
        callback: handleGoogleSignIn,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
      );
    }
  }, [handleGoogleSignIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2" style={{ background: '#f4f6f9' }}>
      {/* Left Side – Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Logo & header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #0c1f3d, #162d4a)', border: '1px solid rgba(201,168,76,0.3)' }}>
                <img src="/yochat-logo.svg" alt="LexConnect" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#0c1f3d', fontFamily: "'Playfair Display', serif" }}>
                  Welcome Back
                </h1>
                <p className="text-sm mt-1" style={{ color: '#6b7a94' }}>Sign in to your LexConnect account</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#0c1f3d' }}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: '#6b7a94' }} />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm transition-all"
                  style={{ background: '#f4f6f9', border: '1.5px solid #d1dae6', color: '#0c1f3d', outline: 'none' }}
                  placeholder="you@lawfirm.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = '#1a3a5c'}
                  onBlur={(e) => e.target.style.borderColor = '#d1dae6'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#0c1f3d' }}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: '#6b7a94' }} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all"
                  style={{ background: '#f4f6f9', border: '1.5px solid #d1dae6', color: '#0c1f3d', outline: 'none' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = '#1a3a5c'}
                  onBlur={(e) => e.target.style.borderColor = '#d1dae6'}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" style={{ color: '#6b7a94' }} /> : <Eye className="h-5 w-5" style={{ color: '#6b7a94' }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              {isLoggingIn ? (
                <><Loader2 className="h-5 w-5 animate-spin inline mr-2" />Signing in...</>
              ) : (
                "Sign In to LexConnect"
              )}
            </button>

            <div className="flex items-center my-2">
              <div className="flex-1 border-t" style={{ borderColor: '#d1dae6' }}></div>
              <span className="px-3 text-xs" style={{ color: '#6b7a94' }}>or continue with</span>
              <div className="flex-1 border-t" style={{ borderColor: '#d1dae6' }}></div>
            </div>

            <div id="google-signin-button" className="w-full flex justify-center"></div>
          </form>

          <div className="text-center">
            <p className="text-sm" style={{ color: '#6b7a94' }}>
              New to LexConnect?{" "}
              <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#1a3a5c' }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs" style={{ color: '#94a3b8' }}>🔒 256-bit SSL encryption · Attorney-client privilege protected</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Connecting clients with counsel"
        subtitle="Access your case files, schedule consultations, and communicate securely with your attorney — all in one place."
      />
    </div>
  );
};

export default LoginPage;
