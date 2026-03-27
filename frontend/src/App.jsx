import Navbar from "./components/Navbar";
import Calls from "./components/Calls";
import GroupCalls from "./components/GroupCalls";

import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import AdminDashboard from "./pages/AdminDashboard";
import ClientPortal from "./pages/ClientPortal";
import CasesPage from "./pages/CasesPage";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useCallStore } from "./store/useCallStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { initDebugFunctions } = useCallStore();
  const location = useLocation();

  // Landing page has its own header — hide the app Navbar there
  const isLandingPage = !authUser && location.pathname === "/";

  useEffect(() => {
    checkAuth();
    initDebugFunctions();
  }, [checkAuth, initDebugFunctions]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#f4f6f9' }}>
        <Loader className="size-10 animate-spin" style={{ color: '#1a3a5c' }} />
      </div>
    );

  return (
    <div data-theme={theme}>
      {!isLandingPage && <Navbar />}

      <Routes>
        {/* Landing page for guests; chat for authenticated users */}
        <Route path="/" element={authUser ? <HomePage /> : <LandingPage />} />

        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        {/* Law Firm Routes */}
        <Route path="/dashboard" element={authUser ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/client-portal" element={authUser ? <ClientPortal /> : <Navigate to="/login" />} />
        <Route path="/cases" element={authUser ? <CasesPage /> : <Navigate to="/login" />} />
      </Routes>

      {/* Global Calls — shown when there's an active call */}
      <Calls />
      <GroupCalls />

      <Toaster />
    </div>
  );
};
export default App;
