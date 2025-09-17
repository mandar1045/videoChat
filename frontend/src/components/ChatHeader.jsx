import { X, Trash2, Camera, Phone, Video, Info } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import { useRef } from "react";
import { formatLastSeen } from "../lib/utils";

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

  const handleGroupVideoCall = () => {
    if (selectedGroup) {
      console.log('Starting group video call for:', selectedGroup._id);
      startCall(selectedGroup._id, 'video');
    }
  };

  const handleGroupAudioCall = () => {
    if (selectedGroup) {
      console.log('Starting group audio call for:', selectedGroup._id);
      startCall(selectedGroup._id, 'audio');
    }
  };

  const chat = selectedUser || selectedGroup;

  if (!chat) return null;

  return (
    <div className="chat-header p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          {selectedUser ? (
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
          ) : selectedGroup.profilePic ? (
            <img src={selectedGroup.profilePic} alt={selectedGroup.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
              {selectedGroup.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Online indicator for users */}
          {selectedUser && onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
          {/* Camera button for group profile pic update (only for creator) */}
          {selectedGroup && authUser && selectedGroup.creator === authUser._id && (
            <button
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
            >
              <Camera size={12} />
            </button>
          )}
        </div>

        {/* Chat info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-white">
            {selectedUser ? selectedUser.fullName : selectedGroup.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedUser
              ? (onlineUsers.includes(selectedUser._id) ? "online" : formatLastSeen(selectedUser.lastSeen))
              : `${selectedGroup.members.length} members`
            }
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Call buttons for users */}
        {selectedUser && (
          <>
            <button
              onClick={handleAudioCall}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Audio Call"
            >
              <Phone size={20} />
            </button>
            <button
              onClick={handleVideoCall}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Video Call"
            >
              <Video size={20} />
            </button>
          </>
        )}

        {/* Call buttons for groups */}
        {selectedGroup && (
          <>
            <button
              onClick={handleGroupAudioCall}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Group Audio Call"
            >
              <Phone size={20} />
            </button>
            <button
              onClick={handleGroupVideoCall}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Group Video Call"
            >
              <Video size={20} />
            </button>
          </>
        )}

        {/* Info button */}
        <button className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Info size={20} />
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
