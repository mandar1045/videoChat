import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import CreateGroupModal from "./CreateGroupModal";
import { Users, Plus, MessageCircle, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, getGroups, groups, selectedGroup, setSelectedGroup, isGroupsLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

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
    <aside className="h-full w-20 lg:w-72 chat-sidebar border-r border-border flex flex-col fade-in">

      <div className="border-b border-border w-full p-4 bg-bg-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6 text-text-primary" />
            <span className="font-medium text-text-primary hidden lg:block">Chats</span>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-bg-tertiary">
            <Plus className="size-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border-none rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-success"
            />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full flex-1">
    {filteredUsers.map((user) => (
      <button
        key={user._id}
        onClick={() => setSelectedUser(user)}
        className={`
          w-full p-3 flex items-center gap-3 bg-bg-secondary
          hover:bg-bg-tertiary transition-colors
          ${selectedUser?._id === user._id ? "bg-success-light border-r-4 border-success" : ""}
        `}
      >
        <div className="relative mx-auto lg:mx-0">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.name}
            className="chat-avatar"
          />
          {onlineUsers.includes(user._id) && (
            <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full border-2 border-bg-secondary" />
          )}
        </div>

        {/* User info - only visible on larger screens */}
        <div className="hidden lg:block text-left min-w-0 flex-1">
          <div className="font-medium text-text-primary truncate">{user.fullName}</div>
          <div className="text-sm text-text-secondary">
            {onlineUsers.includes(user._id) ? "online" : "last seen recently"}
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
        <div className="border-t border-border w-full p-4 bg-bg-secondary">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-6 text-text-primary" />
            <span className="font-medium text-text-primary hidden lg:block">Groups</span>
          </div>
        </div>

        {filteredGroups.map((group) => (
          <button
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`
              w-full p-3 flex items-center gap-3 bg-bg-secondary
              hover:bg-bg-tertiary transition-colors
              ${selectedGroup?._id === group._id ? "bg-success-light border-r-4 border-success" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              {group.profilePic ? (
                <img
                  src={group.profilePic}
                  alt={group.name}
                  className="chat-avatar"
                />
              ) : (
                <div className="size-12 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-bg-primary font-bold text-lg">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium text-text-primary truncate">{group.name}</div>
              <div className="text-sm text-text-secondary">
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
