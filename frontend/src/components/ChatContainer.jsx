import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    selectedGroup,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToUserUpdates,
    unsubscribeFromUserUpdates,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    const chatId = selectedUser?._id || selectedGroup?._id;
    if (chatId) {
      getMessages(chatId);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, selectedGroup?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    subscribeToUserUpdates();

    return () => unsubscribeFromUserUpdates();
  }, [subscribeToUserUpdates, unsubscribeFromUserUpdates]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto chat-bg p-6 space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = authUser && message.senderId === authUser._id;
          const isLastMessage = index === messages.length - 1;
          return (
            <div
              key={message._id}
              className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}
              ref={isLastMessage ? messageEndRef : null}
            >
              <div className={`flex items-end gap-3 max-w-[80%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"} w-full`}>
                {!isOwnMessage && (
                  <img
                    src={
                      selectedUser
                        ? selectedUser.profilePic || "/avatar.png"
                        : message.senderId.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="chat-avatar flex-shrink-0 shadow-lg"
                  />
                )}
                <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} min-w-0`}>
                  {selectedGroup && !isOwnMessage && (
                    <div className="text-sm text-text-secondary mb-2 px-3 font-semibold drop-shadow-sm">
                      {message.senderId.fullName}
                    </div>
                  )}
                  <div className={isOwnMessage ? "message-bubble-sent" : "message-bubble-received"}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[250px] rounded-xl mb-3 shadow-lg"
                      />
                    )}
                    {message.text && <p className="text-base leading-relaxed m-0 break-words">{message.text}</p>}
                  </div>
                  <div className={`text-xs mt-1 px-2 ${isOwnMessage ? "text-right" : "text-left"} text-text-muted`}>
                    {formatMessageTime(message.createdAt)}
                    {isOwnMessage && <span className="ml-1 text-primary">✓✓</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
