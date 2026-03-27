import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, BadgeCheck, Calendar, Scale } from "lucide-react";

const NAVY = "#0c1f3d";
const GOLD  = "#c9a84c";

const Field = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7a94' }}>
      <Icon size={13} />
      {label}
    </div>
    <div
      className="px-4 py-3 rounded-xl text-sm font-medium"
      style={{ background: '#f4f6f9', border: '1px solid #d1dae6', color: NAVY }}
    >
      {value || "—"}
    </div>
  </div>
);

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedRole, setSelectedRole] = useState(authUser?.role || "client");

  useEffect(() => {
    setSelectedRole(authUser?.role || "client");
  }, [authUser?.role]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const isLawyer  = authUser?.role === "admin";
  const roleLabel = isLawyer ? "Attorney" : "Client";
  const hasRoleChanged = selectedRole !== authUser?.role;

  const handleRoleUpdate = async () => {
    if (!hasRoleChanged) return;
    await updateProfile({ role: selectedRole });
  };

  return (
    <div className="min-h-screen pt-20 pb-10" style={{ background: '#f4f6f9' }}>
      <div className="max-w-2xl mx-auto px-4">

        {/* ── Header card ── */}
        <div
          className="rounded-2xl p-8 mb-5 flex flex-col items-center text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1e3a5c 100%)` }}
        >
          {/* subtle pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />

          {/* Avatar */}
          <div className="relative z-10 mb-4">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-xl"
              style={{ borderColor: GOLD }}
            >
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-110 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              style={{ background: GOLD }}
              title="Change photo"
            >
              <Camera size={14} color="white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          {/* Name + role */}
          <h1 className="text-2xl font-bold text-white z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            {authUser?.fullName}
          </h1>

          <div
            className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10"
            style={{
              background: isLawyer ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.12)',
              color: isLawyer ? GOLD : 'rgba(255,255,255,0.75)',
              border: `1px solid ${isLawyer ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.2)'}`,
            }}
          >
            <BadgeCheck size={11} />
            {roleLabel}
          </div>

          <p className="mt-1.5 text-xs z-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {isUpdatingProfile ? "Uploading photo…" : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* ── Info card ── */}
        <div className="rounded-2xl p-6 mb-5 bg-white shadow-sm space-y-4" style={{ border: '1px solid #d1dae6' }}>
          <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: NAVY }}>
            <User size={15} style={{ color: GOLD }} />
            Personal Information
          </h2>

          <Field icon={User}  label="Full Name"     value={authUser?.fullName} />
          <Field icon={Mail}  label="Email Address" value={authUser?.email} />
        </div>

        {/* ── Account card ── */}
        <div className="rounded-2xl p-6 mb-5 bg-white shadow-sm" style={{ border: '1px solid #d1dae6' }}>
          <h2 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: NAVY }}>
            <Calendar size={15} style={{ color: GOLD }} />
            Account Details
          </h2>

          <div className="space-y-0 divide-y" style={{ borderColor: '#eaeff5' }}>
            <div className="flex items-center justify-between py-3 text-sm">
              <span style={{ color: '#6b7a94' }}>Member Since</span>
              <span className="font-medium" style={{ color: NAVY }}>
                {authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span style={{ color: '#6b7a94' }}>Account Role</span>
              <span
                className="font-semibold text-xs uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  background: isLawyer ? 'rgba(12,31,61,0.07)' : 'rgba(201,168,76,0.1)',
                  color: isLawyer ? NAVY : '#a67c3a',
                  border: `1px solid ${isLawyer ? 'rgba(12,31,61,0.12)' : 'rgba(201,168,76,0.25)'}`,
                }}
              >
                {roleLabel}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span style={{ color: '#6b7a94' }}>Account Status</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-5 bg-white shadow-sm space-y-4" style={{ border: '1px solid #d1dae6' }}>
          <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: NAVY }}>
            <Scale size={15} style={{ color: GOLD }} />
            Account Type
          </h2>

          <p className="text-sm" style={{ color: '#6b7a94' }}>
            Switch this account between client and lawyer. Lawyers can see every user, while clients see every lawyer.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                value: "client",
                label: "Client",
                description: "See every lawyer on the platform.",
              },
              {
                value: "admin",
                label: "Lawyer",
                description: "See every user on the platform.",
              },
            ].map((option) => {
              const isSelected = selectedRole === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRole(option.value)}
                  className="text-left rounded-xl p-4 border transition-all"
                  style={{
                    background: isSelected ? 'rgba(12,31,61,0.04)' : '#f4f6f9',
                    borderColor: isSelected ? '#1a3a5c' : '#d1dae6',
                    boxShadow: isSelected ? '0 6px 18px rgba(12,31,61,0.08)' : 'none',
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>{option.label}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7a94' }}>{option.description}</p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleRoleUpdate}
            disabled={!hasRoleChanged || isUpdatingProfile}
            className="px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)', border: '1px solid rgba(201,168,76,0.3)' }}
          >
            {isUpdatingProfile ? "Saving..." : "Update Account Type"}
          </button>
        </div>

        {/* ── Security card ── */}
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{ background: 'rgba(12,31,61,0.04)', border: '1px solid rgba(12,31,61,0.1)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `linear-gradient(135deg, ${NAVY}, #1e3a5c)` }}
          >
            <Shield size={18} color={GOLD} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: NAVY }}>End-to-End Encrypted</p>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7a94' }}>
              All messages and video calls are protected by 256-bit encryption. Your attorney-client communications are private and secure.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
