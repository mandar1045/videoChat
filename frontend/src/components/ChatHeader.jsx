import { X, Trash2, Camera, Phone, Video, Info } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import { useRef } from "react";

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

    if (selectedGroup && authUser && selectedGroup.creator === authUser._id) {
      deleteGroup(selectedGroup._id);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedGroup && authUser && selectedGroup.creator === authUser._id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateGroupProfilePic(selectedGroup._id, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleAudioCall = () => {
    if (selectedUser) {
      console.log('Starting audio call to:', selectedUser._id);
      startCall(selectedUser._id, 'audio');
    }
  };

  const handleVideoCall = () => {
    if (selectedUser) {
      console.log('Starting video call to:', selectedUser._id);
      startCall(selectedUser._id, 'video');
    }
  };

  const chat = selectedUser || selectedGroup;

  if (!chat) return null;

  return (
    <div className="chat-header p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          {selectedUser ? (
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="chat-avatar" />
          ) : selectedGroup.profilePic ? (
            <img src={selectedGroup.profilePic} alt={selectedGroup.name} className="chat-avatar" />
          ) : (
            <div className="chat-avatar bg-gray-400 flex items-center justify-center">
              <span className="text-bg-primary font-bold text-lg">
                {selectedGroup.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Online indicator for users */}
          {selectedUser && onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-bg-primary"></span>
          )}
          {/* Camera button for group profile pic update (only for creator) */}
          {selectedGroup && authUser && selectedGroup.creator === authUser._id && (
            <button
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 bg-gray-600 text-bg-primary rounded-full p-1 hover:bg-gray-700 transition-colors"
            >
              <Camera size={12} />
            </button>
          )}
        </div>

        {/* Chat info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg truncate text-text-primary">
            {selectedUser ? selectedUser.fullName : selectedGroup.name}
          </h3>
          <p className="text-sm text-text-secondary">
            {selectedUser
              ? (onlineUsers.includes(selectedUser._id) ? "online" : "last seen recently")
              : `${selectedGroup.members.length} members`
            }
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {/* Call buttons for users */}
        {selectedUser && (
          <>
            <button
              onClick={handleAudioCall}
              className="hover:bg-bg-tertiary rounded-full p-2 transition-colors text-text-primary"
              title="Audio Call"
            >
              <Phone size={22} />
            </button>
            <button
              onClick={handleVideoCall}
              className="hover:bg-bg-tertiary rounded-full p-2 transition-colors text-text-primary"
              title="Video Call"
            >
              <Video size={22} />
            </button>
          </>
        )}

        {/* Info button */}
        <button className="hover:bg-bg-tertiary rounded-full p-2 transition-colors text-text-primary">
          <Info size={22} />
        </button>
      </div>

      {/* Hidden file input for profile pic */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePicChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
export default ChatHeader;
