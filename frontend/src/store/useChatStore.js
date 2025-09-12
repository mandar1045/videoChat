import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupsLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set({ groups: [...get().groups, res.data] });
      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/groups/${groupId}`);
      set({ groups: get().groups.filter(g => g._id !== groupId) });
      if (get().selectedGroup?._id === groupId) {
        set({ selectedGroup: null });
      }
      toast.success("Group deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateGroupProfilePic: async (groupId, profilePic) => {
    try {
      const res = await axiosInstance.put(`/groups/${groupId}/profile-pic`, { profilePic });
      set({ groups: get().groups.map(g => g._id === groupId ? res.data : g) });
      if (get().selectedGroup?._id === groupId) {
        set({ selectedGroup: res.data });
      }
      toast.success("Group profile picture updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getMessages: async (chatId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${chatId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, selectedGroup, messages } = get();
    try {
      const chatId = selectedUser ? selectedUser._id : selectedGroup._id;
      const data = selectedGroup ? { ...messageData, groupId: selectedGroup._id } : messageData;
      const res = await axiosInstance.post(`/messages/send/${chatId}`, data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, selectedGroup } = get();
    if (!selectedUser && !selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;
      const isMessageFromSelectedGroup = selectedGroup && newMessage.groupId === selectedGroup._id;
      if (!isMessageFromSelectedUser && !isMessageFromSelectedGroup) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, selectedGroup: null }),
  setSelectedGroup: (selectedGroup) => set({ selectedGroup, selectedUser: null }),
}));
