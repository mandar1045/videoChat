import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import CreateGroupModal from "./CreateGroupModal";
import { Users, Plus, MessageCircle, Search } from "lucide-react";
import { formatLastSeen } from "../lib/utils";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, getGroups, groups, selectedGroup, setSelectedGroup, isGroupsLoading, subscribeToUserUpdates, unsubscribeFromUserUpdates } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
    getGroups();
    subscribeToUserUpdates();

    return () => {
      unsubscribeFromUserUpdates();
    };
  }, [getUsers, getGroups, subscribeToUserUpdates, unsubscribeFromUserUpdates]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnline;
  });

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 chat-sidebar flex flex-col fade-in relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-5 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-20 right-8 w-2 h-2 bg-purple-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 left-10 w-2.5 h-2.5 bg-pink-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 right-3 w-1.5 h-1.5 bg-green-400/20 rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '7s' }}></div>
      </div>

      <div className="w-full p-5 bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-primary backdrop-blur-xl border-b border-border relative z-10"
           style={{
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
             transform: 'perspective(1000px) rotateX(1deg)',
             transformOrigin: 'center top'
           }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Users className="size-7 text-text-primary drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
            </div>
            <span className="font-semibold text-text-primary text-lg hidden lg:block drop-shadow-lg">Chats</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-text-secondary hover:text-text-primary p-3 rounded-full hover:bg-bg-tertiary transition-all duration-500 hover:scale-110 group relative overflow-hidden"
            style={{
              transform: 'perspective(1000px) rotateX(0deg)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-8deg) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Plus className="size-6 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Search className="size-5 text-text-secondary" />
            </div>
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-bg-secondary to-bg-tertiary backdrop-blur-md border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-500 relative"
              style={{
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                transform: 'perspective(1000px) rotateX(0deg)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(-2deg) translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full flex-1">
    {filteredUsers.map((user, index) => (
      <button
        key={user._id}
        onClick={() => setSelectedUser(user)}
        className={`
          w-full p-4 flex items-center gap-4 transition-all duration-500 rounded-xl mx-2 my-1 group relative overflow-hidden
          ${selectedUser?._id === user._id ? "bg-gradient-to-r from-primary/20 to-secondary/20 shadow-2xl scale-105" : "hover:bg-bg-tertiary hover:scale-102"}
        `}
        style={{
          transform: selectedUser?._id === user._id ? 'perspective(1000px) rotateX(-2deg) translateY(-3px)' : 'perspective(1000px) rotateX(0deg)',
          boxShadow: selectedUser?._id === user._id
            ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          animationDelay: `${index * 0.1}s`
        }}
        onMouseEnter={(e) => {
          if (selectedUser?._id !== user._id) {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-5px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedUser?._id !== user._id) {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
          }
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating particles */}
        <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400/40 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-purple-400/40 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '1s' }}></div>

        <div className="relative mx-auto lg:mx-0 z-10">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.name}
            className="chat-avatar"
          />
          {onlineUsers.includes(user._id) && (
            <span className="absolute bottom-0 right-0 size-4 bg-green-400 rounded-full border-3 border-white shadow-lg animate-pulse"
                  style={{
                    boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.3), 0 0 10px rgba(34, 197, 94, 0.5)'
                  }} />
          )}
        </div>

        {/* User info - only visible on larger screens */}
        <div className="hidden lg:block text-left min-w-0 flex-1 z-10 relative">
          <div className="font-semibold text-text-primary truncate text-lg group-hover:text-primary transition-colors duration-300">{user.fullName}</div>
          <div className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-300">
            {onlineUsers.includes(user._id) ? "online" : formatLastSeen(user.lastSeen)}
          </div>
        </div>
      </button>
    ))}

    {filteredUsers.length === 0 && (
      <div className="text-center text-text-muted py-8">No chats</div>
    )}

    {/* Groups Section */}
    {filteredGroups.length > 0 && (
      <>
        <div className="w-full p-4 bg-gradient-to-r from-bg-secondary to-bg-tertiary backdrop-blur-sm border-t border-border relative"
             style={{
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
               transform: 'perspective(1000px) rotateX(1deg)',
               transformOrigin: 'center bottom'
             }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className="size-7 text-text-primary drop-shadow-lg" />
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-sm animate-pulse"></div>
            </div>
            <span className="font-semibold text-text-primary text-lg hidden lg:block drop-shadow-lg">Groups</span>
          </div>
        </div>

        {filteredGroups.map((group, index) => (
          <button
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`
              w-full p-4 flex items-center gap-4 transition-all duration-500 rounded-xl mx-2 my-1 group relative overflow-hidden
              ${selectedGroup?._id === group._id ? "bg-gradient-to-r from-secondary/20 to-accent/20 shadow-2xl scale-105" : "hover:bg-bg-tertiary hover:scale-102"}
            `}
            style={{
              transform: selectedGroup?._id === group._id ? 'perspective(1000px) rotateX(-2deg) translateY(-3px)' : 'perspective(1000px) rotateX(0deg)',
              boxShadow: selectedGroup?._id === group._id
                ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              animationDelay: `${index * 0.1}s`
            }}
            onMouseEnter={(e) => {
              if (selectedGroup?._id !== group._id) {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-5px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedGroup?._id !== group._id) {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
              }
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-pink-400/5 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating particles */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400/40 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-pink-400/40 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '1s' }}></div>

            <div className="relative mx-auto lg:mx-0 z-10">
              {group.profilePic ? (
                <img
                  src={group.profilePic}
                  alt={group.name}
                  className="chat-avatar"
                />
              ) : (
                <div className="size-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-xl relative overflow-hidden">
                  <span className="text-white font-bold text-lg drop-shadow-lg relative z-10">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                </div>
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1 z-10 relative">
              <div className="font-semibold text-text-primary truncate text-lg group-hover:text-secondary transition-colors duration-300">{group.name}</div>
              <div className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                {group.members.length} members
              </div>
            </div>
          </button>
        ))}
      </>
    )}
      </div>

      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
};
export default Sidebar;
