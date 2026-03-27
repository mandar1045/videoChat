import { X, Phone, Video, Shield, Trash2, Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import { useRef } from "react";
import { formatLastSeen } from "../lib/utils";

const NAVY = "#0c1f3d";
const GOLD  = "#c9a84c";

const HeaderBtn = ({ onClick, title, children, accent, danger }) => (
  <button
    onClick={onClick}
    title={title}
    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
    style={{
      background: accent ? `linear-gradient(135deg, ${NAVY}, #1a3a5c)` : danger ? 'rgba(220,38,38,0.07)' : '#f4f6f9',
      color: accent ? 'white' : danger ? '#dc2626' : '#4b5c7e',
      border: `1px solid ${accent ? 'rgba(201,168,76,0.18)' : danger ? 'rgba(220,38,38,0.15)' : '#d1dae6'}`,
    }}
  >
    {children}
  </button>
);

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup, deleteGroup, updateGroupProfilePic } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const { startCall } = useCallStore();
  const fileInputRef = useRef(null);

  const handleClose = () => {
    if (selectedUser) setSelectedUser(null);
    if (selectedGroup) setSelectedGroup(null);
  };

  const handleDeleteGroup = () => {
    if (selectedGroup && authUser && selectedGroup.creator === authUser._id)
      deleteGroup(selectedGroup._id);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedGroup && authUser && selectedGroup.creator === authUser._id) {
      const reader = new FileReader();
      reader.onloadend = () => updateGroupProfilePic(selectedGroup._id, reader.result);
      reader.readAsDataURL(file);
    }
  };

  const chat = selectedUser || selectedGroup;
  if (!chat) return null;

  const isOnline  = selectedUser && onlineUsers.includes(selectedUser._id);
  const roleLabel = selectedUser?.role === 'admin' ? 'Attorney' : selectedUser?.role === 'client' ? 'Client' : null;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b bg-white"
      style={{ borderColor: '#d1dae6', minHeight: '64px' }}>

      {/* ── Left: Avatar + Info ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {selectedUser ? (
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="w-11 h-11 rounded-full object-cover border-2"
              style={{ borderColor: isOnline ? '#10b981' : '#d1dae6' }}
            />
          ) : selectedGroup?.profilePic ? (
            <img src={selectedGroup.profilePic} alt={selectedGroup.name}
              className="w-11 h-11 rounded-full object-cover border-2" style={{ borderColor: '#d1dae6' }} />
          ) : (
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #1e3a5c)` }}>
              {selectedGroup?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {selectedUser && isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-400" />
          )}

          {selectedGroup && authUser && selectedGroup.creator === authUser._id && (
            <button onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: GOLD }}>
              <Camera size={10} color="white" />
            </button>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base leading-tight truncate" style={{ color: NAVY }}>
              {selectedUser ? selectedUser.fullName : selectedGroup?.name}
            </h3>
            {roleLabel && (
              <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: selectedUser?.role === 'admin' ? 'rgba(12,31,61,0.07)' : 'rgba(201,168,76,0.1)',
                  color: selectedUser?.role === 'admin' ? NAVY : '#a67c3a',
                  border: `1px solid ${selectedUser?.role === 'admin' ? 'rgba(12,31,61,0.12)' : 'rgba(201,168,76,0.25)'}`,
                }}>
                {roleLabel}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: isOnline ? '#10b981' : '#6b7a94' }}>
            {selectedUser
              ? (isOnline ? '● Online now' : formatLastSeen(selectedUser.lastSeen))
              : `${selectedGroup?.members?.length} members`}
          </p>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg mr-1" style={{ background: '#f4f6f9' }}>
          <Shield size={11} style={{ color: '#10b981' }} />
          <span className="text-[10px] font-medium" style={{ color: '#6b7a94' }}>Encrypted</span>
        </div>

        {selectedUser && (
          <HeaderBtn onClick={() => startCall(selectedUser._id, 'audio')} title="Voice Call">
            <Phone size={16} />
          </HeaderBtn>
        )}
        {selectedGroup && authUser?.role === 'admin' && (
          <HeaderBtn onClick={() => startCall(selectedGroup._id, 'audio')} title="Group Voice Call">
            <Phone size={16} />
          </HeaderBtn>
        )}

        {selectedUser && (
          <HeaderBtn onClick={() => startCall(selectedUser._id, 'video')} title="Video Consultation" accent>
            <Video size={16} />
          </HeaderBtn>
        )}
        {selectedGroup && authUser?.role === 'admin' && (
          <HeaderBtn onClick={() => startCall(selectedGroup._id, 'video')} title="Group Video Call" accent>
            <Video size={16} />
          </HeaderBtn>
        )}

        {selectedGroup && authUser && selectedGroup.creator === authUser._id && (
          <HeaderBtn onClick={handleDeleteGroup} title="Delete Group" danger>
            <Trash2 size={15} />
          </HeaderBtn>
        )}

        <HeaderBtn onClick={handleClose} title="Close">
          <X size={17} />
        </HeaderBtn>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default ChatHeader;
